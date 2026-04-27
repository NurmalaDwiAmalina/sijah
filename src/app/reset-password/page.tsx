import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { AuthShell } from "@/components/AuthShell";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      heading={"Lupa\nPassword"}
      subheading="Reset password lama anda, dan buat password baru yang kuat"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
