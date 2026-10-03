export function Poster({
  eyebrow,
  lines,
  aside,
  as = "h1",
}: {
  eyebrow?: string;
  lines: string[];
  aside?: string;
  as?: "h1" | "h2";
}) {
  const Tag = as;
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {eyebrow ? <p className="font-display text-ui uppercase text-rowdy">{eyebrow}</p> : null}
      <Tag className="font-display text-display uppercase text-rowdy">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </Tag>
      {aside ? (
        <p className="mt-5 max-w-xs font-display text-[clamp(1.65rem,7vw,2.75rem)] uppercase leading-[1.2] text-rowdy">
          {aside}
        </p>
      ) : null}
    </div>
  );
}
