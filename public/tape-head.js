// The tape head, which runs on the audio thread. Loaded by app/snkrwavs/tape.ts,
// and a plain file rather than part of the app because that is what an audio
// worklet is given: a URL to load itself from.
//
// A browser will not play a recording backwards. A media element takes no
// negative rate, and rocking a reel is as much backwards as forwards, so the part
// being listened to is handed to this as plain samples and read here instead — at
// whatever speed and in whichever direction the hand is going. That is what a
// tape head does, and it is why it sounds like one: the pitch, the drag at a
// crawl, the chirp at a spool and the silence when a hand stops are all just what
// reading samples faster or slower than they were written sounds like.
//
// What it is told is a position, sixty times a second, and never a speed. Speed
// is worked out here from how that position moves, which is the only way round
// that keeps the sound and the picture agreeing: the page drags the clock, and
// both of us follow it.

// Seconds of slack between the hand and the tape. This is the flywheel, and it
// earns its keep twice: it smooths the steps a pointer arrives in, and it is why
// the sound coasts to a stop when a hand stops instead of being cut off.
const SLACK = 0.035;

// Tape speeds, as multiples of the speed it was recorded at. Below the first of
// them there is nothing to hear, because a tape held still against a head is
// silence and not a tone; by the second the head is at its full weight.
const STILL = 0.05;
const FULL = 0.3;

// How many samples may be averaged into one. Read faster than it was written and
// several samples fall in the same moment, and averaging them is what a head does
// with them — it is why a spooling tape is a dull chirp rather than a bright
// scream of aliasing. The cap only bounds the work at speeds nobody meant to ask
// for.
const SPREAD = 64;

class TapeHead extends AudioWorkletProcessor {
  constructor() {
    super();

    // The reels this head has been handed, by file, and which of them is on the
    // machine. They live here rather than on the main thread because they are
    // handed over rather than copied, and this is the side that reads them.
    this.reels = new Map();
    this.reel = null;
    this.rate = 0;
    this.src = null;

    // Where the tape is, and where the hand has it. Both in the file's own
    // seconds, and kept as full-sized numbers: the difference between the two
    // over a single sample is what the speed is read from, and there is not the
    // room in a smaller number to see it.
    this.at = 0;
    this.to = 0;
    this.held = false;

    this.port.onmessage = (event) => this.hear(event.data);
  }

  hear(message) {
    if (message.do === "reel") {
      this.reels.set(message.src, {
        samples: message.samples,
        rate: message.rate,
      });

      // Two files is as much as this ever needs at once: the mix, and the one
      // part being listened to on its own. The rest can be decoded again if they
      // are ever asked for, and a phone would rather that than hold eight.
      for (const src of [...this.reels.keys()]) {
        if (this.reels.size <= 2) break;
        if (src === message.src || src === this.src) continue;

        this.reels.delete(src);

        // Said out loud, because the side that fetches and decodes is keeping
        // track of what this head has. Left unsaid, it would go on believing
        // this one still holds the mix and hand it nothing when a hand comes
        // back to it, which is a drag with no music in it at all.
        this.port.postMessage({ did: "dropped", src });
      }

      // Decoding can land in the middle of a drag, which is the ordinary case the
      // first time one is asked for: the reel goes on the machine while it turns.
      if (message.src === this.src) this.mount(this.src);

      return;
    }

    if (message.do === "grab") {
      this.src = message.src;
      this.at = message.at;
      this.to = message.at;
      this.held = true;
      this.mount(message.src);

      return;
    }

    if (message.do === "wind") {
      this.to = message.at;

      return;
    }

    if (message.do === "release") this.held = false;
  }

  mount(src) {
    const reel = this.reels.get(src);

    this.reel = reel ? reel.samples : null;
    this.rate = reel ? reel.rate : 0;
  }

  process(inputs, outputs) {
    const out = outputs[0][0];
    if (!out) return true;

    const reel = this.reel;
    if (!reel || !this.held) {
      // Left standing where the hand last had it, so that letting go and taking
      // hold again does not read as a jump.
      this.at = this.to;
      out.fill(0);

      return true;
    }

    // How much of the way to the hand the tape goes in one sample. Worked out
    // per block rather than per sample because it only depends on how fast this
    // machine is running.
    const ease = 1 - Math.exp(-1 / (SLACK * sampleRate));
    const last = reel.length - 1;

    for (let i = 0; i < out.length; i++) {
      const was = this.at;
      this.at += (this.to - this.at) * ease;

      // Speed, as a multiple of the speed the recording was made at, taken from
      // how far the tape moved in this one sample.
      const speed = Math.abs(this.at - was) * sampleRate;
      const weight = Math.min(1, (speed - STILL) / (FULL - STILL));
      if (weight <= 0) {
        out[i] = 0;
        continue;
      }

      out[i] = weight * this.read(reel, was * this.rate, this.at * this.rate, last);
    }

    return true;
  }

  // What passes under the head between one place on the tape and the next: a
  // sample, read between the two it falls between, while the hand is slower than
  // the recording — and the average of everything that went by once it is faster.
  read(reel, from, to, last) {
    if (to < 0 || to > last) return 0;

    const step = to - from;
    if (Math.abs(step) < 1.5) {
      const whole = Math.floor(to);
      const part = to - whole;
      const a = reel[whole];
      const b = whole < last ? reel[whole + 1] : a;

      return a + (b - a) * part;
    }

    const first = Math.max(0, Math.min(from, to));
    const past = Math.min(last, Math.max(from, to));
    const count = Math.min(SPREAD, Math.max(1, Math.round(past - first)));
    const stride = (past - first) / count;

    let sum = 0;
    for (let s = 0; s < count; s++) sum += reel[Math.round(first + s * stride)];

    return sum / count;
  }
}

registerProcessor("tape-head", TapeHead);
