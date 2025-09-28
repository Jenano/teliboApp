import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResetPasswordForm from "./reset-password-form";

// Support both the legacy sync `searchParams` prop and the newer async version
// that needs to be awaited in Next.js App Router.

type SearchParams =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

export default async function ResetHeslaPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  // Cookies API is async in the latest Next.js — await it to avoid type errors
  const c = await cookies();
  const hasResetCookie = !!c.get("reset-ok");

  // Normalize searchParams (handle both sync and async shapes)
  const sp =
    typeof (searchParams as any)?.then === "function"
      ? await (searchParams as Promise<
          Record<string, string | string[] | undefined>
        >)
      : ((searchParams ?? {}) as Record<string, string | string[] | undefined>);

  const spVerified = sp?.verified;
  const verified =
    (typeof spVerified === "string"
      ? spVerified
      : Array.isArray(spVerified)
      ? spVerified[0]
      : undefined) === "1";

  // Require at least one proof that the link is valid: either the server-set
  // cookie (from /auth/callback) OR the `verified=1` flag in the querystring.
  // If neither is present, fall back to the expired message.
  if (!hasResetCookie && !verified) {
    redirect("/prihlaseni?mode=reset&msg=expired");
  }

  return <ResetPasswordForm />;
}
