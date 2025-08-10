"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)}
      {...props}
    >
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">新規登録</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            新しいアカウントを作成
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 sm:h-12 text-sm sm:text-base"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-sm sm:text-base">
                    パスワード
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 sm:h-12 text-sm sm:text-base"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="repeat-password"
                    className="text-sm sm:text-base"
                  >
                    パスワード（再入力）
                  </Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="h-11 sm:h-12 text-sm sm:text-base"
                />
              </div>
              {error && (
                <p className="text-xs sm:text-sm text-red-500 p-2 bg-red-50 rounded-md">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? "アカウント作成中..." : "新規登録"}
              </Button>
            </div>
            <div className="mt-4 text-center text-xs sm:text-sm">
              すでにアカウントをお持ちですか？{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                ログイン
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
