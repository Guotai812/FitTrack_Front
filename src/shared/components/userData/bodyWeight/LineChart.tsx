import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

/** Public data shape */
export type WeightTuple = [dateISO: string, weightKg: number];
type Mode = "smooth" | "step";

/* ---------------- Demo data (deterministic, built once) ---------------- */
const DUMMY_DATA: WeightTuple[] = [
  ["2025-07-10", 100],
  ["2025-07-20", 60],
  ["2025-07-30", 50],
  ["2025-07-31", 80],
];

/* ---------------- Utilities ---------------- */
function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}
function startOfMonth(y: number, mIndex0: number) {
  return `${y}-${String(mIndex0 + 1).padStart(2, "0")}-01`;
}
function endOfMonth(y: number, mIndex0: number) {
  const d = new Date(y, mIndex0 + 1, 0); // last day of month
  return toISO(d);
}
function clampRange(data: WeightTuple[], startISO: string, endISO: string) {
  const s = new Date(startISO).getTime();
  const e = new Date(endISO).getTime();
  return data.filter(([iso]) => {
    const t = new Date(iso).getTime();
    return t >= s && t <= e;
  });
}
/** Expand missing days so step mode draws flat segments */
function fillMissingDatesSorted(sorted: WeightTuple[]): WeightTuple[] {
  if (sorted.length <= 1) return [...sorted];
  const out: WeightTuple[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const [startISO, startW] = sorted[i];
    const [nextISO, nextW] = sorted[i + 1];
    if (out.length === 0) out.push([startISO, startW]);
    let d = startISO;
    while (true) {
      const tomorrow = addDays(d, 1);
      if (tomorrow >= nextISO) break;
      out.push([tomorrow, startW]);
      d = tomorrow;
    }
    out.push([nextISO, nextW]);
  }
  const last = sorted[sorted.length - 1];
  if (out[out.length - 1][0] !== last[0]) out.push(last);
  return out;
}

const RANGE_PRESETS = [
  { key: "7", label: "Last week", days: 7 },
  { key: "30", label: "Last month", days: 30 },
  { key: "90", label: "Last 3 months", days: 90 },
  { key: "180", label: "Last 6 months", days: 180 },
  { key: "365", label: "Last year", days: 365 },
] as const;

/* ---------------- Component ---------------- */
export default React.memo(function WeightChartWithFiltersStable({
  data = DUMMY_DATA,
  height = 320, // keep a fixed pixel height to avoid measurement loops
  mode = "smooth", // "smooth" | "step"
}: {
  data?: WeightTuple[];
  height?: number;
  mode?: Mode;
}) {
  const { user } = useAuth();
  // Sort once
  const sorted = React.useMemo(
    () =>
      [...data].sort(
        (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
      ),
    [data]
  );

  // Year bounds for the calendar
  const [minDateISO, maxDateISO] = React.useMemo(() => {
    if (sorted.length === 0) {
      const todayISO = toISO(new Date());
      return [todayISO, todayISO];
    }
    return [sorted[0][0], sorted[sorted.length - 1][0]];
  }, [sorted]);

  const minY = new Date(minDateISO).getFullYear();
  const maxY = new Date(maxDateISO).getFullYear();

  // UI state (keep tiny and stable)
  const [activeRangeKey, setActiveRangeKey] = React.useState<string>("30");
  const [pickYear, setPickYear] = React.useState<number | "">("");
  const [pickMonth, setPickMonth] = React.useState<number | "">("");

  const chooseRange = React.useCallback((key: string) => {
    setActiveRangeKey(key);
    setPickYear("");
    setPickMonth("");
  }, []);
  const chooseCalendar = React.useCallback((y: number | "", m: number | "") => {
    setPickYear(y);
    setPickMonth(m);
    setActiveRangeKey("");
  }, []);

  // Build filtered tuples based on either preset or calendar
  const filteredTuples = React.useMemo(() => {
    if (sorted.length === 0) return [];
    if (pickYear !== "" && pickMonth !== "") {
      const startISO = startOfMonth(
        pickYear as number,
        (pickMonth as number) - 1
      );
      const endISO = endOfMonth(pickYear as number, (pickMonth as number) - 1);
      return clampRange(sorted, startISO, endISO);
    }
    const preset =
      RANGE_PRESETS.find((r) => r.key === activeRangeKey) ?? RANGE_PRESETS[2];
    const anchorISO = sorted[sorted.length - 1][0]; // anchor to latest data point
    const startISO = addDays(anchorISO, -(preset.days - 1));
    return clampRange(sorted, startISO, anchorISO);
  }, [sorted, activeRangeKey, pickYear, pickMonth]);

  // Step mode expansion
  const effective = React.useMemo(
    () =>
      mode === "step" ? fillMissingDatesSorted(filteredTuples) : filteredTuples,
    [mode, filteredTuples]
  );

  // Recharts rows
  const rows = React.useMemo(
    () =>
      effective.map(([dateISO, weight]) => ({
        t: new Date(dateISO).getTime(),
        dateISO,
        weight,
      })),
    [effective]
  );

  const domain: [number, number] | undefined =
    rows.length > 0 ? [rows[0].t, rows[rows.length - 1].t] : undefined;

  return (
    <div className="w-full grid gap-3">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 min-h-10">
        {/* Range buttons */}
        <div className="flex flex-wrap gap-2">
          {RANGE_PRESETS.map((r) => {
            const active = activeRangeKey === r.key;
            return (
              <button
                key={r.key}
                onClick={() => chooseRange(r.key)}
                className={[
                  "px-2.5 py-1.5 rounded-lg border text-sm transition-colors",
                  active
                    ? "bg-green-300 text-white"
                    : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50",
                ].join(" ")}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div aria-hidden className="w-px h-5 bg-gray-200 mx-2" />

        {/* Calendar (Year / Month) */}
        <div className="flex items-center gap-1.5">
          <label className="text-sm text-gray-600">Year:</label>
          <select
            value={pickYear}
            onChange={(e) =>
              chooseCalendar(
                e.target.value ? Number(e.target.value) : "",
                pickMonth
              )
            }
            className="px-2 py-1.5 rounded-md border border-gray-300 text-sm bg-white"
          >
            <option value="">--</option>
            {Array.from({ length: maxY - minY + 1 }, (_, i) => minY + i).map(
              (y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            )}
          </select>

          <label className="text-sm text-gray-600 ml-2">Month:</label>
          <select
            value={pickMonth}
            onChange={(e) =>
              chooseCalendar(
                pickYear,
                e.target.value ? Number(e.target.value) : ""
              )
            }
            className="px-2 py-1.5 rounded-md border border-gray-300 text-sm bg-white"
          >
            <option value="">--</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>

          {(pickYear !== "" || pickMonth !== "") && (
            <button
              onClick={() => {
                setPickYear("");
                setPickMonth("");
                setActiveRangeKey("90"); // default back to 3 months
              }}
              className="ml-2 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              title="Clear month filter"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stable chart container to stop flashing */}
      <div
        className="w-full min-w-0 overflow-hidden"
        style={{ height }} // keep dynamic height as inline style
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          debounce={200}
          minWidth={240}
          minHeight={160}
        >
          <LineChart
            data={rows}
            margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
          >
            <XAxis
              dataKey="t"
              type="number"
              scale="time"
              domain={domain as any}
              tickFormatter={(t) => toISO(new Date(t))}
              minTickGap={28}
              tickMargin={6}
            />
            <YAxis
              dataKey="weight"
              allowDecimals={false}
              width={44}
              tickMargin={6}
            />
            <Tooltip
              formatter={(v: any, name: string) =>
                name === "weight" ? [`${v} kg`, "Weight"] : v
              }
              labelFormatter={(label: any) => toISO(new Date(label))}
            />
            <Line
              type={mode === "step" ? "stepAfter" : "monotone"}
              dataKey="weight"
              strokeWidth={2}
              dot={{ r: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <Link to={`/${user?.userId}`}>
          <Button kind="cancel">Back</Button>
        </Link>
      </div>
    </div>
  );
});
