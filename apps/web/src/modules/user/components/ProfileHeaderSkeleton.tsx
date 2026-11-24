import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const ProfileHeaderSkeleton = () => (
  <Card className="w-full gap-1 shadow-sm border-none">
    <CardHeader className="pb-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <Skeleton className="h-3 w-48 mb-2" />

      <div className="flex items-center justify-between bg-background border border-border rounded-lg px-3 py-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-8 rounded-md ml-2" />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Skeleton className="h-5 w-9 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardContent>
  </Card>
);

export { ProfileHeaderSkeleton };
