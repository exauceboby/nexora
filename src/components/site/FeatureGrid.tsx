export default function FeatureGrid({
  items,
}: {
  items: Array<{ title: string; desc: string }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="text-base font-semibold">{it.title}</div>
          <p className="mt-2 text-sm text-slate-600">{it.desc}</p>
        </div>
      ))}
    </div>
  );
}
