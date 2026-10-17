import { Link } from "react-router-dom";
import { Plus, Menu, X } from "lucide-react";
import { useState } from "react";
import { navSections } from "./Sidebar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { openCreateMarket } from "@/engine/ui";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsMenu } from "./NotificationsMenu";
import { ProfileMenu } from "./ProfileMenu";

function Logo() {
  return (
    <Link to="/dashboard" className="flex items-center" aria-label="Raayo home">
      <span className="text-2xl font-black tracking-[-0.04em] text-brand-700">
        RAAYO
      </span>
    </Link>
  );
}

/** Sticky 72px top navigation bar. */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="anim-nav sticky top-0 z-40 h-18 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="navbar-inner flex h-full items-center gap-6 px-6">
        <div className="mobile-menu-button hidden">
          <IconButton
            icon={
              menuOpen ? <X className="size-5" /> : <Menu className="size-5" />
            }
            label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
        <div className="navbar-logo w-44 shrink-0">
          <Logo />
        </div>
        <div className="navbar-search flex flex-1 justify-start">
          <GlobalSearch />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            icon={<Plus className="size-4" />}
            className="navbar-create mr-2"
            onClick={openCreateMarket}
          >
            Create Market
          </Button>
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="mobile-navigation absolute inset-x-0 top-full grid grid-cols-2 gap-1 border-b border-slate-200 bg-white p-4 shadow-lg"
        >
          {navSections
            .flatMap((section) => section.items)
            .map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg p-3 text-sm font-medium hover:bg-slate-50"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    setMenuOpen(false);
                    openCreateMarket();
                  }}
                  className="flex items-center gap-2 rounded-lg p-3 text-sm font-medium hover:bg-slate-50"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </button>
              ),
            )}
        </nav>
      )}
    </header>
  );
}
