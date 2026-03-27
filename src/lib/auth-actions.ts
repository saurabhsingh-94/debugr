"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: "AUTH_FAILURE: " + error.message };
  }

  // Update metadata with the chosen username if it exists
  if (username) {
    await supabase.auth.updateUser({
      data: { username: username.toLowerCase().trim() }
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const username = formData.get("username") as string;

  if (password !== confirmPassword) {
    return { message: "VALIDATION_ERROR: Passwords do not match" };
  }

  if (password.length < 8) {
    return { message: "VALIDATION_ERROR: Password must be at least 8 characters" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.toLowerCase().trim(),
        full_name: username, // Fallback for name-based logic elsewhere
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { message: "REGISTRATION_FAILURE: " + error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login?signup=success");
}

export async function signInWithGithub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (data?.url) {
    redirect(data.url);
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (data?.url) {
    redirect(data.url);
  }
}
