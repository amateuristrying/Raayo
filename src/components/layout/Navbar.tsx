import { Link } from "react-router-dom";
import { Plus, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { showToast } from "@/engine/toasts";
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
  return (
    <header className="anim-nav sticky top-0 z-40 h-18 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex h-full items-center gap-6 px-6">
        <div className="w-44 shrink-0">
          <Logo />
        </div>
        <div className="flex flex-1 justify-start">
          <GlobalSearch />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            icon={<Plus className="size-4" />}
            className="mr-2"
            onClick={openCreateMarket}
          >
            Create Market
          </Button>
          <NotificationsMenu />
          <IconButton
            icon={<Sun className="size-5" />}
            label="Toggle theme"
            onClick={() =>
              showToast("Dark mode is on the roadmap — staying light for now.", "info")
            }
          />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
