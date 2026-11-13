import React, { useMemo, useState } from 'react';
import { ChartPoint, ForceUnit } from '../types/simulation';
import { fromKN } from '../lib/physics';

interface StressChartSVGProps {
  points: ChartPoint[];
  unit: ForceUnit;
  darkSurface?: boolean;
}

type ChartMode = 'stress' | 'force' | 'combined';

export const StressChartSVG: React.FC<StressChartSVGProps> = ({
  points,
  unit,
  darkSurface = false,
}) => {
  const [mode, setMode] = useState<ChartMode>('stress');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const viewW = 540;
  const viewH = 230;
  const padL = 52;
  const padR = 22;
  const padT = 22;
  const padB = 38;
  const plotW = viewW - padL - padR;
  const plotH = viewH - padT - padB;

  const { maxVal, yLabel, series1, series2 } = useMemo(() => {
    if (points.length === 0) {
      return { maxVal: 10, yLabel: 'MPa', series1: [], series2: [] };
    }
    if (mode === 'stress') {
      const vals = points.map((p) => p.stressMPa);
      const max = Math.max(10, Math.ceil(Math.max(...vals) * 1.2));
      return {
        maxVal: max,
        yLabel: 'Esfuerzo (MPa)',
        series1: vals.map((v, i) => ({
          x: padL + (i / Math.max(1, points.length - 1)) * plotW,
          y: padT + plotH - (v / max) * plotH,
          raw: v,
        })),
        series2: [],
      };
    }
    if (mode === 'force') {
      const vals = points.map((p) => fromKN(p.forceKN, unit));
      const max = Math.max(10, Math.ceil(Math.max(...vals) * 1.2));
      return {
        maxVal: max,
        yLabel: `Fuerza (${unit})`,
        series1: vals.map((v, i) => ({
          x: padL + (i / Math.max(1, points.length - 1)) * plotW,
          y: padT + plotH - (v / max) * plotH,
          raw: v,
        })),
        series2: [],
      };
    }

    // Combined: Force (blue) + Deflection scaled (emerald)
    const forces = points.map((p) => fromKN(p.forceKN, unit));
    const maxF = Math.max(10, Math.ceil(Math.max(...forces) * 1.2));
    const defs = points.map((p) => p.deflectionMm);
    const maxD = Math.max(0.1, Math.max(...defs) * 1.25);

    return {
      maxVal: maxF,
      yLabel: `Fuerza (${unit}) / Deform.`,
      series1: forces.map((v, i) => ({
        x: padL + (i / Math.max(1, points.length - 1)) * plotW,
        y: padT + plotH - (v / maxF) * plotH,
        raw: v,
      })),
      series2: defs.map((v, i) => ({
        x: padL + (i / Math.max(1, points.length - 1)) * plotW,
        y: padT + plotH - (v / maxD) * plotH,
        raw: v,
      })),
    };
  }, [points, mode, unit, plotW, plotH]);

  const toPolyline = (pts: Array<{ x: number; y: number }>) =>
    pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const toArea = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return '';
    const line = toPolyline(pts);
    const lastX = pts[pts.length - 1].x.toFixed(1);
    const firstX = pts[0].x.toFixed(1);
    const bottomY = (padT + plotH).toFixed(1);
    return `M ${firstX},${bottomY} L ${line.replace(/ /g, ' L ')} L ${lastX},${bottomY} Z`;
  };

  const activeIndex = hoverIdx !== null && points[hoverIdx] ? hoverIdx : null;
  const activePoint = activeIndex !== null ? points[activeIndex] : null;
  const activeCoord = activeIndex !== null ? series1[activeIndex] : null;

  return (
    <div className="w-full">
      {/* Header + Segmented Metric Control */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-sky-600 dark:text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
            {mode === 'stress' ? 'Esfuerzo' : 'Fuerza'}
          </span>
          {mode === 'combined' && (
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Deformación
            </span>
          )}
        </div>

        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-emerald-950/70 border border-slate-200 dark:border-emerald-800/50">
          {(
            [
              { id: 'stress', label: 'Esfuerzos' },
              { id: 'force', label: 'Fuerzas' },
              { id: 'combined', label: 'Dual' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                mode === tab.id
                  ? 'bg-white dark:bg-emerald-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-emerald-200/75 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Plot */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          className="w-full h-auto overflow-visible select-none"
          role="img"
          aria-label="Gráfica de distribución de esfuerzos y fuerzas"
        >
          <defs>
            <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="areaEmerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16A34A" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#16A34A" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines & Y Ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = padT + plotH - t * plotH;
            const val = maxVal * t;
            return (
              <g key={t}>
                <line
                  x1={padL}
                  y1={y}
                  x2={viewW - padR}
                  y2={y}
                  stroke={darkSurface ? 'rgba(148,163,184,0.16)' : 'rgba(15,23,42,0.08)'}
                  strokeWidth="1"
                />
                <text
                  x={padL - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10.5"
                  fill={darkSurface ? '#94A3B8' : '#64748B'}
                  className="font-mono-tabular"
                >
                  {val >= 100 ? Math.round(val) : val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Y axis title */}
          <text
            x={14}
            y={padT + plotH / 2}
            textAnchor="middle"
            fontSize="10"
            fill={darkSurface ? '#94A3B8' : '#64748B'}
            transform={`rotate(-90 14 ${padT + plotH / 2})`}
          >
            {yLabel}
          </text>

          {/* Area & Line Series 1 */}
          {series1.length > 1 && (
            <>
              <path d={toArea(series1)} fill="url(#areaBlue)" />
              <polyline
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={toPolyline(series1)}
              />
            </>
          )}

          {/* Area & Line Series 2 (Combined Mode) */}
          {series2.length > 1 && (
            <>
              <path d={toArea(series2)} fill="url(#areaEmerald)" />
              <polyline
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={toPolyline(series2)}
              />
            </>
          )}

          {/* Hover Vertical Crosshair */}
          {activeCoord && (
            <line
              x1={activeCoord.x}
              y1={padT}
              x2={activeCoord.x}
              y2={padT + plotH}
              stroke="#16A34A"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          )}

          {/* Data Points & X Labels */}
          {points.map((pt, i) => {
            const c1 = series1[i];
            const c2 = series2[i];
            if (!c1) return null;
            const isActive = activeIndex === i;
            return (
              <g key={pt.index}>
                <text
                  x={c1.x}
                  y={padT + plotH + 18}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill={darkSurface ? '#94A3B8' : '#64748B'}
                  className="font-mono-tabular"
                >
                  {pt.positionLabel}
                </text>
                {c2 && (
                  <circle
                    cx={c2.x}
                    cy={c2.y}
                    r={isActive ? 5 : 3.5}
                    fill="#16A34A"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                )}
                <circle
                  cx={c1.x}
                  cy={c1.y}
                  r={isActive ? 5.5 : 4}
                  fill="#0284C7"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                {/* Interactive hover/tap strip */}
                <rect
                  x={c1.x - plotW / Math.max(2, points.length * 2)}
                  y={padT}
                  width={plotW / Math.max(1, points.length)}
                  height={plotH + 24}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                  onClick={() => setHoverIdx(isActive ? null : i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Active Tooltip Footer */}
        <div className="mt-1 min-h-[24px] flex items-center justify-between text-xs text-slate-600 dark:text-emerald-200/80 px-1 font-mono-tabular">
          {activePoint ? (
            <>
              <span>Nodo {activePoint.index} ({activePoint.positionLabel})</span>
              <span>
                {activePoint.stressMPa.toFixed(1)} MPa ·{' '}
                {fromKN(activePoint.forceKN, unit).toFixed(unit === ForceUnit.N ? 0 : 1)} {unit} ·{' '}
                {activePoint.deflectionMm.toFixed(2)} mm
              </span>
            </>
          ) : (
            <>
              <span>Nodos / Posición (m)</span>
              <span className="font-sans text-[11px] opacity-75">Pasa o toca un punto para ver valores</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
