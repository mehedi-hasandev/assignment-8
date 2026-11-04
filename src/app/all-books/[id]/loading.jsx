export default function BookDetailsLoading() {
  return (
    <main
      aria-label="Loading book details"
      aria-busy="true"
      className="flex-1 bg-white px-4 py-10 sm:px-6 sm:py-16"
    >
      <div className="mx-auto grid max-w-5xl animate-pulse gap-8 rounded-2xl border border-[#781868]/20 bg-white p-5 sm:grid-cols-[minmax(220px,320px)_1fr] sm:gap-10 sm:p-8">
        <div className="mx-auto aspect-[2/3] w-full max-w-[320px] rounded-lg bg-slate-100" />
        <div className="space-y-5 py-4">
          <div className="h-4 w-24 rounded bg-slate-100" />
          <div className="h-10 w-3/4 rounded bg-slate-100" />
          <div className="h-5 w-1/2 rounded bg-slate-100" />
          <div className="mt-10 h-24 rounded bg-slate-100" />
        </div>
      </div>
    </main>
  );
}
