import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function EnvVarWarning() {
  return (
    <div className="flex gap-2 sm:gap-4 items-center min-w-0">
      <Badge
        variant={"outline"}
        className="font-normal text-xs hidden sm:inline-block"
      >
        Supabase環境変数が必要です
      </Badge>
      <Badge variant={"outline"} className="font-normal text-xs sm:hidden">
        設定必要
      </Badge>
      <div className="flex gap-2">
        <Button size="sm" variant={"outline"} disabled>
          ログイン
        </Button>
        <Button size="sm" variant={"default"} disabled>
          新規登録
        </Button>
      </div>
    </div>
  );
}
