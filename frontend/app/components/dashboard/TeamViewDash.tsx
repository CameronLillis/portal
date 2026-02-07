import { useState } from "react";
import style from "../../dashboard/dashboard.module.css";
import type { TeamMemberView, AvailableUser } from "./Team";

interface TeamViewDashProps {
  teamName: string;
  isLeader: boolean;
  currentUserId: number;
  currentTeam: TeamMemberView[];
  availableMembers: AvailableUser[];
  teamLimit: number;
  onAction: (type: "add" | "remove" | "disband" | "leave", payload?: number) => void;
}

export function TeamViewDash({ teamName, isLeader, currentUserId, currentTeam, availableMembers, teamLimit, onAction }: TeamViewDashProps) {
  const [search, setSearch] = useState("");

  const filteredMembers = availableMembers.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`${style.card} space-y-8`}>
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-(--primary-light-border) pb-4 gap-4">
        <h1 className={style.primaryTitle}>{teamName}</h1>
        <div className="text-left md:text-right w-full md:w-auto">
          <div className="text-sm text-gray-400 mb-2">
            {currentTeam.length} / {teamLimit} Members
          </div>
          
          {isLeader ? (
            <button 
              onClick={() => onAction("disband")} 
              className={`${style.warnButton} text-xs w-full md:w-auto`}
            >
              DISBAND TEAM
            </button>
          ) : (
            <button 
              onClick={() => onAction("leave")} 
              className={`${style.warnButton} text-xs w-full md:w-auto`}
            >
              LEAVE TEAM
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        <div className={!isLeader ? "lg:col-span-2" : ""}>
          <h3 className={style.secondaryTitle}>Current Members</h3>
          <div className="space-y-3">
            {currentTeam.map((member, index) => (
              <div key={member.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={style.memberAvatar}>👤</div>
                  <span className="truncate max-w-[100px] md:max-w-none">{member.name}</span>
                  
                  {index === 0 && (
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase font-bold">
                      Leader
                    </span>
                  )}
                </div>

                {isLeader && member.id !== currentUserId && (
                  <button 
                    onClick={() => onAction("remove", member.id)} 
                    className={`${style.warnButton} text-xs`}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {isLeader && (
          <div>
            <h3 className={style.secondaryTitle}>Invite Members</h3>
            <input 
              type="text" 
              placeholder="Search users..." 
              className={style.inputContainer} 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
            <div className={`${style.primaryScroll} space-y-2 max-h-48 overflow-y-auto pr-2 mt-2`}>
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex justify-between items-center p-2 border-b border-white/5 hover:bg-white/5 rounded">
                  {member.name}
                  <button 
                    onClick={() => onAction("add", member.id)} 
                    className="text-[var(--primary)] cursor-pointer whitespace-nowrap"
                  >
                    + Invite
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}