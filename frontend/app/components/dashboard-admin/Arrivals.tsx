"use client";

import { useMemo, useState } from "react";
import styles from "../../dashboard-admin/admin.module.css";
type ArrivalState = "Not Arrived" | "Arrived" | "Checked In";

type Person = {
  id: string;
  name: string;
  email: string;
  team: string;
  track: "Software" | "Hardware";
  state: ArrivalState;
};

export default function Arrivals() {
  // const [people, setPeople ]
  // Means:
  // const people = result[0]
  // const setPeople = result[1]

  // useState()
  // Age: State Variable
  // setAge: Function to update variable
  // const [age, setAge] = useState(42)

  const [people, setPeople] = useState<Person[]>([
    {
      id: "p1",
      name: "Ava Nguyen",
      email: "ava.nguyen@unlv.edu",
      team: "Neon Ninjas",
      track: "Software",
      state: "Not Arrived",
    },
    {
      id: "p2",
      name: "Mateo Rivera",
      email: "mateo.rivera@unlv.edu",
      team: "Circuit Cowboys",
      track: "Hardware",
      state: "Arrived",
    },
    {
      id: "p3",
      name: "Sofia Patel",
      email: "sofia.patel@unlv.edu",
      team: "Desert Debuggers",
      track: "Software",
      state: "Checked In",
    },
    {
      id: "p4",
      name: "Jordan Lee",
      email: "jordan.lee@csn.edu",
      team: "Neon Ninjas",
      track: "Software",
      state: "Arrived",
    },
  ]);

  const [arrivalSearch, setArrivalSearch] = useState("");
  const [arrivalFilter, setArrivalFilter] = useState<
    "All" | ArrivalState | "Needs Check-In"
  >("All");

  const arrivalsStats = useMemo(() => {
    const totalPeople = people.length;
    const arrived = people.filter((p) => p.state === "Arrived").length;
    const checkedIn = people.filter((p) => p.state === "Checked In").length;
    const notArrived = people.filter((p) => p.state === "Not Arrived").length;
    return { totalPeople, arrived, checkedIn, notArrived };
  }, [people]);

  const filteredPeople = useMemo(() => {
    const q = arrivalSearch.trim().toLowerCase();

    return people
      .filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q)
        );
      })
      .filter((p) => {
        if (arrivalFilter === "All") return true;
        if (arrivalFilter === "Needs Check-In") return p.state === "Arrived";
        return p.state === arrivalFilter;
      });
  }, [people, arrivalSearch, arrivalFilter]);

  function markArrived(personId: string) {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId && p.state === "Not Arrived"
          ? { ...p, state: "Arrived" }
          : p,
      ),
    );
  }

  function checkIn(personId: string) {
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, state: "Checked In" } : p)),
    );
  }

  function undoCheckIn(personId: string) {
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, state: "Arrived" } : p)),
    );
  }

  return (
    <>
      {/* Dashboard Stats (top section)
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-5">
          <div className="text-sm opacity-70">Total People</div>
          <div className="mt-2 text-3xl font-semibold">
            {arrivalsStats.totalPeople}
          </div>
          <div className="mt-1 text-xs opacity-60">Arrivals list</div>
        </div>

        <div className="rounded-2xl border p-5">
          <div className="text-sm opacity-70">Arrived</div>
          <div className="mt-2 text-3xl font-semibold">
            {arrivalsStats.arrived}
          </div>
          <div className="mt-1 text-xs opacity-60">Needs check-in</div>
        </div>

        <div className="rounded-2xl border p-5">
          <div className="text-sm opacity-70">Checked In</div>
          <div className="mt-2 text-3xl font-semibold">
            {arrivalsStats.checkedIn}
          </div>
          <div className="mt-1 text-xs opacity-60">Completed</div>
        </div>
      </section> */}

      {/* Arrivals List */}
      <h2 className="text-lg font-semibold">Arrivals</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={styles.card}>
          <div className="text-sm opacity-70">Not Arrived</div>
          <div className="mt-1 text-2xl font-semibold">
            {arrivalsStats.notArrived}
          </div>
        </div>
        <div className={styles.card}>
          <div className="text-sm opacity-70">Arrived (Needs Check-In)</div>
          <div className="mt-1 text-2xl font-semibold">
            {arrivalsStats.arrived}
          </div>
        </div>
        <div className={styles.card}>
          <div className="text-sm opacity-70">Checked In</div>
          <div className="mt-1 text-2xl font-semibold">
            {arrivalsStats.checkedIn}
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={arrivalSearch}
            onChange={(e) => setArrivalSearch(e.target.value)}
            className="rounded-xl border bg-transparent px-3 py-2 text-sm"
            placeholder="Search name, email, team"
          />

          <select
            value={arrivalFilter}
            onChange={(e) =>
              setArrivalFilter(e.target.value as typeof arrivalFilter)
            }
            className="rounded-xl border bg-transparent px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            <option value="Needs Check-In">Needs Check-In</option>
            <option value="Not Arrived">Not Arrived</option>
            <option value="Arrived">Arrived</option>
            <option value="Checked In">Checked In</option>
          </select>
        </div>

        {/* People list/table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="opacity-70">
              <tr className="border-b">
                <th className="py-3 text-left font-medium">Person</th>
                <th className="py-3 text-left font-medium">Team</th>
                <th className="py-3 text-left font-medium">Track</th>
                <th className="py-3 text-left font-medium">State</th>
                <th className="py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPeople.map((p) => {
                const pill =
                  p.state === "Checked In"
                    ? "opacity-90"
                    : p.state === "Arrived"
                      ? "opacity-80"
                      : "opacity-70";

                return (
                  <tr key={p.id} className="border-b last:border-b-0">
                    <td className="py-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs opacity-60">{p.email}</div>
                    </td>
                    <td className="py-3">{p.team}</td>
                    <td className="py-3">{p.track}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${pill}`}
                      >
                        {p.state}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {/* {p.state === "Not Arrived" && (
                          <button
                            onClick={() => markArrived(p.id)}
                            className="rounded-lg border px-3 py-1.5 text-xs hover:opacity-80"
                          >
                            Mark Arrived
                          </button>
                        )}

                        {p.state === "Arrived" && (
                          <button
                            onClick={() => checkIn(p.id)}
                            className="rounded-lg border px-3 py-1.5 text-xs hover:opacity-80"
                          >
                            Check In
                          </button>
                        )}

                        {p.state === "Checked In" && (
                          <button
                            onClick={() => undoCheckIn(p.id)}
                            className="rounded-lg border px-3 py-1.5 text-xs hover:opacity-80"
                          >
                            Undo
                          </button>
                        )} */}

                        <button className="rounded-lg border px-3 py-1.5 text-xs hover:opacity-80">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPeople.length === 0 && (
                <tr>
                  <td className="py-6 text-center opacity-70" colSpan={5}>
                    No matching people.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
