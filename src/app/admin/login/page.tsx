import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Login Admin — Kelana Travel",
  description: "Masuk ke panel admin Kelana Travel",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="font-display text-xl font-extrabold text-primary">
            Kelana Travel Admin
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Masuk untuk mengelola konten website
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
