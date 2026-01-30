export default function EditTeams() {
  return (
    <section className="rounded-2xl border p-5 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">Teams</h2>

        <div className="flex flex-col gap-2 md:flex-row">
          <input
            className="rounded-xl border bg-transparent px-3 py-2 text-sm"
            placeholder="Search teams..."
          />
          <select className="rounded-xl border bg-transparent px-3 py-2 text-sm">
            <option>All Tracks</option>
            <option>Software</option>
            <option>Hardware</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="opacity-70">
            <tr className="border-b">
              <th className="py-3 text-left font-medium">Team</th>
              <th className="py-3 text-left font-medium">Members</th>
              <th className="py-3 text-left font-medium">Track</th>
              <th className="py-3 text-left font-medium">Status</th>
              <th className="py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                team: "Neon Ninjas",
                members: 5,
                track: "Software",
                status: "Ready",
              },
              {
                team: "Circuit Cowboys",
                members: 4,
                track: "Hardware",
                status: "Checked In",
              },
              {
                team: "Desert Debuggers",
                members: 2,
                track: "Software",
                status: "Incomplete",
              },
            ].map((row) => (
              <tr key={row.team} className="border-b last:border-b-0">
                <td className="py-3">{row.team}</td>
                <td className="py-3">{row.members}</td>
                <td className="py-3">{row.track}</td>
                <td className="py-3">
                  <span className="rounded-full border px-2 py-1 text-xs opacity-80">
                    {row.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg border px-3 py-1.5 text-xs hover:opacity-80">
                      View
                    </button>
                    <button className="rounded-lg border px-3 py-1.5 text-xs hover:opacity-80">
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
