import { useRef } from "react";
import { PageHero } from "@/components/common/PageHero";
import { AllCategories } from "@/components/categories/AllCategories";
import { CategoryHeatmap } from "@/components/categories/CategoryHeatmap";
import { ComparisonTable } from "@/components/categories/ComparisonTable";
import { FeaturedCategories } from "@/components/categories/FeaturedCategories";
import { CategoriesRail } from "@/components/rail/CategoriesRail";
import { usePageReveal } from "@/hooks/usePageReveal";
import { categoriesPageData } from "@/data";

export function CategoriesPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  usePageReveal(rootRef);

  return (
    <div
      ref={rootRef}
      className="flex min-w-0 flex-1 items-start gap-6 px-6 py-5"
    >
      <main className="flex min-w-0 flex-1 flex-col gap-6">
        <PageHero
          title="Categories"
          subtitle="Browse India's predictions by topic. Every category contains its own events, entities, markets and historical archive."
          metrics={categoriesPageData.metrics}
          wideSubtitle
        />

        <FeaturedCategories categories={categoriesPageData.featured} />

        <AllCategories
          categories={categoriesPageData.all}
          insights={categoriesPageData.intelligence}
        />

        <div className="grid grid-cols-[minmax(0,11fr)_minmax(0,9fr)] items-start gap-6">
          <ComparisonTable rows={categoriesPageData.comparison} />
          <CategoryHeatmap heatmap={categoriesPageData.heatmap} />
        </div>
      </main>

      <CategoriesRail />
    </div>
  );
}
