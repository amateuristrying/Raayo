import { ChevronRight } from "lucide-react";
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
      <button
        type="button"
        aria-label="Scroll featured categories"
        className="absolute top-1/2 -right-3 flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-float transition-all hover:-translate-y-px hover:text-brand-700"
      >
        <ChevronRight className="size-4" />
      </button>
    </section>
  );
}
