import { test, expect } from "@playwright/test";

test("search, bookmark, follow and prediction persist across routes", async ({
  page,
}) => {
  await page.goto("/search?type=Market");
  const first = page.locator(".discovery-result").first();
  const title = await first.locator("button").first().textContent();
  await first.getByRole("button", { name: /^Bookmark / }).click();
  await page.goto("/bookmarks");
  await expect(page.locator(".discovery-result")).toHaveCount(1);
  await page.locator(".discovery-result button").first().click();
  await page.getByRole("button", { name: "Make a prediction" }).click();
  await page.getByRole("spinbutton", { name: "Stake in points" }).fill("100");
  await page
    .getByRole("button", { name: "Place Prediction", exact: true })
    .click();
  await page.goto("/portfolio");
  await expect(page.locator(".position-row")).toHaveCount(1);
  await expect(page.locator(".position-row")).toContainText("100 pts");
  await page.getByRole("button", { name: "Activity", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Points activity" }),
  ).toContainText("-100 pts");
  await page.goto("/search?type=Entity");
  await page
    .locator(".discovery-result")
    .first()
    .getByRole("button", { name: /^Follow / })
    .click();
  await page.goto("/watchlist");
  await expect(page.getByRole("button", { name: /^Remove / })).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole("button", { name: /^Remove / })).toHaveCount(1);
  await page.goto("/bookmarks");
  await expect(page.locator(".discovery-result button").first()).toHaveText(
    title!,
  );
  await page.getByRole("button", { name: /^Remove / }).click();
  await expect(page.locator(".discovery-result")).toHaveCount(0);
});

test("search filters, empty results and event filters respond", async ({
  page,
}) => {
  await page.goto("/search?q=Kohli&type=Entity");
  await expect(page.locator(".discovery-result").first()).toContainText(
    "Kohli",
  );
  await page.locator("main input[type=search]").fill("nothing-matches-this");
  await expect(
    page.getByText("No matches. Try a person, event name or broader topic."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator(".discovery-result").first()).toBeVisible();
  await page.goto("/events");
  await page.getByRole("button", { name: "Completed", exact: true }).click();
  await expect(
    page.getByText("No featured events in this selection."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("status")).toContainText("4 featured events");
});

test("local market draft appears in portfolio", async ({ page }) => {
  await page.goto("/portfolio");
  await page
    .getByRole("button", { name: "Create Market", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Question", { exact: true })
    .fill("Will the example event complete on time?");
  await dialog.getByLabel("Closes on").fill("2099-12-31");
  await dialog.getByLabel("Event", { exact: true }).fill("Example event");
  await dialog
    .getByLabel("Resolution source")
    .fill("Official event announcement");
  await dialog.getByRole("button", { name: "Submit for Review" }).click();
  await page.getByRole("button", { name: "My markets" }).click();
  await expect(
    page.getByRole("region", { name: "Submitted markets" }),
  ).toContainText("Will the example event complete on time?");
});

test("all sidebar routes fit desktop and mobile", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      "dashboard",
      "explore",
      "events",
      "categories",
      "search",
      "portfolio",
      "watchlist",
      "bookmarks",
    ]) {
      await page.goto(`/${route}`);
      await page.waitForTimeout(900);
      await expect(page.locator("main")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route} at ${width}`,
      ).toBe(true);
      await page.screenshot({ path: `test-results/${route}-${width}.png` });
    }
  }
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Search", exact: true })
    .click();
  await expect(page).toHaveURL(/\/search$/);
  expect(errors).toEqual([]);
});

test("hero stays dark and shows the opening colour wave on desktop and mobile", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("raayo:landing-theme", "light"),
  );
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const frame = page.frameLocator("iframe");
    await expect(frame.locator("canvas[data-ready=true]")).toBeVisible({
      timeout: 60_000,
    });
    const opening = await page.screenshot({
      path: `test-results/hero-opening-${width}.png`,
    });
    const bluePixels = await page.evaluate(async (base64) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      let count = 0;
      // Exclude the header and purple UI; count the blue sphere emissive band.
      for (
        let i = canvas.width * Math.floor(canvas.height * 0.25) * 4;
        i < data.length;
        i += 4
      ) {
        if (
          data[i] < 110 &&
          data[i + 2] > 90 &&
          data[i + 2] > data[i] * 1.5 &&
          data[i + 2] > data[i + 1] * 1.2
        )
          count++;
      }
      return count;
    }, opening.toString("base64"));
    expect(bluePixels, `Opening colour wave at ${width}px`).toBeGreaterThan(
      200,
    );
    await expect(frame.locator("#theme-toggle")).toHaveCount(0);
    await expect(frame.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(frame.locator("body")).toHaveCSS(
      "background-color",
      "rgb(4, 6, 16)",
    );
    await expect(frame.locator(".bottom-bar")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(frame.locator(".bottom-left")).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    await page.waitForTimeout(5500);
    const later = await page.screenshot({
      path: `test-results/hero-later-${width}.png`,
    });
    expect(opening.equals(later)).toBe(false);
  }
});
