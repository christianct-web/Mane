import { describe, expect, it } from "vitest";
import { workspaceExamples } from "../examples";
import { canterSnapshot } from "../data/canterSnapshot";
import { isUiNode } from "./protocol";

const node = (type: string, props: Record<string, unknown> = {}, children: unknown[] = []) => ({
  type,
  props,
  children
});

const ui = {
  dashboard: (props: Record<string, unknown>, children: unknown[]) => node("dashboard", props, children),
  grid: (props: Record<string, unknown>, children: unknown[]) => node("grid", props, children),
  stack: (children: unknown[]) => node("stack", {}, children),
  row: (children: unknown[]) => node("row", {}, children),
  card: (title: string, children: unknown[]) => node("card", { title }, children),
  kpi: (label: string, value: unknown, detail = "", tone = "neutral") =>
    node("kpi", { label, value: String(value), detail, tone }),
  table: (rows: unknown[], columns: string[]) => node("table", { rows, columns }),
  badge: (label: string, tone = "neutral") => node("badge", { label, tone }),
  text: (text: string, tone = "default") => node("text", { text, tone }),
  progress: (label: string, value: number) => node("progress", { label, value }),
  list: (items: string[]) => node("list", { items }),
  money: (value: number) =>
    new Intl.NumberFormat("en-TT", {
      style: "currency",
      currency: "TTD",
      maximumFractionDigits: 0
    }).format(value)
};

describe("Canter JavaScript examples", () => {
  for (const example of workspaceExamples) {
    it(`builds a valid workspace: ${example.name}`, async () => {
      const proposals: unknown[] = [];
      const mana = {
        data: {
          list: async (name: keyof typeof canterSnapshot) =>
            structuredClone(canterSnapshot[name])
        },
        actions: {
          propose: async (proposal: unknown) => {
            proposals.push(proposal);
            return proposal;
          }
        }
      };
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const execute = new AsyncFunction("mana", "ui", "console", `"use strict";\n${example.code}`);
      const result = await execute(mana, ui, console);

      expect(isUiNode(result)).toBe(true);
      if (example.id === "control-room") {
        expect(proposals).toHaveLength(1);
      }
    });
  }
});
