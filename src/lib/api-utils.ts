import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session;
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

export function ok<T>(data: T, init?: number) {
  return NextResponse.json({ success: true, data }, init ? { status: init } : undefined);
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}
