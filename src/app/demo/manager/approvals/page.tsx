// File: src/app/demo/manager/approvals/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Check, X, Clock, Search, Download } from "lucide-react";
import { Toaster, toast } from "sonner";

// --- Types ---
type Status = "pending" | "approved" | "rejected";

interface ApprovalItem {
  id: string;
  employeeName: string;
  employeeEmail: string;
  client: string;
  project: string;
  weekRange: string; // e.g. "Aug 11–17, 2025"
  date: string; // ISO date string of the entry
  minutes: number; // 180 = 3.0h
  billRate: number; // 95.00
  notes?: string;
  status: Status;
}

// --- Mock Data ---
const initialItems: ApprovalItem[] = [
  {
    id: "abc-001",
    employeeName: "Mike Chen",
    employeeEmail: "mike.chen@example.com",
    client: "ABC Corp",
    project: "Website Revamp",
    weekRange: "Aug 11–17, 2025",
    date: new Date().toISOString().slice(0, 10),
    minutes: 180,
    billRate: 95.0,
    notes: "Homepage polish",
    status: "pending",
  },
  {
    id: "abc-002",
    employeeName: "Ava Patel",
    employeeEmail: "ava.patel@example.com",
    client: "ABC Corp",
    project: "Mobile App QA",
    weekRange: "Aug 11–17, 2025",
    date: new Date().toISOString().slice(0, 10),
    minutes: 240,
    billRate: 80.0,
    notes: "Regression pass",
    status: "pending",
  },
];

// --- Helpers ---
const brand = {
  pink: "#e31c79",
  navy: "#05202E",
  beige: "#E5DDD8",
};

function minutesToHours(min: number) {
  return (min / 60).toFixed(1);
}

function currency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function ManagerApprovalsDemo() {
  const [items, setItems] = useState<ApprovalItem[]>(initialItems);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Status | "all">("pending");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesTab = tab === "all" ? true : it.status === tab;
      const q = query.trim().toLowerCase();
      const matchesQuery = q
        ? [
            it.employeeName,
            it.employeeEmail,
            it.client,
            it.project,
            it.notes ?? "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;
      return matchesTab && matchesQuery;
    });
  }, [items, query, tab]);

  const counts = useMemo(() => {
    return items.reduce(
      (acc, it) => {
        acc.all += 1;
        acc[it.status] += 1;
        acc.pendingMinutes += it.status === "pending" ? it.minutes : 0;
        acc.pendingAmount += it.status === "pending" ? it.minutes * (it.billRate / 60) : 0;
        return acc;
      },
      { all: 0, pending: 0, approved: 0, rejected: 0, pendingMinutes: 0, pendingAmount: 0 }
    );
  }, [items]);

  function setStatus(id: string, status: Status) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
    toast.success(
      status === "approved" ? "Timesheet approved" : "Timesheet rejected"
    );
  }

  function bulk(status: Status) {
    const ids = Object.entries(selected)
      .filter(([_, v]) => v)
      .map(([k]) => k);
    if (ids.length === 0) {
      toast("Select at least one row");
      return;
    }
    setItems((prev) => prev.map((it) => (ids.includes(it.id) ? { ...it, status } : it)));
    setSelected({});
    toast.success(`${status === "approved" ? "Approved" : "Rejected"} ${ids.length} item(s)`);
  }

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function exportCsv() {
    const rows = [
      [
        "Employee",
        "Email",
        "Client",
        "Project",
        "Week",
        "Date",
        "Hours",
        "Bill Rate",
        "Amount",
        "Status",
        "Notes",
      ],
      ...filtered.map((it) => [
        it.employeeName,
        it.employeeEmail,
        it.client,
        it.project,
        it.weekRange,
        it.date,
        (it.minutes / 60).toFixed(2),
        it.billRate.toFixed(2),
        ((it.minutes / 60) * it.billRate).toFixed(2),
        it.status,
        (it.notes ?? "").replace(/\n/g, " "),
      ]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `approvals_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <Toaster richColors />

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Manager Approval Queue (Demo)</h1>
        <p className="text-sm text-gray-600">
          This is a mock approvals page for external client managers. No auth or database required.
        </p>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: brand.pink }}>
          <div className="text-sm opacity-80">Pending approvals</div>
          <div className="mt-1 text-2xl font-semibold">{counts.pending}</div>
        </div>
        <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: brand.navy }}>
          <div className="text-sm opacity-80">Pending hours</div>
          <div className="mt-1 text-2xl font-semibold">{(counts.pendingMinutes / 60).toFixed(1)} h</div>
        </div>
        <div className="rounded-2xl p-4" style={{ backgroundColor: brand.beige }}>
          <div className="text-sm opacity-70">Pending amount</div>
          <div className="mt-1 text-2xl font-semibold">{currency(counts.pendingAmount)}</div>
        </div>
        <div className="rounded-2xl p-4 border">
          <div className="text-sm opacity-70">Approved / Rejected</div>
          <div className="mt-1 text-2xl font-semibold">{counts.approved} / {counts.rejected}</div>
        </div>
      </section>

      {/* Controls */}
      <section className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2">
          {["pending", "approved", "rejected", "all"].map((s) => (
            <button
              key={s}
              onClick={() => setTab(s as any)}
              className={`px-3 py-1.5 rounded-full border text-sm ${
                tab === s ? "bg-black text-white" : "bg-white"
              }`}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employee, client, project…"
              className="pl-8 pr-3 py-2 rounded-xl border w-72"
            />
          </div>
          <button onClick={exportCsv} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </section>

      {/* List */}
      <section className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border p-6 text-gray-600">No items match your filters.</div>
        ) : (
          filtered.map((it) => {
            const hours = Number(minutesToHours(it.minutes));
            const amount = it.minutes * (it.billRate / 60);
            const isSelected = !!selected[it.id];
            return (
              <div key={it.id} className="rounded-2xl border p-4 bg-white">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(it.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-lg font-medium">{it.employeeName}</div>
                        <div className="text-sm text-gray-500">{it.client} • {it.project}</div>
                        <div className="text-xs text-gray-500">Week: {it.weekRange} • Date: {it.date}</div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="text-right">
                          <div className="font-semibold">{hours.toFixed(1)} h</div>
                          <div className="text-sm text-gray-500">{currency(amount)}</div>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs border ${
                          it.status === "pending" ? "bg-yellow-50 border-yellow-300 text-yellow-800" :
                          it.status === "approved" ? "bg-green-50 border-green-300 text-green-800" :
                          "bg-rose-50 border-rose-300 text-rose-800"
                        }`}>
                          {it.status === "pending" ? <Clock className="h-3.5 w-3.5" /> : it.status === "approved" ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                          {it.status[0].toUpperCase() + it.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {it.notes && (
                      <p className="mt-3 text-sm text-gray-700"><span className="font-medium">Notes:</span> {it.notes}</p>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setStatus(it.id, "approved")}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white"
                        style={{ backgroundColor: brand.navy }}
                      >
                        <Check className="h-4 w-4" /> Approve
                      </button>
                      <button
                        onClick={() => setStatus(it.id, "rejected")}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white"
                        style={{ backgroundColor: brand.pink }}
                      >
                        <X className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Bulk actions */}
      <section className="sticky bottom-6 flex justify-end">
        <div className="inline-flex gap-2 rounded-2xl border bg-white p-2 shadow-sm">
          <button
            onClick={() => bulk("approved")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white"
            style={{ backgroundColor: brand.navy }}
          >
            <Check className="h-4 w-4" /> Bulk Approve
          </button>
          <button
            onClick={() => bulk("rejected")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white"
            style={{ backgroundColor: brand.pink }}
          >
            <X className="h-4 w-4" /> Bulk Reject
          </button>
        </div>
      </section>
    </main>
  );
}
