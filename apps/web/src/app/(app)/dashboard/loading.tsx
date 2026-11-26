import { MessageCardSkeleton } from "@/modules/messaging";
import { ProfileHeaderSkeleton } from "@/modules/user";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

const Loading = () => (
  <>
    <Skeleton className="h-8 w-48 mb-4" />
    <ProfileHeaderSkeleton />

    <Separator className="my-6" />

    <div className="flex mx-auto w-fit gap-3 mb-6">
      <Skeleton className="h-8 w-24 rounded-md" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>

    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <MessageCardSkeleton key={i} />
      ))}
    </div>
  </>
);

export default Loading;
