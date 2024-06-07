import { IsFeatureEnabled } from "@/lib/feature";
import { AppFeatures } from "@/lib/config/feature";
import { InternalLoginButton, InternalLogoutButton } from "./InternalButtons";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function LoginButton() {
  const IsLoginEnabled = await IsFeatureEnabled(AppFeatures.Authentication);

  return <InternalLoginButton enabled={IsLoginEnabled} />;
}

export async function LogoutButton() {
  const IsLogoutEnabled = await IsFeatureEnabled(AppFeatures.Authentication);

  return <InternalLogoutButton enabled={IsLogoutEnabled} />;
}

export async function AuthButton() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <LogoutButton />;
  }

  return <LoginButton />;
}
