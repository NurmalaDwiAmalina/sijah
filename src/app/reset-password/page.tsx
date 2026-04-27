import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { AuthShell } from "@/components/AuthShell";
import { BRAND } from "@/lib/config";

export default function ResetPasswordPage() {
  return (
    <AuthShell heading={BRAND.resetHeading} subheading={BRAND.resetSubheading}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
