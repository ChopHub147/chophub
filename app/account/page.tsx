"use client";

import Link from "next/link";
import { useState } from "react";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const url = mode === "login" ? "/api/customers/login" : "/api/customers/signup";
    const body = mode === "login" ? { phone, password } : { name, phone, email, password };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#fffefe] px-5 py-10 pb-24 text-[#10231b] sm:px-8">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-black">You're signed in!</h1>
          <p className="mt-2 text-sm text-[#53625d]">You can now view your order history.</p>
          <Link href="/orders" className="mt-6 inline-flex rounded-full bg-[#07833f] px-6 py-3 text-sm font-bold text-white">View Orders</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffefe] px-5 py-10 pb-24 text-[#10231b] sm:px-8">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-semibold text-[#07833f]">← Back to Home</Link>
        <h1 className="mt-4 text-3xl font-black tracking-tight">{mode === "login" ? "Sign In" : "Create Account"}</h1>
        <div className="mt-4 flex gap-2 text-sm font-semibold">
          <button type="button" onClick={() => setMode("login")} className={`rounded-full px-4 py-2 ${mode === "login" ? "bg-[#07833f] text-white" : "bg-[#f0f9f1] text-[#244438]"}`}>Sign In</button>
          <button type="button" onClick={() => setMode("signup")} className={`rounded-full px-4 py-2 ${mode === "signup" ? "bg-[#07833f] text-white" : "bg-[#f0f9f1] text-[#244438]"}`}>Sign Up</button>
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          {mode === "signup" && (
            <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-black/10 px-4 py-3 text-sm" />
          )}
          <input required placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {mode === "signup" && (
            <input type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-black/10 px-4 py-3 text-sm" />
          )}
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="mt-2 rounded-full bg-[#07833f] px-6 py-3 text-sm font-bold text-white disabled:opacity-60">
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
