import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookmarksPage } from "@/pages/Bookmarks";
import { CategoriesPage } from "@/pages/Categories";
import { EventsPage } from "@/pages/Events";
import { ExplorePage } from "@/pages/Explore";
import { HomePage } from "@/pages/Home";
import { LandingPage } from "@/pages/LandingPage";
import { PortfolioPage } from "@/pages/Portfolio";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<HomePage />} />
        <Route path="app" element={<Navigate to="/dashboard" replace />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="bookmarks" element={<BookmarksPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
