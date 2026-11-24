import { ProfileHeaderSkeleton } from "@/modules/user";
import { Skeleton } from "@/shared/components/ui/skeleton";

const Loading = () => (
  <>
    <Skeleton className="h-8 w-48 mb-4" />
    <ProfileHeaderSkeleton />
  </>
);

export default Loading;
