'use client';

import { TeamViewDash } from "./TeamViewDash";
import { TeamCreationDash } from "./TeamCreationDash";
import { TeamModals } from "./TeamModals";
import { TeamInvitationsDash } from "./TeamInvitationDash";
import { TeamProjectDash } from "./TeamProjectDash";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { Team as TeamType, User } from "@/lib/types";

const TEAM_LIMIT = 5;

/** Decode JWT payload to get current user email & roles */
function decodeJwt(): { email: string; roles: string[] } | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { email: payload.username ?? payload.email, roles: payload.roles ?? [] };
  } catch {
    return null;
  }
}

export interface TeamMemberView {
  id: number;
  name: string;
  email: string;
}

export interface AvailableUser {
  id: number;
  name: string;
  email: string;
}

export function Team() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDisbandModal, setShowDisbandModal] = useState(false);

  const [currentUser, setCurrentUser] = useState<TeamMemberView | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const [userTeam, setUserTeam] = useState<TeamType | null>(null);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);

  const fetchData = useCallback(async () => {
    const jwt = decodeJwt();
    if (!jwt) return;

    try {
      const [users, teams] = await Promise.all([
        api.get<User[]>('/users'),
        api.get<TeamType[]>('/teams'),
      ]);

      // Find current user from user list
      const me = users.find(u => u.email === jwt.email);
      if (me) {
        setCurrentUser({ id: me.id, name: me.name || me.email, email: me.email });
      }

      // Find user's team
      const myTeam = teams.find(t =>
        t.members?.some(m => m.email === jwt.email)
      ) ?? null;
      setUserTeam(myTeam);

      // Determine leader from team data, not JWT (JWT roles are stale until re-login)
      const meId = me?.id;
      setIsLeader(!!myTeam && myTeam.leaderId === meId);

      // Available users: those not in any team (and not the current user)
      const available = users.filter(u => !u.team && u.email !== jwt.email);
      setAvailableUsers(available.map(u => ({
        id: u.id,
        name: u.name || u.email,
        email: u.email,
      })));
    } catch (err) {
      console.error('Failed to fetch team data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---- Actions ---- */

  const handleTeamCreated = () => {
    fetchData();
  };

  const confirmDisband = async () => {
    if (!userTeam) return;
    try {
      await api.delete(`/teams/${userTeam.id}`);
      setShowDisbandModal(false);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disband team');
      setShowDisbandModal(false);
    }
  };

  const leaveTeam = async () => {
    if (!userTeam || !currentUser) return;
    try {
      const currentMemberIds = userTeam.members?.map(m => m.id) ?? [];
      const newMemberIds = currentMemberIds.filter(id => id !== currentUser.id);
      await api.patch(`/teams/${userTeam.id}/members`, { memberIds: newMemberIds });
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to leave team');
    }
  };

  const addMember = async (userId: number) => {
    if (!userTeam) return;
    const currentMemberIds = userTeam.members?.map(m => m.id) ?? [];
    if (currentMemberIds.length >= TEAM_LIMIT) {
      setError(`Maximum capacity reached! A team can only have ${TEAM_LIMIT} members.`);
      return;
    }
    try {
      await api.patch(`/teams/${userTeam.id}/members`, { memberIds: [...currentMemberIds, userId] });
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const removeMember = async (userId: number) => {
    if (!userTeam) return;
    const currentMemberIds = userTeam.members?.map(m => m.id) ?? [];
    const newMemberIds = currentMemberIds.filter(id => id !== userId);
    try {
      await api.patch(`/teams/${userTeam.id}/members`, { memberIds: newMemberIds });
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleTeamAction = (type: "add" | "remove" | "disband" | "leave", payload?: number) => {
    if (type === "disband") setShowDisbandModal(true);
    else if (type === "leave") leaveTeam();
    else if (type === "add" && payload !== undefined) addMember(payload);
    else if (type === "remove" && payload !== undefined) removeMember(payload);
  };

  const handleModalAction = (action: "closeError" | "cancelDisband" | "confirmDisband") => {
    if (action === "closeError") setError(null);
    if (action === "cancelDisband") setShowDisbandModal(false);
    if (action === "confirmDisband") confirmDisband();
  };

  const handleSaveProject = async (projectName: string, projectDetails: string) => {
    if (!userTeam) return;
    try {
      await api.patch(`/teams/${userTeam.id}`, { projectName, projectDetails });
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
    }
  };

  /* ---- Render ---- */

  if (loading) {
    return <div className="text-gray-400 text-center py-10">Loading...</div>;
  }

  const isTeamCreated = !!userTeam;
  const teamName = userTeam?.teamName ?? '';

  // Build members array with leader first
  const members: TeamMemberView[] = [];
  if (userTeam?.members) {
    const leaderId = userTeam.leaderId;
    const leaderMember = userTeam.members.find(m => m.id === leaderId);
    if (leaderMember) {
      members.push({ id: leaderMember.id, name: leaderMember.name || leaderMember.email, email: leaderMember.email });
    }
    userTeam.members.forEach(m => {
      if (m.id !== leaderId) {
        members.push({ id: m.id, name: m.name || m.email, email: m.email });
      }
    });
  }

  return (
    <>
      <TeamModals
        state={{ error, showDisband: showDisbandModal, teamName }}
        onAction={handleModalAction}
      />

      {isTeamCreated ? (
        <>
          <TeamViewDash
            teamName={teamName}
            isLeader={isLeader}
            currentUserId={currentUser?.id ?? 0}
            currentTeam={members}
            availableMembers={availableUsers}
            teamLimit={TEAM_LIMIT}
            onAction={handleTeamAction}
          />
          <TeamProjectDash
            isLeader={isLeader}
            project={userTeam?.project ?? { name: '', details: '' }}
            onSaveProject={handleSaveProject}
          />
        </>
      ) : (
        <>
          <TeamCreationDash onTeamCreated={handleTeamCreated} />
          <TeamInvitationsDash invitations={[]} onAction={() => {}} />
        </>
      )}
    </>
  );
}