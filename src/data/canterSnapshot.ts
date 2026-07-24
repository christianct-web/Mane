export const canterSnapshot = {
  tenant: {
    id: "demo-tenant",
    name: "Caribbean Distribution Co.",
    timezone: "America/Port_of_Spain"
  },
  shipments: [
    {
      id: "SHP-2418",
      supplier: "Island Packaging Ltd",
      category: "Packaging",
      eta: "2026-07-22",
      daysLate: 2,
      valueTtd: 184500,
      severity: "high",
      status: "Awaiting port release",
      owner: "A. James"
    },
    {
      id: "SHP-2421",
      supplier: "Northern Ingredients",
      category: "Raw materials",
      eta: "2026-07-24",
      daysLate: 0,
      valueTtd: 94000,
      severity: "medium",
      status: "Documents incomplete",
      owner: "K. Ali"
    },
    {
      id: "SHP-2409",
      supplier: "Atlantic Cold Chain",
      category: "Cold storage",
      eta: "2026-07-19",
      daysLate: 5,
      valueTtd: 312000,
      severity: "critical",
      status: "Temperature evidence missing",
      owner: "R. Singh"
    },
    {
      id: "SHP-2425",
      supplier: "Trini Labels",
      category: "Packaging",
      eta: "2026-07-27",
      daysLate: 0,
      valueTtd: 42800,
      severity: "low",
      status: "On track",
      owner: "A. James"
    },
    {
      id: "SHP-2414",
      supplier: "Windward Commodities",
      category: "Raw materials",
      eta: "2026-07-21",
      daysLate: 3,
      valueTtd: 267400,
      severity: "high",
      status: "Supplier response overdue",
      owner: "K. Ali"
    }
  ],
  exceptions: [
    {
      id: "EX-881",
      shipmentId: "SHP-2409",
      title: "Cold-chain evidence missing",
      severity: "critical",
      ageHours: 31,
      recommendedAction: "Escalate to logistics manager"
    },
    {
      id: "EX-887",
      shipmentId: "SHP-2418",
      title: "Port release delayed",
      severity: "high",
      ageHours: 18,
      recommendedAction: "Confirm broker release reference"
    },
    {
      id: "EX-890",
      shipmentId: "SHP-2414",
      title: "Supplier response overdue",
      severity: "high",
      ageHours: 12,
      recommendedAction: "Send controlled follow-up"
    },
    {
      id: "EX-895",
      shipmentId: "SHP-2421",
      title: "Commercial invoice incomplete",
      severity: "medium",
      ageHours: 4,
      recommendedAction: "Request corrected invoice"
    }
  ]
} as const;
