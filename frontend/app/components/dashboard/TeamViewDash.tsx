import { useState, useEffect, useCallback } from "react";
import style from "../../dashboard/dashboard.module.css";
import api from "@/lib/api";
import { getJwtEmail } from "@/lib/auth";
import { TeamModals } from "./TeamModals";
import { useTeamContext } from "./TeamContext";
import type { Team, User } from "@/lib/types";

const TEAM_LIMIT = 5;

interface MemberView { id: number; name: string; email: string; }
interface AvailableUser { id: number; name: string; email: string; }

export function TeamViewDash() {
  const { teamId, currentUserId, refresh } = useTeamContext();
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDisbandModal, setShowDisbandModal] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [members, setMembers] = useState<MemberView[]>([]);
  const [availableMembers, setAvailableMembers] = useState<AvailableUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamData = useCallback(async () => {
    const email = getJwtEmail();
    if (!email) return;

    try {
      const [teams, users] = await Promise.all([
        api.get<Team[]>('/teams'),
        api.get<User[]>('/users'),
      ]);

      const team = teams.find(t => t.id === teamId);
      if (!team) return;

      setTeamName(team.teamName);
      setIsLeader(team.leaderId === currentUserId);

      // Build members list with leader first
      const sorted: MemberView[] = [];
      const leader = team.members?.find(m => m.id === team.leaderId);
      if (leader) sorted.push({ id: leader.id, name: leader.name || leader.email, email: leader.email });
      team.members?.forEach(m => {
        if (m.id !== team.leaderId) {
          sorted.push({ id: m.id, name: m.name || m.email, email: m.email });
        }
      });
      setMembers(sorted);

      // Available = users not in any team, excluding current user
      const available = users.filter(u => !u.team && u.email !== email);
      setAvailableMembers(available.map(u => ({ id: u.id, name: u.name || u.email, email: u.email })));
    } catch (err) {
      console.error('Failed to fetch team data:', err);
    } finally {
      setLoading(false);
    }
  }, [teamId, currentUserId]);

  useEffect(() => { fetchTeamData(); }, [fetchTeamData]);

  /* ---- Actions ---- */

  const addMember = async (userId: number) => {
    const currentIds = members.map(m => m.id);
    if (currentIds.length >= TEAM_LIMIT) {
      setError(`Maximum capacity reached! A team can only have ${TEAM_LIMIT} members.`);
      return;
    }
    try {
      await api.patch(`/teams/${teamId}/members`, { memberIds: [...currentIds, userId] });
      await fetchTeamData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const removeMember = async (userId: number) => {
    const newIds = members.map(m => m.id).filter(id => id !== userId);
    try {
      await api.patch(`/teams/${teamId}/members`, { memberIds: newIds });
      await fetchTeamData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const leaveTeam = async () => {
    const newIds = members.map(m => m.id).filter(id => id !== currentUserId);
    try {
      await api.patch(`/teams/${teamId}/members`, { memberIds: newIds });
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to leave team');
    }
  };

  const confirmDisband = async () => {
    try {
      await api.delete(`/teams/${teamId}`);
      setShowDisbandModal(false);
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disband team');
      setShowDisbandModal(false);
    }
  };

  const handleModalAction = (action: "closeError" | "cancelDisband" | "confirmDisband") => {
    if (action === "closeError") setError(null);
    if (action === "cancelDisband") setShowDisbandModal(false);
    if (action === "confirmDisband") confirmDisband();
  };

  const filteredMembers = availableMembers.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return null;

  return (
    <>
      <TeamModals
        state={{ error, showDisband: showDisbandModal, teamName }}
        onAction={handleModalAction}
      />

      <div className={`${style.card} space-y-8`}>
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-(--primary-light-border) pb-4 gap-4">
          <h1 className={style.primaryTitle}>{teamName}</h1>
          <div className="text-left md:text-right w-full md:w-auto">
            <div className="text-sm text-gray-400 mb-2">
              {members.length} / {TEAM_LIMIT} Members
            </div>
            
            {isLeader ? (
              <button 
                onClick={() => setShowDisbandModal(true)} 
                className={`${style.warnButton} text-xs w-full md:w-auto`}
              >
                DISBAND TEAM
              </button>
            ) : (
              <button 
                onClick={leaveTeam} 
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
              {members.map((member, index) => (
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
                      onClick={() => removeMember(member.id)} 
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
                      onClick={() => addMember(member.id)} 
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
    </>
  );
}