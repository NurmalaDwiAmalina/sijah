"use client";

type Slice = { label: string; count: number; percent: number; color: string };

export function DonutChart({
  data,
  total,
  size = 220,
  thickness = 28,
}: {
  data: Slice[];
  total: number;
  size?: number;
  thickness?: number;
}) {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;

  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#EEEEEE"
        strokeWidth={thickness}
      />
      {data.map((s, i) => {
        const len = (s.percent / 100) * C;
        const dasharray = `${len} ${C - len}`;
        const dashoffset = -offset;
        offset += len;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={dasharray}
            strokeDashoffset={dashoffset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        className="fill-ink-900 font-bold"
        fontSize="32"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        className="fill-ink-500"
        fontSize="12"
      >
        Total Pesanan
      </text>
    </svg>
  );
}
