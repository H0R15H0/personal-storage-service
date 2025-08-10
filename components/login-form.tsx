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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/protected");
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
          <CardTitle className="text-xl sm:text-2xl">ログイン</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            アカウントにログインするためのメールアドレスを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleLogin}>
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <Label htmlFor="password" className="text-sm sm:text-base">
                    パスワード
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="sm:ml-auto text-xs sm:text-sm underline-offset-4 hover:underline"
                  >
                    パスワードを忘れましたか？
                  </Link>
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
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
            </div>
            <div className="mt-4 text-center text-xs sm:text-sm">
              アカウントをお持ちでないですか？{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                新規登録
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
