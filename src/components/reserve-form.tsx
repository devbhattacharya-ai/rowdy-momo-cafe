import { type FormEvent, useState } from "react";
import { waLink } from "@/lib/cafe";

const field =
  "min-h-11 w-full rounded-card border border-butcher bg-velvet px-3 py-3 text-body-sm text-bone";

export function ReserveForm() {
  const [name, setName] = useState("");
  const [party, setParty] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [note, setNote] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = [
      "Hold a table at Rowdy Momo Cafe, Bandra West.",
      `Name: ${name || "not given"}`,
      `Party of ${party}`,
      `Date: ${date || "not given"}`,
      `Time: ${time}`,
      note ? `Note: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form id="reserve" onSubmit={submit} className="flex flex-col gap-4 rounded-card border border-butcher bg-stage p-4 md:p-6">
      <div>
        <h2 className="font-display text-heading-sm uppercase text-rowdy">Hold a table</h2>
        <p className="mt-2 text-body-sm text-blush">
          Sends a WhatsApp note to the cafe. Nothing is booked until they reply.
        </p>
      </div>
      <label className="flex flex-col gap-2 font-display text-caption uppercase text-blush">
        Name
        <input className={field} value={name} onChange={(event) => setName(event.target.value)} name="name" autoComplete="name" required />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-2 font-display text-caption uppercase text-blush">
          Party
          <select className={field} value={party} onChange={(event) => setParty(event.target.value)} name="party">
            {["1", "2", "3", "4", "5", "6", "7", "8"].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 font-display text-caption uppercase text-blush">
          Time
          <input className={field} type="time" value={time} onChange={(event) => setTime(event.target.value)} name="time" required />
        </label>
      </div>
      <label className="flex flex-col gap-2 font-display text-caption uppercase text-blush">
        Date
        <input className={field} type="date" value={date} onChange={(event) => setDate(event.target.value)} name="date" required />
      </label>
      <label className="flex flex-col gap-2 font-display text-caption uppercase text-blush">
        Note
        <textarea
          className={field}
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          name="note"
          placeholder="Window, birthday, no onion"
        />
      </label>
      <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-pill bg-rowdy px-3.5 py-2.5 font-display text-ui uppercase text-bone">
        Request the table
      </button>
    </form>
  );
}
