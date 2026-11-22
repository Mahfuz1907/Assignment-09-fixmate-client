"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IBookings } from "@/library/type";

const STATUS_KEYS = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "cancelled",
] as const;

const STATUS_LABELS: Record<(typeof STATUS_KEYS)[number], string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<(typeof STATUS_KEYS)[number], string> = {
  requested: "#f59e0b",
  accepted: "#10b981",
  "in-progress": "#0ea5e9",
  completed: "#8b5cf6",
  cancelled: "#dc2626",
};

interface BookingStatusDatum {
  name: string;
  label: string;
  value: number;
  color: string;
}

function buildBookingStatusData(bookings: IBookings[]): BookingStatusDatum[] {
  return STATUS_KEYS.map((status) => ({
    name: status,
    label: STATUS_LABELS[status],
    value: bookings.filter((b) => b.status === status).length,
    color: STATUS_COLORS[status],
  }));
}

const CATEGORY_PALETTE = [
  "#f59e0b",
  "#10b981",
  "#0ea5e9",
  "#8b5cf6",
  "#f43f5e",
  "#7c3aed",
  "#14b8a6",
  "#f87171",
  "#64748b",
];

interface SpendingDatum {
  name: string;
  value: number;
  color: string;
}

function buildSpendingData(bookings: IBookings[]): SpendingDatum[] {
  const totals = new Map<string, number>();
  bookings.forEach((booking) => {
    const amount = booking.finalAmount ?? booking.basePrice ?? 0;
    if (amount > 0) {
      totals.set(booking.category, (totals.get(booking.category) ?? 0) + amount);
    }
  });
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({
      name,
      value,
      color: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length],
    }));
}

function BookingStatusChart({ data }: { data: BookingStatusDatum[] }) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">My Booking Status</CardTitle>
        <CardDescription>Requests by status</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ResponsiveContainer
          width="100%"
          height={240}
          initialDimension={{ width: 300, height: 240 }}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={94}
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={1}
              label={false}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {data.map((entry) => (
            <li
              key={entry.name}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium text-foreground">
                {entry.label}
              </span>
              <span className="font-semibold text-foreground tabular-nums">
                {entry.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SpendingByCategoryChart({ data }: { data: SpendingDatum[] }) {
  const max = data.reduce((acc, d) => Math.max(acc, d.value), 0);
  const domainMax = Math.max(1, max);

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Spending by Category</CardTitle>
        <CardDescription>Total spent per service category</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No spending data yet — request your first repair!
          </p>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={280}
            initialDimension={{ width: 500, height: 280 }}
          >
            <BarChart data={data} layout="vertical">
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 10, fill: "#71717a" }}
                interval={0}
              />
              <XAxis
                type="number"
                allowDecimals={false}
                domain={[0, domainMax]}
                tick={{ fontSize: 10, fill: "#71717a" }}
                tickFormatter={(v) => `$${Number(v)}`}
              />
              <Tooltip
                formatter={(value) => `$${value}`}
                labelFormatter={(label) => String(label)}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default function CustomerOverviewCharts({
  bookings,
}: {
  bookings: IBookings[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <BookingStatusChart data={buildBookingStatusData(bookings)} />
      <SpendingByCategoryChart data={buildSpendingData(bookings)} />
    </div>
  );
}
