"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, destroySession, requireUser } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Email atau password salah" };

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return { error: "Email atau password salah" };

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function updatePasswordAction(formData: FormData) {
  const user = await requireUser();
  const oldPwd = String(formData.get("oldPassword") ?? "");
  const newPwd = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (newPwd !== confirm) return { error: "Konfirmasi password tidak cocok" };
  if (newPwd.length < 8) return { error: "Password minimal 8 karakter" };

  const ok = await bcrypt.compare(oldPwd, user.password);
  if (!ok) return { error: "Password lama salah" };

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(newPwd, 10) },
  });

  return { ok: true };
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  await prisma.user.update({
    where: { id: user.id },
    data: { username, email },
  });
  return { ok: true };
}
