import { cookies } from "next/headers";
import { prisma } from "./db";

const COOKIE = "sijah_session";

export async function createSession(userId: string) {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });
  cookies().set(COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
  });
}

export async function destroySession() {
  const id = cookies().get(COOKIE)?.value;
  if (id) {
    await prisma.session.deleteMany({ where: { id } }).catch(() => {});
  }
  cookies().delete(COOKIE);
}

export async function getCurrentUser() {
  const id = cookies().get(COOKIE)?.value;
  if (!id) return null;
  const session = await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
