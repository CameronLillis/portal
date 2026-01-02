"use client";
import style from "./dashboard.module.css";
import { useState } from "react";

const INITIAL_MEMBERS = ["Sally", "Alice", "Bob", "Kate", "Fred", "Alex", "Noah", "Billy"];
const TEAM_LIMIT = 5;

export default function RebelHackPage() {
  const [activeTab, setActiveTab] = useState("Team");
  const [teamName, setTeamName] = useState("");
  const [isTeamCreated, setIsTeamCreated] = useState(false);
  const [currentTeam, setCurrentTeam] = useState([{ name: "User" }]);   // The string "User" represents the current logged in user. In the future this would be dynamic.
  const [availableMembers, setAvailableMembers] = useState(INITIAL_MEMBERS);
  const [search, setSearch] = useState("");
  const [showDisbandModal, setShowDisbandModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTeam = () => {
    if (!teamName.trim()) return setError("Please enter a team name.");
    setIsTeamCreated(true);
  };

  const confirmDisband = () => {
    // The next two lines will free up the rest of the team members and reset the team state
    const membersToReturn = currentTeam.filter(member => member.name !== "User").map(member => member.name);
    setAvailableMembers([...availableMembers, ...membersToReturn]); 
    setCurrentTeam([{ name: "User" }]); // Only the team leader remains in their own team
    setIsTeamCreated(false);
    setShowDisbandModal(false);
  };

  const addMember = (name: string) => {
    if (currentTeam.length >= TEAM_LIMIT) return setError("Team is full.");
    setCurrentTeam([...currentTeam, { name }]); // Add new member as an object
    setAvailableMembers(availableMembers.filter(member => member !== name)); // Remove from available members
  };

  const removeMember = (name: string) => {
    if (name === "User") return; // Prevent removing team leader
    setCurrentTeam(currentTeam.filter(member => member.name !== name)); // Remove from current team
    setAvailableMembers([...availableMembers, name]); // Add back to available members
  };

  // Filter available members based on search input
  const filteredMembers = availableMembers.filter(member => member.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={style.pageContainer}>
      
      {error && (
        <div className={style.modalBackdrop}>
          <div className={style.card}>
            <h2 className={style.secondaryTitle}>Attention</h2>
            <p className="mb-6">{error}</p>
            <button onClick={() => setError(null)} className={style.primaryButton}>OK</button>
          </div>
        </div>
      )}
      
      {showDisbandModal && (
        <div className={style.modalBackdrop}>
          <div className={style.card}>
            <h2 className={style.secondaryTitle}>Disband Team?</h2>
            <p className="mb-6">Are you sure?</p>
            <div className="flex gap-5">
              <button onClick={() => setShowDisbandModal(false)} className={style.secondaryButton}>Cancel</button>
              <button onClick={confirmDisband} className={style.warnButton}>Disband</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className={style.sidebar}>
          <div className="mb-10 text-2xl text-[var(--primary)]">☰</div>
          <nav>
            {["Team", "Schedule", "Submissions"].map((option) => (
              <div key={option} onClick={() => setActiveTab(option)} className={`${style.option} ${activeTab === option ? style.active : ""}`}>
                {option}
              </div>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-10">
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-bold tracking-widest text-[var(--primary)]">REBEL HACKS</h1>
            <div>User</div>
          </header>

          <div className="max-w-5xl mx-auto space-y-8">
            
            {activeTab === "Team" && (
              !isTeamCreated ? (
                <div className={style.card}>
                    <h2 className={style.primaryTitle}>Create a Team</h2>
                    <input type="text" className={style.inputContainer} value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" />
                    <button onClick={handleCreateTeam} className={`${style.primaryButton} mt-4`}>Create</button>
                </div>
              ) : (
                <div className={style.card}>
                  <div className="flex justify-between mb-6">
                    <h1 className={style.primaryTitle}>{teamName}</h1>
                    <button onClick={() => setShowDisbandModal(true)} className={style.warnButton}>Disband</button>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <h3 className={style.secondaryTitle}>Members ({currentTeam.length}/5)</h3>
                      {currentTeam.map((m) => (
                        <div key={m.name} className="flex justify-between p-2 bg-white/5 mb-2 rounded">
                          <span>{m.name}</span>
                          {m.name !== "User" && <button onClick={() => removeMember(m.name)} className="text-red-400 text-xs">Remove</button>}
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className={style.secondaryTitle}>Invite</h3>
                      <input type="text" placeholder="Search..." className={style.inputContainer} value={search} onChange={(e) => setSearch(e.target.value)} />
                      <div className="mt-2 h-40 overflow-y-auto">
                        {filteredMembers.map((m) => (
                          <div key={m} className="flex justify-between p-2 border-b border-white/10">
                            {m} <button onClick={() => addMember(m)} className="text-[var(--primary)]">+</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {activeTab === "Schedule" && (
              <div className={style.card}>
                <h2 className={style.primaryTitle}>Event Schedule</h2>
                
                <h3 className="text-[var(--primary)] font-bold mt-6 mb-3 text-lg">Friday, February 20th</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>8:00 AM - 9:00 AM: Check In & Breakfast</li>
                  <li>9:00 AM - 10:30 AM: Opening Ceremony</li>
                  <li>10:30 AM - 11:00 AM: Team Lock-In & Hacking Begins</li>
                  <li>2:00 PM - 3:00 PM: Lunch</li>
                  <li>7:00 PM - 8:00 PM: Dinner</li>
                  <li>9:30 PM: Hackers Exit UNLV</li>
                </ul>

                <h3 className="text-[var(--primary)] font-bold mt-8 mb-3 text-lg">Saturday, February 21st</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>8:00 AM - 9:00 AM: Breakfast</li>
                  <li>11:00 AM:Project Submission</li>
                  <li>12:00 PM - 1:00 PM: Lunch</li>
                  <li>2:00 PM - 4:00 PM: Judging</li>
                  <li>6:00 - 6:30 PM: Closing Ceremony</li>
                </ul>
              </div>
            )}

            {activeTab === "Submissions" && (
              <div className={style.card}>
                <h2 className={style.primaryTitle}>Project Submission</h2>
                <p className="text-gray-400 mt-4">Submission stuff goes here...</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}