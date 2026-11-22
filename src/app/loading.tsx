import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-1 items-center justify-center px-4 sm:px-6">
      <Card className="w-full max-w-4xl border-border/70 shadow-sm">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="size-10 shrink-0 animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-44 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
          <div className="flex gap-3">
            <div className="h-11 w-32 animate-pulse rounded-xl bg-muted" />
            <div className="h-11 w-24 animate-pulse rounded-xl bg-muted" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
