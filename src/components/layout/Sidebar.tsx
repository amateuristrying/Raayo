import {
  Bell,
  Bookmark,
  Calendar,
  ChartPie,
  CirclePlus,
  Compass,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { homeData } from "@/data";
import { notificationsStore, unreadCount } from "@/engine/notifications";
import { useStore } from "@/engine/store";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { UserCard } from "./UserCard";

interface NavEntry {
  icon: LucideIcon;
  label: string;
  to?: string;
  /** Shows the live unread-notifications badge. */
  notificationBadge?: boolean;
}

interface NavSection {
  title: string;
  items: NavEntry[];
}

const navSections: NavSection[] = [
  {
    title: "Discover",
    items: [
      { icon: Home, label: "Home", to: "/dashboard" },
      { icon: Compass, label: "Explore", to: "/explore" },
      { icon: Calendar, label: "Events", to: "/events" },
      { icon: LayoutGrid, label: "Categories", to: "/categories" },
      { icon: Search, label: "Search" },
    ],
  },
  {
    title: "Personal",
    items: [
      { icon: ChartPie, label: "Portfolio", to: "/portfolio" },
      { icon: Star, label: "Watchlist" },
      { icon: Bookmark, label: "Bookmarks", to: "/bookmarks" },
    ],
  },
  {
    title: "Social",
    items: [
      { icon: Trophy, label: "Leaderboards" },
      { icon: Bell, label: "Notifications", notificationBadge: true },
    ],
  },
  {
    title: "Create",
    items: [{ icon: CirclePlus, label: "Create Market" }],
  },
  {
    title: "Account",
    items: [{ icon: Settings, label: "Settings" }],
  },
];

/** Permanent 224px navigation rail below the navbar. */
export function Sidebar() {
  const unread = unreadCount(useStore(notificationsStore));

  return (
    <aside className="anim-sidebar sticky top-18 flex h-[calc(100vh-4.5rem)] w-56 shrink-0 flex-col border-r border-slate-200/80 bg-white">
      <div className="no-scrollbar flex-1 overflow-y-auto px-3 pt-5">
        {navSections.map((section) => (
          <SidebarSection key={section.title} title={section.title}>
            {section.items.map(({ notificationBadge, ...item }) => (
              <SidebarItem
                key={item.label}
                {...item}
                badge={notificationBadge ? unread : undefined}
              />
            ))}
          </SidebarSection>
        ))}
      </div>
      <div className="px-3 pb-4">
        <UserCard user={homeData.user} />
      </div>
    </aside>
  );
}
