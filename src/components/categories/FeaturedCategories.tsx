import { SectionHeader } from "@/components/ui/SectionHeader";
import type { FeaturedCategory } from "@/types";
import { FeaturedCategoryCard } from "./FeaturedCategoryCard";

interface FeaturedCategoriesProps {
  categories: FeaturedCategory[];
}

/** Hero content of the Categories page — editorial category cards. */
export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="relative">
      <SectionHeader
        variant="title"
        title="Featured Categories"
        actionLabel="View all categories"
        className="anim-rise mb-3.5"
      />
      <div className="grid grid-cols-4 gap-5">
        {categories.map((category) => (
          <FeaturedCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
