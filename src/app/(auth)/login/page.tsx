"use client";

import { motion } from "framer-motion";
import { Github, Chrome, Users, Server, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signInWithGithub, signInWithGoogle } from "@/lib/auth-actions";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/city-bg.png"
          alt="background"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        {/* Dark overlay — keeps card readable */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)"
        }} />
      </div>

      {/* TOP NAVBAR */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-black/30 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <Image src="/logo.svg" alt="debugr" fill className="object-contain" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-white">debugr</span>
            <p className="text-[10px] text-zinc-500 leading-none">intelligent problem tracking</p>
          </div>
        </Link>

        {/* FLOATING STATS */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-xl backdrop-blur-sm">
            <Server className="w-4 h-4 text-violet-400" />
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Active Sessions</p>
              <p className="text-sm font-bold text-white leading-tight">2,841</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-xl backdrop-blur-sm">
            <Users className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Total Users</p>
              <p className="text-sm font-bold text-white leading-tight">72,840</p>
            </div>
          </div>
        </div>
      </header>

      {/* CENTER CONTENT */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[900px] rounded-2xl overflow-hidden flex shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/[0.07]"
        >
          {/* LEFT — BRAND PANEL */}
          <div className="relative hidden md:flex flex-col items-center justify-center flex-1 p-12 text-center overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #0d0d14 0%, #0a0a10 60%, #0f0a1a 100%)"
            }}
          >
            {/* Decorative gradient blobs */}
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-violet-600/10 blur-[60px] pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/8 blur-[50px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Logo */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-16 h-16">
                  <Image src="/logo.svg" alt="debugr" fill className="object-contain" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase font-medium">Welcome to</p>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight mt-0.5">debugr</h1>
                </div>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed max-w-[240px]">
                Post problems, find solutions, and buy or sell AI prompts — all in one place.
              </p>

              <div className="pt-2 space-y-2 w-full">
                <p className="text-xs text-zinc-600 font-medium">Additionally you can</p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/marketplace">
                    <button className="px-4 py-2 rounded-full border border-white/10 text-xs font-semibold text-zinc-300 hover:bg-white/5 hover:border-white/20 transition-all">
                      Browse Marketplace
                    </button>
                  </Link>
                  <Link href="/dashboard">
                    <button className="px-4 py-2 rounded-full border border-white/10 text-xs font-semibold text-zinc-300 hover:bg-white/5 hover:border-white/20 transition-all">
                      View Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* VERTICAL DIVIDER */}
          <div className="hidden md:block w-px bg-white/[0.06]" />

          {/* RIGHT — AUTH PANEL */}
          <div className="flex-1 p-10 flex flex-col justify-center"
            style={{ background: "#0c0c14" }}
          >
            <div className="space-y-7">
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRight className="w-4 h-4 text-white" />
                  <h2 className="text-xl font-bold text-white">Sign In</h2>
                </div>
                <p className="text-sm text-zinc-600 pl-6">Welcome back — sign in to your account</p>
              </div>

              {/* OAuth buttons */}
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    await signInWithGoogle();
                  }}
                  className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-100 active:scale-[0.98] transition-all shadow-lg"
                >
                  <Chrome className="w-4 h-4" />
                  Continue with Google
                </button>

                <button
                  onClick={async () => {
                    await signInWithGithub();
                  }}
                  className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-[#24292e] text-white text-sm font-semibold hover:bg-[#2d3339] active:scale-[0.98] transition-all border border-white/10"
                >
                  <Github className="w-4 h-4" />
                  Continue with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-xs text-zinc-700 font-medium">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Email login placeholder */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 pl-0.5">Email or Username</label>
                  <input
                    type="text"
                    disabled
                    placeholder="coming soon..."
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-zinc-600 placeholder-zinc-700 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-400 pl-0.5">Password</label>
                    <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</button>
                  </div>
                  <input
                    type="password"
                    disabled
                    placeholder="••••••••"
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-zinc-600 placeholder-zinc-700 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Primary Login button (gradient like WispByte) */}
              <button
                onClick={() => signInWithGoogle()}
                className="w-full h-11 rounded-xl text-white text-sm font-bold transition-all active:scale-[0.98] relative overflow-hidden"
                style={{ background: "linear-gradient(90deg, #7c3aed 0%, #312e81 50%, #14532d 100%)" }}
              >
                <span className="relative z-10">Sign In</span>
              </button>

              {/* Sign up link */}
              <div className="text-center">
                <Link href="/signup" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Create a new account
                </Link>
              </div>

              {/* Social icons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => signInWithGoogle()}
                  className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <Chrome className="w-4 h-4" />
                </button>
                <button
                  onClick={() => signInWithGithub()}
                  className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <Github className="w-4 h-4" />
                </button>
              </div>

              {/* TOS */}
              <p className="text-center text-[11px] text-zinc-700">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors underline underline-offset-2">Terms of Service</Link>
                {" & "}
                <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors underline underline-offset-2">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
