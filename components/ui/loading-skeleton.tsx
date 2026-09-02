import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OfferCardSkeleton() {
  return (
    <Card className="overflow-hidden border-white/45 bg-white/45 backdrop-blur-xl">
      <Skeleton className="mx-auto mt-5 h-16 w-32 bg-white/50" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4 bg-stone-100" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2 bg-stone-100" />
        <Skeleton className="h-4 w-2/3 bg-stone-100" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full bg-stone-100" />
      </CardFooter>
    </Card>
  );
}

export function OffersGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  );
}
