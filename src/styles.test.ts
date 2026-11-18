import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { CSS } from "./css.generated.ts";
import { STYLES } from "./index.ts";

test("css.generated.ts is current: run `pnpm --filter @writeditor/styles build` after editing a .css", () => {
  const src = new URL("./", import.meta.url), found: Record<string, string> = {};
  for (const f of readdirSync(src, { recursive: true, encoding: "utf8" })) if (f.endsWith(".css")) found[f.replace(/\.css$/, "")] = readFileSync(new URL(f, src), "utf8");
  assert.deepEqual(CSS, found);
});

test("every style has pages, a page geometry and unique field ids", () => {
  for (const s of Object.values(STYLES)) {
    assert.ok(s.css.includes("@page") && s.page.size[0] > 0 && s.page.margins.length === 4, s.id);
    assert.equal(new Set(s.fields.map((f) => f.id)).size, s.fields.length, s.id);
    for (const f of s.fields) assert.ok(f.type !== "enum" || f.options?.length, `${s.id}.${f.id}`);
  }
});
