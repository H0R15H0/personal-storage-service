import { CloudIcon, ImageIcon, ShieldCheckIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="flex items-center gap-2">
                <CloudIcon size="20" />
                ストレージサービス
              </Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>

        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight animate-float">
              <span className="gradient-text">写真・動画を</span>
              <br />
              <span className="text-foreground">安全に保存</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              大切な思い出を美しく保存し、いつでもどこからでもアクセス✨
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center space-y-6 p-6 rounded-2xl glass-effect hover:scale-105 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-kpop-pink to-kpop-purple rounded-2xl flex items-center justify-center mx-auto animate-pulse-slow group-hover:animate-bounce-slow">
                  <ImageIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">写真保存</h3>
                <p className="text-muted-foreground leading-relaxed">
                  高画質の写真を無制限にアップロードして安全に保存💖
                </p>
              </div>

              <div className="text-center space-y-6 p-6 rounded-2xl glass-effect hover:scale-105 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-kpop-purple to-kpop-blue rounded-2xl flex items-center justify-center mx-auto animate-pulse-slow group-hover:animate-bounce-slow">
                  <VideoIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">動画保存</h3>
                <p className="text-muted-foreground leading-relaxed">
                  大容量の動画ファイルも高速でアップロード可能🎬
                </p>
              </div>

              <div className="text-center space-y-6 p-6 rounded-2xl glass-effect hover:scale-105 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-kpop-blue to-kpop-green rounded-2xl flex items-center justify-center mx-auto animate-pulse-slow group-hover:animate-bounce-slow">
                  <ShieldCheckIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">安全性</h3>
                <p className="text-muted-foreground leading-relaxed">
                  エンドツーエンド暗号化で大切なデータを保護🛡️
                </p>
              </div>
            </div>

            {hasEnvVars && (
              <div className="mt-16">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center px-8 py-4 text-xl font-bold text-white bg-gradient-kpop hover:bg-gradient-kpop-hover rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-gradient-x"
                >
                  今すぐ始める 🚀
                </Link>
              </div>
            )}
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
