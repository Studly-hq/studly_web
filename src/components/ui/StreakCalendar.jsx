import React, { memo, useMemo, useState, useEffect, useId, useRef } from "react";
import { cn } from "../../lib/utils";

/**
 * StreakCalendar — GitHub-style contribution calendar for streak data
 * 
 * Props:
 * @param {Object} props
 * @param {Object.<string, {level: 0|1, active: boolean}>} props.data - Streak data by date
 * @param {string} [props.startDate] - YYYY-MM-DD (default: 1 year ago)
 * @param {string} [props.endDate] - YYYY-MM-DD (default: today)
 * @param {number} [props.cellSize=12]
 * @param {number} [props.cellGap=3]
 * @param {'rounded'|'circle'} [props.cellShape='rounded']
 * @param {boolean} [props.showMonthLabels=true]
 * @param {boolean} [props.showLegend=true]
 * @param {string} [props.className]
 */
const STREAK_THEMES = {
  light: {
    level0: "#ebedf0",
    level1: "#ff4500",
  },
  dark: {
    level0: "#161b22",
    level1: "#ff6b35",
  },
};

function parseDate(dateStr) {
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function formatTooltipDate(dateStr) {
  try {
    const date = parseDate(dateStr);
    const month = FULL_MONTH_NAMES[date.getMonth()];
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    return `${month} ${day}${suffix}`;
  } catch (e) {
    return dateStr;
  }
}

function buildGrid(startDate, endDate, startsOnSunday = true) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const startDay = startsOnSunday ? 0 : 1;
  const startDow = start.getDay();
  const offset = (startDow - startDay + 7) % 7;
  const gridStart = addDays(start, -offset);

  const weeks = [];
  const monthLabels = [];

  let current = new Date(gridStart);
  let weekIndex = 0;
  let lastMonth = -1;

  while (
    current <= end ||
    (weeks.length > 0 && (weeks[weeks.length - 1]?.length ?? 0) < 7)
  ) {
    const week = [];

    for (let d = 0; d < 7; d++) {
      const dateStr = formatDate(current);
      const isInRange = current >= start && current <= end;
      week.push(isInRange ? dateStr : null);

      if (isInRange && current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth();
        monthLabels.push({
          label: MONTH_NAMES[current.getMonth()],
          weekIndex,
        });
      }

      current = addDays(current, 1);
    }

    weeks.push(week);
    weekIndex++;

    if (
      current > end &&
      weeks.length > 0 &&
      (weeks[weeks.length - 1]?.every(
        (d) => d === null || parseDate(d) > end,
      ) ??
        false)
    )
      break;
  }

  return { weeks, monthLabels, gridStart: formatDate(gridStart) };
}

function CalendarSkeleton({ cellSize = 12, cellGap = 3, className }) {
  const step = cellSize + cellGap;
  const weeks = 53;
  const days = 7;
  return (
    <div className={cn("w-fit mx-auto space-y-3 animate-pulse", className)}>
      <div className="flex gap-6">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="overflow-x-auto">
        <svg
          width={weeks * step - cellGap}
          height={16 + days * step - cellGap}
          className="overflow-visible"
        >
          {Array.from({ length: weeks }).map((_, wi) =>
            Array.from({ length: days }).map((_, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * step}
                y={16 + di * step}
                width={cellSize}
                height={cellSize}
                rx={cellSize * 0.2}
                className="fill-muted"
              />
            )),
          )}
        </svg>
      </div>
    </div>
  );
}

const StreakCalendar = memo(function StreakCalendar({
  data = {},
  startDate,
  endDate,
  cellSize = 12,
  cellGap = 3,
  cellShape = "rounded",
  showMonthLabels = true,
  showLegend = true,
  className,
}) {
  const id = useId();
  const scrollRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
    date: "",
    active: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const checkDark = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark"),
      );
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    const opts = { attributes: true, attributeFilter: ["class"] };
    observer.observe(document.documentElement, opts);
    observer.observe(document.body, opts);

    return () => observer.disconnect();
  }, []);

  const resolvedEnd = endDate ?? formatDate(new Date());
  const resolvedStart = useMemo(() => {
    if (startDate) return startDate;
    const d = parseDate(resolvedEnd);
    d.setFullYear(d.getFullYear() - 1);
    d.setDate(d.getDate() + 1);
    return formatDate(d);
  }, [startDate, resolvedEnd]);

  const activeColors = useMemo(
    () => (isDark ? STREAK_THEMES.dark : STREAK_THEMES.light),
    [isDark],
  );

  const { weeks, monthLabels, gridStart } = useMemo(
    () => buildGrid(resolvedStart, resolvedEnd, true),
    [resolvedStart, resolvedEnd],
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

  if (Object.keys(data).length === 0) {
    return (
      <CalendarSkeleton
        cellSize={cellSize}
        cellGap={cellGap}
        className={className}
      />
    );
  }

  const cellRx = cellShape === "circle" ? cellSize / 2 : cellSize * 0.2;
  const step = cellSize + cellGap;
  const monthLabelHeight = showMonthLabels ? 20 : 0;
  const svgWidth = weeks.length * step - cellGap;
  const svgHeight = monthLabelHeight + 7 * step - cellGap;

  return (
    <div
      className={cn(
        "w-fit mx-auto overflow-x-hidden border rounded-sm transition-all duration-500",
        className,
      )}
    >
      <div className="w-fit mx-auto max-w-full flex flex-col gap-3 p-3">
        <div
          ref={scrollRef}
          className="relative overflow-x-auto transition-all duration-500"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="overflow-visible"
          >
            {/* month labels */}
            {showMonthLabels && (() => {
              const byWeek = new Map();
              monthLabels.forEach(({ label, weekIndex }) =>
                byWeek.set(weekIndex, label),
              );
              const entries = Array.from(byWeek.entries());
              const validEntries = [];
              for (let i = 0; i < entries.length; i++) {
                const current = entries[i];
                const next = entries[i + 1];
                if (i === 0 && next && next[0] - current[0] < 3) continue;
                const lastValid = validEntries[validEntries.length - 1];
                if (lastValid && current[0] - lastValid[0] < 3) continue;
                validEntries.push(current);
              }
              return validEntries.map(([weekIndex, label]) => (
                <text
                  key={`${label}-${weekIndex}`}
                  x={weekIndex * step}
                  y={10}
                  fontSize={14}
                  fill={isDark ? "#fafafa" : "#0a0a0a"}
                  fontFamily="inherit"
                >
                  {label}
                </text>
              ));
            })()}

            {/* cells */}
            {weeks.map((week, wi) =>
              week.map((date, di) => {
                const entry = date ? data[date] : undefined;
                const level = entry?.level ?? 0;
                const active = entry?.active ?? false;
                const cellCenterX = wi * step + cellSize / 2;
                const cellTopY = monthLabelHeight + di * step;

                if (!date) {
                  const cellDate = formatDate(
                    addDays(parseDate(gridStart), wi * 7 + di),
                  );
                  if (cellDate > resolvedEnd) return null;
                }

                const fillColor = level === 1
                  ? activeColors.level1
                  : activeColors.level0;

                return (
                  <rect
                    key={`${wi}-${di}`}
                    id={date ? `cell-${id}-${date}` : undefined}
                    x={wi * step}
                    y={cellTopY}
                    width={cellSize}
                    height={cellSize}
                    rx={cellRx}
                    fill={fillColor}
                    style={{
                      transition: "opacity 0.1s",
                      opacity: 1,
                    }}
                    onMouseEnter={() => {
                      if (!date) return;
                      setTooltip({
                        visible: true,
                        date,
                        active,
                        x: cellCenterX,
                        y: cellTopY,
                      });
                    }}
                    onMouseLeave={() =>
                      setTooltip((t) => ({ ...t, visible: false }))
                    }
                  />
                );
              }),
            )}
          </svg>

          {/* custom tooltip */}
          {tooltip.visible && (() => {
            const formattedDate = formatTooltipDate(tooltip.date);
            const tooltipText = tooltip.active
              ? `Active on ${formattedDate}`
              : `No activity on ${formattedDate}`;

            return (
              <div
                className="pointer-events-none absolute z-50 rounded bg-[#24292e] dark:bg-[#161b22] px-2.5 py-1 text-[11px] font-medium text-white shadow-md border border-neutral-700/30 whitespace-nowrap"
                style={{
                  left: tooltip.x,
                  top: tooltip.y,
                  transform: "translate(-50%, calc(-100% - 6px))",
                }}
              >
                {tooltipText}
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-[#24292e] dark:bg-[#161b22] border-r border-b border-neutral-700/30" />
              </div>
            );
          })()}
        </div>

        {showLegend && (
          <div className="flex items-center justify-between gap-x-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 mt-0.5">
              <span>Less</span>
              {[0, 1].map((level) => (
                <svg key={level} width={cellSize} height={cellSize}>
                  <rect
                    width={cellSize}
                    height={cellSize}
                    rx={cellRx}
                    fill={activeColors[`level${level}`]}
                  />
                </svg>
              ))}
              <span>More</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

StreakCalendar.displayName = "StreakCalendar";

export default StreakCalendar;