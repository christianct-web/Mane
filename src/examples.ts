export const workspaceExamples = [
  {
    id: "control-room",
    name: "Inbound control room",
    description: "Prioritises late, high-value shipments and proposes a controlled escalation.",
    code: `const shipments = await mana.data.list("shipments");
const exceptions = await mana.data.list("exceptions");

const urgent = shipments
  .filter(item => ["high", "critical"].includes(item.severity))
  .sort((a, b) => b.valueTtd - a.valueTtd);

const exposure = urgent.reduce((sum, item) => sum + item.valueTtd, 0);
const lateCount = shipments.filter(item => item.daysLate > 0).length;

await mana.actions.propose({
  action: "canter.escalate_exception",
  payload: { exceptionId: "EX-881", owner: "logistics-manager" },
  reason: "The cold-chain evidence is missing on the largest delayed shipment.",
  risk: "medium"
});

return ui.dashboard(
  { title: "Inbound control room", eyebrow: "CANTER · LIVE WORKSPACE" },
  [
    ui.grid({ columns: 3 }, [
      ui.kpi("Value at risk", ui.money(exposure), "Across high-priority inbound shipments", "danger"),
      ui.kpi("Late shipments", lateCount, "Needs owner attention", "warning"),
      ui.kpi("Open exceptions", exceptions.length, "One critical", "neutral")
    ]),
    ui.grid({ columns: 2, wideFirst: true }, [
      ui.card("Priority shipments", [
        ui.table(
          urgent.map(item => ({
            shipment: item.id,
            supplier: item.supplier,
            delay: item.daysLate + " days",
            value: ui.money(item.valueTtd),
            severity: item.severity
          })),
          ["shipment", "supplier", "delay", "value", "severity"]
        )
      ]),
      ui.card("Exception pressure", [
        ui.stack(
          exceptions.slice(0, 4).map(item =>
            ui.row([
              ui.badge(item.severity, item.severity),
              ui.stack([
                ui.text(item.title, "strong"),
                ui.text(item.ageHours + "h open · " + item.recommendedAction, "muted")
              ])
            ])
          )
        )
      ])
    ])
  ]
);`
  },
  {
    id: "supplier-lens",
    name: "Supplier risk lens",
    description: "Builds a supplier-level view through ordinary JavaScript transforms.",
    code: `const shipments = await mana.data.list("shipments");

const suppliers = Object.values(
  shipments.reduce((index, item) => {
    const row = index[item.supplier] ?? {
      supplier: item.supplier,
      shipments: 0,
      late: 0,
      valueTtd: 0
    };
    row.shipments += 1;
    row.late += item.daysLate > 0 ? 1 : 0;
    row.valueTtd += item.valueTtd;
    index[item.supplier] = row;
    return index;
  }, {})
).sort((a, b) => b.valueTtd - a.valueTtd);

return ui.dashboard(
  { title: "Supplier risk lens", eyebrow: "CANTER · GENERATED VIEW" },
  [
    ui.card("Exposure by supplier", [
      ui.table(
        suppliers.map(item => ({
          supplier: item.supplier,
          shipments: item.shipments,
          late: item.late,
          exposure: ui.money(item.valueTtd),
          status: item.late ? "review" : "clear"
        })),
        ["supplier", "shipments", "late", "exposure", "status"]
      )
    ]),
    ui.card("What this view found", [
      ui.list([
        suppliers[0].supplier + " carries the highest current value exposure.",
        suppliers.filter(item => item.late).length + " suppliers have at least one late shipment.",
        "This analysis changed the interface without changing source records."
      ])
    ])
  ]
);`
  }
];
