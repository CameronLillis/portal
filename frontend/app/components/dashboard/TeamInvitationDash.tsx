import style from "../../dashboard/dashboard.module.css";

export function TeamInvitationsDash() {
  return (
    <div className={style.card}>
      <h2 className={style.primaryTitle}>Invitations</h2>
      <p className="text-gray-400">You have no invitations at this time.</p>
    </div>
  );
}