export default function Dashboard() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border p-5">
        <div className="text-sm opacity-70">Total Teams</div>
        <div className="mt-2 text-3xl font-semibold">23</div>
        <div className="mt-1 text-xs opacity-60">Mock value</div>
      </div>

      <div className="rounded-2xl border p-5">
        <div className="text-sm opacity-70">Checked In</div>
        <div className="mt-2 text-3xl font-semibold">141</div>
      </div>

      <div className="rounded-2xl border p-5">
        <div className="text-sm opacity-70">Submissions</div>
        <div className="mt-2 text-3xl font-semibold">12</div>
        <div className="mt-1 text-xs opacity-60">Mock value</div>
      </div>
    </section>
  );
}
