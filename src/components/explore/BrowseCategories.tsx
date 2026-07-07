import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ExploreCategory } from "@/types";
import { CategoryCard } from "./CategoryCard";

interface BrowseCategoriesProps {
  categories: ExploreCategory[];
}

export function BrowseCategories({ categories }: BrowseCategoriesProps) {
  return (
    <section>
      <SectionHeader
        variant="title"
        title="Browse by Category"
        subtitle="Topics shaping India's markets"
        actionLabel="View all"
        className="anim-rise mb-3.5"
      />
      <div className="grid grid-cols-4 gap-5">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
