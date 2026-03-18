export default function ServerErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">TeachLens</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Server error</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          TeachLens hit an unexpected server problem. Please try again.
        </p>
      </div>
    </main>
  );
}
