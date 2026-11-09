import { test, expect } from "@playwright/test";
test("opens guide with focus and restores it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Como jogar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Fechar guia", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Entendi, vamos jogar", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Como jogar", exact: true }),
  ).toBeFocused();
});
test("inspects a real card and toggles foil without changing rules", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Os Ecos 20", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Lontra Condutora, custo 2, ataque 2, vida 3",
      exact: true,
    })
    .click();
  const d = page.getByRole("dialog");
  const rule = await d.locator(".card-rule").innerText();
  await d.getByRole("button", { name: "✧ Holo", exact: true }).click();
  await expect(d.locator(".holo-foil")).toHaveCount(1);
  await expect(d.locator(".card-rule")).toHaveText(rule);
});
test("starts tutorial duel, keeps hand, and exits cleanly", async ({
  page,
}) => {
  await page.goto("/jogar");
  await page
    .getByRole("button", { name: "Primeira vez? Aprenda jogando", exact: true })
    .click();
  await expect(
    page.getByText("Aprenda jogando", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Manter minha mão", exact: true })
    .click();
  await expect(page.locator(".priority-bar")).not.toContainText(
    "Prepare sua mão",
  );
  await page
    .getByRole("button", { name: "Sair do duelo", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Sair do duelo", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "O futuro tem raízes." }),
  ).toBeVisible();
});

test("hydrates the Next.js page and loads the character study", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page).toHaveTitle("Ecos — Fábula Neon");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Crie vínculos/,
  );
  await page.getByRole("link", { name: "Ateliê", exact: true }).click();
  const study = page.getByRole("img", { name: /Estudo de Brotoco/ });
  await expect(study).toBeVisible();
  await expect
    .poll(() => study.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test("keeps guest preferences across hub routes and reloads", async ({
  page,
}) => {
  await page.goto("/ajustes");
  await page
    .getByLabel("Nome do vinculador", { exact: true })
    .fill("Iara do Jardim");
  await page.getByRole("button", { name: "Salvar nome", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Iara do Jardim");
  await page
    .getByRole("switch", { name: "Reduzir animações", exact: true })
    .click();
  await expect(page.locator(".ecos-app")).toHaveAttribute(
    "data-motion",
    "reduced",
  );
  await page.getByRole("link", { name: "Loja", exact: true }).click();
  await page
    .getByRole("button", { name: "Aplicar acabamento", exact: true })
    .click();
  await page.getByRole("link", { name: "Decks", exact: true }).click();
  await page.getByRole("button", { name: /Distrito Aurora/ }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: /Distrito Aurora/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".guest-chip")).toContainText("Iara do Jardim");
  await page.getByRole("link", { name: "Os Ecos 20", exact: true }).click();
  await page.getByRole("searchbox", { name: "Buscar Ecos" }).fill("pulso");
  await expect(page.getByRole("status")).toHaveText("1 Ecos encontrados");
  await page
    .getByRole("button", { name: "Pulso, custo 2", exact: true })
    .click();
  await expect(page.getByRole("dialog").locator(".holo-foil")).toHaveCount(1);
});
