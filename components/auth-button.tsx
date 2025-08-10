import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AccountButton } from "./account-button";
import { Button } from "./ui/button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <AccountButton userEmail={user.email || ""} />
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">ログイン</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">新規登録</Link>
      </Button>
    </div>
  );
}
