import { test, expect } from "@playwright/test";
test("new player summons, reaches battle and deals visible damage without spending energy", async ({
  page,
}) => {
  await page.goto("/jogar");
  await page
    .getByRole("button", { name: "Primeira vez? Aprenda jogando", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Manter minha mão", exact: true })
    .click();
  await expect(
    page.getByText("Prepare seu campo", { exact: true }),
  ).toBeVisible();
  await page
    .locator(".hand-cards")
    .getByRole("button", {
      name: "Vigia de Musgo, custo 1, ataque 1, vida 2",
      exact: true,
    })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Invocar Vigia de Musgo", exact: true })
    .click();
  await expect(
    page.getByText("Ataca na rodada 2", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Encerrar turno", exact: true })
    .click();
  for (let step = 0; step < 40; step++) {
    if (
      (await page.locator(".turn-track").innerText()).includes("Seu turno · R2")
    )
      break;
    const accept = page.getByRole("button", {
      name: "Receber no Nexo",
      exact: true,
    });
    const response = page.getByRole("button", {
      name: "Continuar resolução",
      exact: true,
    });
    if (await accept.isVisible()) await accept.click();
    else if (await response.isVisible()) await response.click();
    else
      await expect(page.locator(".turn-track"))
        .toContainText("Seu turno · R2", { timeout: 1500 })
        .catch(() => {});
  }
  await expect(page.locator(".turn-track")).toContainText("Seu turno · R2");
  // Iara can be first in round two. Player responses resolve automatically.
  await page.getByRole("button", { name: /Ir para batalha/ }).click();
  await page.getByRole("button", { name: /Atacar com Vigia de Musgo/ }).click();
  await expect(page.getByText("Escolha o alvo", { exact: true })).toBeVisible();
  const energyBeforeAttack = await page
    .locator(".player-strip.self .energy-mini")
    .innerText();
  const direct = page
    .getByRole("button", { name: /Atacar .*de dano previsto/ })
    .first();
  if (await direct.count()) await direct.click();
  else
    await page
      .getByRole("button", {
        name: "Atacar Nexo · pode ser bloqueado",
        exact: true,
      })
      .click();
  const continueResponse = page.getByRole("button", {
    name: "Continuar resolução",
    exact: true,
  });
  for (let step = 0; step < 12; step++) {
    if (
      (await page.locator(".priority-bar").innerText()).includes(
        "Escolha quem vai atacar",
      )
    )
      break;
    if (await continueResponse.isVisible()) await continueResponse.click();
    else
      await expect(page.locator(".priority-bar"))
        .toContainText("Escolha quem vai atacar", { timeout: 1500 })
        .catch(() => {});
  }
  await expect(page.locator(".priority-bar")).toContainText(
    "Escolha quem vai atacar",
    { timeout: 20000 },
  );
  await expect(page.locator(".player-strip.self .energy-mini")).toHaveText(
    energyBeforeAttack,
  );
  await page.getByRole("button", { name: "Histórico", exact: true }).click();
  await expect(page.locator(".event-list")).toContainText(/dano/);
});
test("bestiary displays the generated roster with readable lore", async ({
  page,
}) => {
  await page.goto("/bestiario");
  await expect(
    page.getByRole("heading", { name: "Ceroto", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".bestiary-grid article")).toHaveCount(8);
  await expect(
    page.getByRole("img", { name: "Estudo de Musguil", exact: true }),
  ).toBeVisible();
  const r = await page.request.get("/art/ecos-roster-v1.png");
  expect(r.ok()).toBe(true);
});
