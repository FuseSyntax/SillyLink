// src/components/ui/skeleton.tsx
const MetricSkeleton = () => (
    <div className="p-6 bg-white/70 rounded-xl border-2 border-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[60px]" />
          </div>
        </div>
        <Skeleton className="h-4 w-[50px]" />
      </div>
    </div>
  );