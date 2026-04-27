import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardShell } from "@/components/DashboardShell";
import { Topbar } from "@/components/Topbar";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <DashboardShell>
      <Topbar title={`Selamat datang, ${user.username}!`} />
      <h2 className="text-xl font-bold text-ink-900 mb-5">Detail Profile</h2>
      <ProfileForm
        initial={{
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        }}
      />
    </DashboardShell>
  );
}
