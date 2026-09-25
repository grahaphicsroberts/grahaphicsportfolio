import { redirect } from "next/navigation";

// The short address. Each song has a page of its own under here, so this is
// where a list of them belongs once there is more than one to list; until then
// it hands straight over to the only one there is.
//
// A temporary redirect on purpose: this address is going to answer for itself
// eventually, and a permanent one would be remembered by every browser that
// followed it in the meantime.
export default function SnkrwavsPage() {
  redirect("/snkrwavs/sharp-knife");
}
