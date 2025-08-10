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
        <nav className="w-full flex justify-center border-b border-b-foreground/10 min-h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-4 sm:px-5 text-sm">
            <div className="flex gap-2 items-center font-semibold">
              <Link href={"/"} className="flex items-center gap-2">
                <CloudIcon size="18" className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">ストレージサービス</span>
              </Link>
            </div>
            <div className="flex-shrink-0">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col gap-12 sm:gap-20 max-w-5xl p-4 sm:p-5">
          <div className="text-center space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-float">
              <span className="gradient-text">写真・動画を</span>
              <br />
              <span className="text-foreground">安全に保存</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              大切な思い出を美しく保存し、いつでもどこからでもアクセス✨
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4 sm:px-0">
              <div className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 rounded-2xl glass-effect hover:scale-105 transition-all duration-300 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-kpop-pink to-kpop-purple rounded-2xl flex items-center justify-center mx-auto animate-pulse-slow group-hover:animate-bounce-slow">
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  写真保存
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  高画質の写真を無制限にアップロードして安全に保存💖
                </p>
              </div>

              <div className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 rounded-2xl glass-effect hover:scale-105 transition-all duration-300 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-kpop-purple to-kpop-blue rounded-2xl flex items-center justify-center mx-auto animate-pulse-slow group-hover:animate-bounce-slow">
                  <VideoIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  動画保存
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  大容量の動画ファイルも高速でアップロード可能🎬
                </p>
              </div>

              <div className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 rounded-2xl glass-effect hover:scale-105 transition-all duration-300 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-kpop-blue to-kpop-green rounded-2xl flex items-center justify-center mx-auto animate-pulse-slow group-hover:animate-bounce-slow">
                  <ShieldCheckIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  安全性
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  エンドツーエンド暗号化で大切なデータを保護🛡️
                </p>
              </div>
            </div>

            {hasEnvVars && (
              <div className="mt-12 sm:mt-16">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl font-bold text-white bg-gradient-kpop hover:bg-gradient-kpop-hover rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-gradient-x"
                >
                  今すぐ始める 🚀
                </Link>
              </div>
            )}
          </div>
        </div>

        <footer className="w-full flex flex-col sm:flex-row items-center justify-center border-t mx-auto text-center text-xs gap-4 sm:gap-8 py-8 sm:py-16 px-4">
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
