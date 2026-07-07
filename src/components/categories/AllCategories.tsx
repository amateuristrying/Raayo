import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CategoryGridItem, CategoryInsight } from "@/types";
import { CategoryGridCard } from "./CategoryGridCard";
import { CategoryIntelligence } from "./CategoryIntelligence";

interface AllCategoriesProps {
  categories: CategoryGridItem[];
  insights: CategoryInsight[];
}

/** Full category directory with the intelligence strip filling the last row. */
export function AllCategories({ categories, insights }: AllCategoriesProps) {
  return (
    <section>
      <SectionHeader
        variant="title"
        title="All Categories"
        actionLabel="View all"
        className="anim-rise mb-3.5"
      />
      <div className="grid grid-cols-5 gap-3.5">
        {categories.map((category) => (
          <CategoryGridCard key={category.id} category={category} />
        ))}
        <CategoryIntelligence insights={insights} />
      </div>
    </section>
  );
}
