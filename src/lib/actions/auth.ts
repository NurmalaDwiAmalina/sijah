"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
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

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Email wajib diisi" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Pretend success agar tidak bisa enumerasi email
    return { ok: true as const, token: null };
  }

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordReset.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 jam
    },
  });

  // TODO production: kirim email berisi link /reset-password?token=...
  // Mode demo: token dikembalikan ke client biar bisa langsung dipakai
  return { ok: true as const, token };
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const newPwd = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!token) return { error: "Token tidak ada" };
  if (newPwd !== confirm) return { error: "Konfirmasi password tidak cocok" };
  if (newPwd.length < 8) return { error: "Password minimal 8 karakter" };

  const reset = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!reset) return { error: "Token tidak valid" };
  if (reset.used) return { error: "Token sudah pernah dipakai" };
  if (reset.expiresAt < new Date()) return { error: "Token sudah kadaluarsa" };

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { password: await bcrypt.hash(newPwd, 10) },
    }),
    prisma.passwordReset.update({
      where: { id: reset.id },
      data: { used: true },
    }),
    prisma.session.deleteMany({ where: { userId: reset.userId } }),
  ]);

  return { ok: true as const };
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const avatar = formData.get("avatar");

  const data: { username: string; email: string; avatar?: string | null } = {
    username,
    email,
  };
  if (typeof avatar === "string") {
    data.avatar = avatar || null;
  }

  await prisma.user.update({
    where: { id: user.id },
    data,
  });
  return { ok: true };
}
