// The sound of a ring being turned by hand.
//
// The picture of it is free: everything on the page is drawn from one clock, so a
// clock in a hand drags all nine layers along with it. The sound is the whole of
// the work. While a ring is being turned the recording is stopped — the transport
// is off the music, the way it is when a reel is rocked by hand — and this plays
// instead, reading the same recording out of memory at whatever speed the hand is
// going, in whichever direction, with the noise of a machine under it.
//
// Two things it costs, and both are only paid by someone who actually grabs a
// ring. The file has to be fetched again as bytes and decoded, which is a second
// or two on a phone; and it is held as samples, which at the rate below is about
// eighteen megabytes for a five-minute part. Held for the mix and for the one part
// being soloed, and no more than that.
//
// The first drag of a session has neither, so it is the noise alone, and the
// recording joins it when it lands — on the machine while the reel turns.

// What the tape is kept at. Far below the recording, because none of the fidelity
// survives being dragged about by a hand, and the dullness is the point: a tape
// is a dull thing. Low enough that a whole part fits in a phone's memory without
// being thought about.
const RATE = 16000;

// Mono, and not for the memory: a head reads one track. Two would put a stereo
// picture on a sound whose whole character is a mechanism.
const HEAD = "/tape-head.js";

// How loud the machine is under the music, and how fast the tape has to be going
// before each part of it is at full weight. The rumble is the reel and the hiss is
// the tape crossing the head, so the first is there from the moment anything
// moves and the second arrives with speed.
const RUMBLE = 0.1;
const RUMBLE_FULL = 1.5;
const HISS = 0.075;
const HISS_FULL = 6;

// What a finished mix sits at, and what the machine is set against. A part mixed
// to sit under six others is a long way under this — the melody is sixteen
// decibels below the drums — and a machine at one fixed level is louder than the
// quiet half of the record. So the noise is scaled to whatever is on the reel,
// and stays the same distance under it whichever part that is.
const LOUD = 0.45;

// Where the hiss sits, at rest and at a spool. Bandpassed rather than shelved so
// that it reads as a mechanism rather than as the top end of something else.
const HISS_LOW = 420;
const HISS_RISE = 220;

// How much of the way up the head is allowed to go. A master is mixed to sit just
// under the top, and a machine on top of that is over it, so the tape path is
// backed off by the room the noise needs.
const ROOM = 0.8;

// How long the machine takes to answer a change of speed, and how long its noise
// takes to stop once a ring is let go.
const FOLLOW = 0.05;
const STOP = 0.12;

// And how long it may sit doing nothing before the audio hardware is given back.
const IDLE = 5000;

let ctx: AudioContext | null = null;
let built: Promise<void> | null = null;
let head: AudioWorkletNode | null = null;
let noise: AudioBuffer | null = null;

// The files the head has been handed, and the ones on their way to it.
const sent = new Set<string>();
const coming = new Set<string>();

// And how loud each of them turned out to be, which is the machine's business.
const levels = new Map<string, number>();

// What is being turned, where the hand had it last and when that was, which is
// all it takes to know how fast the hand is going.
let holding: { src: string; offset: number } | null = null;
let hand: { at: number; when: number } | null = null;
let machine: {
  noise: AudioBufferSourceNode;
  hiss: BiquadFilterNode;
  hissGain: GainNode;
  rumble: BiquadFilterNode;
  rumbleGain: GainNode;
} | null = null;
let letting = 0;

// Safari answers with the callbacks and everything else with the promise. Asking
// for both is how one line covers the two.
const decode = (shop: BaseAudioContext, bytes: ArrayBuffer) =>
  new Promise<AudioBuffer>((resolve, reject) => {
    const asked = shop.decodeAudioData(bytes, resolve, reject);
    if (asked) asked.then(resolve, reject);
  });

// One track out of however many were decoded. A copy either way, since what comes
// back is handed to the audio thread rather than shared with it.
const fold = (decoded: AudioBuffer) => {
  const left = decoded.getChannelData(0);
  if (decoded.numberOfChannels < 2) return new Float32Array(left);

  const right = decoded.getChannelData(1);
  const one = new Float32Array(left.length);
  for (let i = 0; i < one.length; i++) one[i] = (left[i] + right[i]) / 2;

  return one;
};

// How loud a part is where it plays. Averaged over the stretches with something
// in them and not over the whole reel, so that a part waiting thirty bars for its
// entrance is not measured against its own silence, nor a quiet one against the
// one bar it leans on.
const level = (samples: Float32Array) => {
  const window = 2048;
  let sum = 0;
  let counted = 0;

  for (let i = 0; i + window <= samples.length; i += window) {
    let energy = 0;
    for (let j = i; j < i + window; j++) energy += samples[j] * samples[j];
    energy /= window;

    // Eighty decibels down is the tape being blank rather than the part being
    // quiet, and nothing is learned from averaging blank tape in.
    if (energy > 1e-8) {
      sum += energy;
      counted++;
    }
  }

  return counted ? Math.sqrt(sum / counted) : 0;
};

// How much machine the part on the reel can carry. A part no quieter than a mix
// gets all of it; anything under that gets the same share of it, so the noise sits
// where it did against the sound rather than over the top of it.
//
// Nothing known yet means nothing on the reel yet, which is the first drag of a
// session: the machine is the whole of the sound then and runs at full.
const carried = () => {
  const known = holding ? levels.get(holding.src) : undefined;

  return known === undefined ? 1 : Math.min(1, known / LOUD);
};

// Fetch a part and get it onto the head. The bytes come from the browser's own
// cache, the recording having been played already, and the decoding is done into
// a context that exists only to be asked for a sample rate: nothing is rendered
// through it.
const spool = (src: string) => {
  if (sent.has(src) || coming.has(src)) return;

  coming.add(src);

  void (async () => {
    try {
      const bytes = await (await fetch(src)).arrayBuffer();
      const shop = new OfflineAudioContext(1, RATE, RATE);
      const decoded = await decode(shop, bytes);
      const samples = fold(decoded);
      levels.set(src, level(samples));

      await built;
      if (!head) return;

      head.port.postMessage(
        { do: "reel", src, rate: decoded.sampleRate, samples },
        [samples.buffer],
      );
      sent.add(src);
    } finally {
      coming.delete(src);
    }
  })().catch(() => undefined);
};

const build = async (on: AudioContext) => {
  await on.audioWorklet.addModule(HEAD);

  head = new AudioWorkletNode(on, "tape-head", {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [1],
  });
  // A head only keeps two reels. Which one it let go of is its news to give, and
  // this is the side that has to hear it: a file believed to be on the machine
  // and not on it is a drag with nothing but the machine in it.
  head.port.onmessage = (event) => {
    if (event.data?.did === "dropped") sent.delete(event.data.src);
  };

  const room = on.createGain();
  room.gain.value = ROOM;

  head.connect(room).connect(on.destination);
};

// Two seconds of noise, kept and looped. Long enough that the loop is not a
// rhythm, short enough to be nothing to hold.
const grain = (on: AudioContext) => {
  if (noise) return noise;

  noise = on.createBuffer(1, Math.floor(on.sampleRate * 2), on.sampleRate);
  const one = noise.getChannelData(0);
  for (let i = 0; i < one.length; i++) one[i] = Math.random() * 2 - 1;

  return noise;
};

// Told to expect a hand: the one part of this that has to happen inside a tap,
// because a phone will not let a page make a sound it was not asked for. Called
// from the same gesture that starts the music, long before any ring is grabbed.
export const wake = () => {
  if (!ctx) {
    const Maker =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Maker) return;

    ctx = new Maker();
  }

  void ctx.resume();
  if (!built) built = build(ctx).catch(() => undefined);
};

// A ring taken hold of, at a moment in the song. The file is asked for here
// rather than earlier so that a page nobody drags never fetches or decodes
// anything: the first drag is the noise of the machine, and the music from the
// second.
export const grab = (src: string, offset: number, at: number) => {
  if (!ctx) wake();
  if (!ctx) return;

  const on = ctx;
  window.clearTimeout(letting);
  void on.resume();

  holding = { src, offset };
  hand = { at, when: performance.now() };
  spool(src);

  void Promise.resolve(built).then(() => {
    if (!head || holding?.src !== src) return;

    head.port.postMessage({ do: "grab", src, at: at + offset });
  });

  if (machine) return;

  const source = on.createBufferSource();
  source.buffer = grain(on);
  source.loop = true;

  const hiss = on.createBiquadFilter();
  hiss.type = "bandpass";
  hiss.Q.value = 0.9;
  hiss.frequency.value = HISS_LOW;

  const hissGain = on.createGain();
  hissGain.gain.value = 0;

  const rumble = on.createBiquadFilter();
  rumble.type = "lowpass";
  rumble.frequency.value = 130;
  rumble.Q.value = 1.4;

  const rumbleGain = on.createGain();
  rumbleGain.gain.value = 0;

  source.connect(hiss).connect(hissGain).connect(on.destination);
  source.connect(rumble).connect(rumbleGain).connect(on.destination);
  source.start();

  machine = { noise: source, hiss, hissGain, rumble, rumbleGain };
};

// Where the hand has the tape now. Everything else is worked out from the same
// two numbers the drawing is: where, and when.
export const wind = (at: number) => {
  const held = holding;
  if (!ctx || !held) return;

  if (head) head.port.postMessage({ do: "wind", at: at + held.offset });

  const now = performance.now();
  const past = hand;
  hand = { at, when: now };

  if (!machine || !past) return;

  // How fast the tape is going, as a multiple of the speed it was recorded at,
  // which is the one thing the noise of the machine is made of.
  const seconds = Math.max(0.001, (now - past.when) / 1000);
  const speed = Math.abs(at - past.at) / seconds;
  const when = ctx.currentTime;
  const room = carried();

  machine.rumbleGain.gain.setTargetAtTime(
    Math.min(1, speed / RUMBLE_FULL) * RUMBLE * room,
    when,
    FOLLOW,
  );
  machine.hissGain.gain.setTargetAtTime(
    Math.min(1, speed / HISS_FULL) * HISS * room,
    when,
    FOLLOW,
  );
  machine.hiss.frequency.setTargetAtTime(
    HISS_LOW + Math.min(speed, 24) * HISS_RISE,
    when,
    FOLLOW,
  );
};

// Let go. The noise stops with the hand, the head is told there is nobody on it,
// and if nothing takes hold again the machine is switched off and the audio
// hardware handed back.
export const release = () => {
  holding = null;
  hand = null;

  if (head) head.port.postMessage({ do: "release" });
  if (!ctx) return;

  const on = ctx;
  const when = on.currentTime;

  if (machine) {
    const going = machine;
    going.rumbleGain.gain.setTargetAtTime(0, when, STOP);
    going.hissGain.gain.setTargetAtTime(0, when, STOP);

    window.setTimeout(() => {
      if (machine !== going) return;

      going.noise.stop();
      going.noise.disconnect();
      going.hiss.disconnect();
      going.hissGain.disconnect();
      going.rumble.disconnect();
      going.rumbleGain.disconnect();
      machine = null;
    }, STOP * 4000);
  }

  window.clearTimeout(letting);
  letting = window.setTimeout(() => {
    if (!holding) void on.suspend();
  }, IDLE);
};
