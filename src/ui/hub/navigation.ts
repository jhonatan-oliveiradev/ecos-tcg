export const HUB_NAV = [
  {
    id: "station",
    href: "/",
    label: "Estação",
    caption: "Seu ponto de partida",
  },
  {
    id: "play",
    href: "/jogar",
    label: "Jogar",
    caption: "Encontre seu próximo duelo",
  },
  {
    id: "collection",
    href: "/ecos",
    label: "Os Ecos",
    caption: "Explore as cartas",
  },
  {
    id: "decks",
    href: "/decks",
    label: "Decks",
    caption: "Conheça sua estratégia",
  },
  {
    id: "store",
    href: "/loja",
    label: "Loja",
    caption: "Dê seu toque ao vínculo",
  },
  {
    id: "profile",
    href: "/perfil",
    label: "Seu perfil",
    caption: "Registros da sua jornada",
  },
  {
    id: "bestiary",
    href: "/bestiario",
    label: "Bestiário",
    caption: "Espécies, vínculos e histórias",
  },
  {
    id: "atelier",
    href: "/atelie",
    label: "Ateliê",
    caption: "Um universo em construção",
  },
  {
    id: "settings",
    href: "/ajustes",
    label: "Ajustes",
    caption: "Do seu jeito",
  },
] as const;
export type HubScreen = (typeof HUB_NAV)[number]["id"];
