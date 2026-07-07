import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ProbabilityBucket } from "@/types";
import { ProbabilityCard } from "./ProbabilityCard";

interface ProbabilityBucketsProps {
  buckets: ProbabilityBucket[];
}

export function ProbabilityBuckets({ buckets }: ProbabilityBucketsProps) {
  return (
    <section>
      <SectionHeader
        variant="title"
        title="Browse by Probability"
        subtitle="From longshots to near certainties"
        className="anim-rise mb-3.5"
      />
      <div className="grid grid-cols-5 gap-4">
        {buckets.map((bucket) => (
          <ProbabilityCard key={bucket.id} bucket={bucket} />
        ))}
      </div>
    </section>
  );
}
