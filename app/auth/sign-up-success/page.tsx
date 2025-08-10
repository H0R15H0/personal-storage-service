import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                サインアップありがとうございます！
              </CardTitle>
              <CardDescription>メールで確認してください</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                サインアップが正常に完了しました。ログインする前に、メールでアカウントを確認してください。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
