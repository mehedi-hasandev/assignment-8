export default function BookDetailsLoading() {
  return (
    <main
      aria-label="Loading book details"
      aria-busy="true"
      className="flex-1 bg-[#0b1510] px-4 py-10 sm:px-6 sm:py-16"
    >
      <div className="mx-auto grid max-w-5xl animate-pulse gap-8 rounded-2xl border border-white/10 bg-[#111d17] p-5 sm:grid-cols-[minmax(220px,320px)_1fr] sm:gap-10 sm:p-8">
        <div className="mx-auto aspect-[2/3] w-full max-w-[320px] rounded-lg bg-white/10" />
        <div className="space-y-5 py-4">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-10 w-3/4 rounded bg-white/10" />
          <div className="h-5 w-1/2 rounded bg-white/10" />
          <div className="mt-10 h-24 rounded bg-white/10" />
        </div>
      </div>
    </main>
  );
}
