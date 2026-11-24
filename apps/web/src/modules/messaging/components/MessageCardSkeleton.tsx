import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const MessageCardSkeleton = () => (
  <Card className="w-full max-w-2xl shadow-sm border-0">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div className="space-y-2 mb-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-10" />
      </div>
    </CardContent>
  </Card>
);

export { MessageCardSkeleton };
