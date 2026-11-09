import Link from "next/link";
import {
  BookOpen,
  Home,
  Swords,
  Layers,
  Library,
  ShoppingBag,
  UserRound,
  Palette,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { HUB_NAV, type HubScreen } from "./navigation";
import type { GuestProfile } from "../../app/guest-profile";
const icons = [
  Home,
  Swords,
  Library,
  Layers,
  ShoppingBag,
  UserRound,
  Palette,
  SlidersHorizontal,
];
export function HubShell({
  screen,
  profile,
  onGuide,
  children,
}: {
  screen: HubScreen;
  profile: GuestProfile;
  onGuide: () => void;
  children: ReactNode;
}) {
  const active = HUB_NAV.find((item) => item.id === screen)!;
  return (
    <div className="hub-shell">
      <a className="skip-link" href="#hub-main">
        Pular para o conteúdo
      </a>
      <aside className="hub-sidebar">
        <Link href="/" className="hub-brand" aria-label="Ecos início">
          <span>✳</span>
          <div>
            ecos<small>FÁBULA NEON</small>
          </div>
        </Link>
        <div className="eyebrow hub-nav-heading">SEU UNIVERSO</div>
        <nav aria-label="Menu principal">
          {HUB_NAV.map((item, i) => {
            const Icon = icons[i];
            return (
              <Link
                href={item.href}
                key={item.id}
                aria-current={screen === item.id ? "page" : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.id === "collection" && <small>20</small>}
              </Link>
            );
          })}
        </nav>
        <div className="hub-sidebar-foot">
          <span className="status-dot" /> V0.2 · EM DESENVOLVIMENTO
          <p>
            Um mundo que cresce
            <br />a cada vínculo.
          </p>
        </div>
      </aside>
      <div className="hub-body">
        <header className="hub-topbar">
          <div>
            <span className="eyebrow">ESTAÇÃO-JARDIM</span>
            <span>{active.caption}</span>
          </div>
          <div className="hub-top-actions">
            <button className="guide-button" onClick={onGuide}>
              <BookOpen size={16} /> Como jogar
            </button>
            <Link href="/perfil" className="guest-chip">
              <span>{profile.name.slice(0, 1).toUpperCase()}</span>
              <div>
                {profile.name}
                <small>CONVIDADO · LOCAL</small>
              </div>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </header>
        <div id="hub-main" tabIndex={-1}>
          {children}
        </div>
      </div>
    </div>
  );
}
