import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ExploreEntity } from "@/types";
import { EntityCard } from "./EntityCard";

interface BrowseEntitiesProps {
  entities: ExploreEntity[];
}

/** Horizontal entity carousel — Raayo's signature discovery section. */
export function BrowseEntities({ entities }: BrowseEntitiesProps) {
  return (
    <section>
      <SectionHeader
        variant="title"
        title="Browse by Entity"
        subtitle="People, Companies, Teams, Events & more"
        actionLabel="View all"
        className="anim-rise mb-3.5"
      />
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
        {entities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </section>
  );
}
