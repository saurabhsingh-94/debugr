"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithGithub() {
  await signIn("github", { redirectTo: "/dashboard" });
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutWithNextAuth() {
  await signOut({ redirectTo: "/login" });
}
