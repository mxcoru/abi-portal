import { InternalLoginButton, InternalLogoutButton } from "./InternalButtons";

export function LoginButton({
  isAuthEnabled,
  big,
}: {
  isAuthEnabled: boolean;
  big?: boolean;
}) {
  return <InternalLoginButton enabled={isAuthEnabled} big={big} />;
}

export function LogoutButton({
  isAuthEnabled,
  big,
}: {
  isAuthEnabled: boolean;
  big?: boolean;
}) {
  return <InternalLogoutButton enabled={isAuthEnabled} big={big} />;
}

export function AuthButton({
  isLoggedIn,
  isAuthEnabled,
  big,
}: {
  isLoggedIn: boolean;
  isAuthEnabled: boolean;
  big?: boolean;
}) {
  if (isLoggedIn) {
    return <LogoutButton isAuthEnabled={isAuthEnabled} big={big} />;
  }

  return <LoginButton isAuthEnabled={isAuthEnabled} big={big} />;
}
