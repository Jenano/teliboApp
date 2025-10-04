import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResetPasswordForm from "./reset-password-form";

export default async function ResetHeslaPage() {
  const c = await cookies();
  const hasResetCookie = !!c.get("reset-ok");

  if (!hasResetCookie) {
    redirect("/prihlaseni?mode=reset&msg=expired");
  }

  return <ResetPasswordForm />;
}
