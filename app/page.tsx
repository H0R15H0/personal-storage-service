import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { CloudIcon, ImageIcon, VideoIcon, ShieldCheckIcon } from "lucide-react";

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
            <h1 className="text-4xl font-bold tracking-tight">
              写真・動画を安全に保存
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              大切な思い出を安全にクラウドに保存し、いつでもどこからでもアクセスできます。
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">写真保存</h3>
                <p className="text-muted-foreground">
                  高画質の写真を無制限にアップロードして安全に保存
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <VideoIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">動画保存</h3>
                <p className="text-muted-foreground">
                  大容量の動画ファイルも高速でアップロード可能
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">安全性</h3>
                <p className="text-muted-foreground">
                  エンドツーエンド暗号化で大切なデータを保護
                </p>
              </div>
            </div>
            
            {hasEnvVars && (
              <div className="mt-12">
                <Link 
                  href="/auth/sign-up" 
                  className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  今すぐ始める
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
