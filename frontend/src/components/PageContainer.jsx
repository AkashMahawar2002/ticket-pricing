export function PageContainer({ eyebrow, title, description, children }) {
  return <main className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8">
    {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-coral">{eyebrow}</p>}
    {title && <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-ink">{title}</h1>}
    {description && <p className="mt-2 max-w-2xl text-slate-500">{description}</p>}
    <div className="mt-8">{children}</div>
  </main>;
}
