import React, { useMemo, useState } from 'react';
import { Maximize2, Minimize2, Info } from 'lucide-react';
import {
  SimulationResult,
  StructureMember,
  StructureNode,
  StructureType,
  SupportCondition,
} from '../types/simulation';
import { formatDistLoad, formatForce, formatTorque } from '../lib/physics';

interface StructureDiagramSVGProps {
  result: SimulationResult;
  exaggerateDeflection: boolean;
  showStressColors: boolean;
  darkBlueprint?: boolean;
  compact?: boolean;
}

export const StructureDiagramSVG: React.FC<StructureDiagramSVGProps> = ({
  result,
  exaggerateDeflection,
  showStressColors,
  darkBlueprint = false,
  compact = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StructureMember | null>(null);
  const [selectedNode, setSelectedNode] = useState<StructureNode | null>(null);

  const { nodes, members, params, reactionAKN, reactionBKN, reactionAxKN, loadKN, windKN, fixedMomentAKNm } = result;
  const unit = params.unit;
  const distLoadKNm = result.distributedTotalKN / Math.max(1, params.lengthM);

  // Compute SVG world bounding box & transform
  const layout = useMemo(() => {
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const spanX = Math.max(2, maxX - minX);
    const spanY = Math.max(2, maxY - minY);

    const viewW = 720;
    const viewH = compact ? 360 : 410;
    const padX = 95;
    const padTop = 78;
    const padBottom = 86;

    const availW = viewW - padX * 2;
    const availH = viewH - padTop - padBottom;
    const scale = Math.min(availW / spanX, availH / spanY);

    const offsetX = (viewW - spanX * scale) / 2 - minX * scale;
    const offsetY = viewH - padBottom + minY * scale;

    // Exaggerate displacements visually so small mm deflections are noticeable without breaking proportions
    const maxDispMm = Math.max(0.1, result.maxDeflectionMm);
    const defScalePx = exaggerateDeflection ? Math.min(28 / maxDispMm, 12) : 0;

    const toSvg = (x: number, y: number, dxMm = 0, dyMm = 0) => ({
      sx: offsetX + x * scale + dxMm * defScalePx,
      sy: offsetY - y * scale - dyMm * defScalePx,
    });

    const toSvgStatic = (x: number, y: number) => ({
      sx: offsetX + x * scale,
      sy: offsetY - y * scale,
    });

    return { viewW, viewH, scale, toSvg, toSvgStatic, minX, maxX, minY, maxY };
  }, [nodes, compact, exaggerateDeflection, result.maxDeflectionMm]);

  const getMemberStroke = (m: StructureMember) => {
    if (!showStressColors) {
      return darkBlueprint ? '#94A3B8' : '#475569';
    }
    if (m.utilization > 0.9) return '#EF4444'; // critical overload
    if (m.axialForceKN > 0.05) return '#0EA5E9'; // tension (azure/cyan)
    if (m.axialForceKN < -0.05) return '#F59E0B'; // compression (amber/orange)
    return darkBlueprint ? '#64748B' : '#475569';
  };

  // Determine load arrow position
  const loadTarget = useMemo(() => {
    const xLoad = (params.loadPositionPct / 100) * params.lengthM;
    if (params.structureType === StructureType.TOWER) {
      const topY = params.heightM;
      const p = layout.toSvg(params.lengthM / 2, topY, 0, 0);
      return { sx: p.sx, sy: p.sy };
    }
    if (params.structureType === StructureType.BUILDING) {
      const p = layout.toSvg(xLoad, params.heightM, 0, 0);
      return { sx: p.sx, sy: p.sy };
    }
    if (params.structureType === StructureType.SUSPENSION) {
      const p = layout.toSvg(xLoad, 0, 0, -result.maxDeflectionMm * 0.6);
      return { sx: p.sx, sy: p.sy };
    }
    // Truss: top chord elevation
    const p = layout.toSvg(xLoad, params.heightM, 0, 0);
    return { sx: p.sx, sy: p.sy };
  }, [params, layout, result.maxDeflectionMm]);

  const massTarget = useMemo(() => {
    const xMass = (params.additionalMassPositionPct / 100) * params.lengthM;
    if (params.structureType === StructureType.TOWER) {
      return layout.toSvg(params.lengthM / 2, params.heightM * 0.85, 0, 0);
    }
    if (params.structureType === StructureType.SUSPENSION) {
      return layout.toSvg(xMass, 0, 0, -result.maxDeflectionMm * 0.5);
    }
    return layout.toSvg(xMass, params.heightM, 0, 0);
  }, [params, layout, result.maxDeflectionMm]);

  // Support nodes (pin/roller/fixed)
  const supportNodes = useMemo(() => {
    const supports = nodes.filter((n) => n.support);
    if (supports.length <= 2) return supports;
    return [supports[0], supports[supports.length - 1]];
  }, [nodes]);

  const renderCanvas = (fullMode: boolean) => (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border transition-colors ${
        darkBlueprint
          ? 'bg-[#091A11] border-emerald-900/50 text-emerald-50'
          : 'bg-white dark:bg-[#091A11] border-slate-200 dark:border-emerald-900/50 text-slate-800 dark:text-emerald-50'
      } ${fullMode ? 'h-[70vh]' : compact ? 'h-[260px] sm:h-[310px]' : 'h-[320px] sm:h-[390px]'}`}
    >
      {/* Top toolbar inside stage */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <div
          className={`pointer-events-auto flex flex-wrap items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm border ${
            darkBlueprint
              ? 'bg-emerald-950/75 border-emerald-800/60 text-emerald-100'
              : 'bg-white/90 dark:bg-emerald-950/80 border-slate-200 dark:border-emerald-800/60 text-slate-700 dark:text-emerald-100'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-1 rounded-full bg-sky-500 inline-block" />
            Tensión
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-1 rounded-full bg-amber-500 inline-block" />
            Compresión
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-1 rounded-full bg-red-500 inline-block" />
            Carga / Sobrecarga
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsFullscreen((prev) => !prev)}
          aria-label={isFullscreen ? 'Minimizar diagrama' : 'Expandir diagrama'}
          className={`pointer-events-auto min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg border transition-colors ${
            darkBlueprint
              ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-100 hover:bg-emerald-900'
              : 'bg-white/90 dark:bg-emerald-950/80 border-slate-200 dark:border-emerald-800/60 text-slate-700 dark:text-emerald-100 hover:bg-slate-100 dark:hover:bg-emerald-900'
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main SVG */}
      <svg
        viewBox={`0 0 ${layout.viewW} ${layout.viewH}`}
        className="w-full h-full select-none"
        role="img"
        aria-label="Diagrama estructural interactivo con fuerzas y reacciones"
      >
        <defs>
          <pattern
            id={`grid-${fullMode ? 'full' : 'main'}`}
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke={darkBlueprint ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.05)'}
              strokeWidth="1"
            />
          </pattern>
          <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
          </marker>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#16A34A" />
          </marker>
          <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#F59E0B" />
          </marker>
        </defs>

        <rect width={layout.viewW} height={layout.viewH} fill={`url(#grid-${fullMode ? 'full' : 'main'})`} />

        {/* Baseline Ground Line */}
        <line
          x1={40}
          y1={layout.toSvgStatic(0, 0).sy + 14}
          x2={layout.viewW - 40}
          y2={layout.toSvgStatic(0, 0).sy + 14}
          stroke={darkBlueprint ? 'rgba(148, 163, 184, 0.25)' : 'rgba(100, 116, 139, 0.22)'}
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Ghost Original Undeformed Geometry when deflection exaggerated */}
        {exaggerateDeflection &&
          members.map((m) => {
            const n1 = nodes[m.startNode];
            const n2 = nodes[m.endNode];
            if (!n1 || !n2) return null;
            const p1 = layout.toSvgStatic(n1.x, n1.y);
            const p2 = layout.toSvgStatic(n2.x, n2.y);
            return (
              <line
                key={`ghost-${m.id}`}
                x1={p1.sx}
                y1={p1.sy}
                x2={p2.sx}
                y2={p2.sy}
                stroke={darkBlueprint ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.35)'}
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            );
          })}

        {/* Active Deformed Members */}
        {members.map((m) => {
          const n1 = nodes[m.startNode];
          const n2 = nodes[m.endNode];
          if (!n1 || !n2) return null;
          const p1 = layout.toSvg(n1.x, n1.y, n1.dxMm, n1.dyMm);
          const p2 = layout.toSvg(n2.x, n2.y, n2.dxMm, n2.dyMm);
          const isSelected = selectedMember?.id === m.id;
          const stroke = getMemberStroke(m);
          const thickness = m.role === 'pylon' || m.role === 'column' ? 6 : m.role === 'cable' ? 3.5 : 5;

          return (
            <g
              key={`member-${m.id}`}
              className="cursor-pointer"
              onClick={() => {
                setSelectedNode(null);
                setSelectedMember(isSelected ? null : m);
              }}
            >
              {/* Invisible wide touch hit area */}
              <line x1={p1.sx} y1={p1.sy} x2={p2.sx} y2={p2.sy} stroke="transparent" strokeWidth="18" />
              <line
                x1={p1.sx}
                y1={p1.sy}
                x2={p2.sx}
                y2={p2.sy}
                stroke={stroke}
                strokeWidth={isSelected ? thickness + 2.5 : thickness}
                strokeLinecap="round"
                className="transition-all duration-150"
              />
            </g>
          );
        })}

        {/* Distributed Load w arrows */}
        {distLoadKNm > 0.001 && (
          <g opacity="0.85">
            {(() => {
              const topY = params.structureType === StructureType.SUSPENSION ? 0 : params.heightM;
              const pLeft = layout.toSvgStatic(0, topY);
              const pRight = layout.toSvgStatic(params.lengthM, topY);
              const barY = pLeft.sy - 26;
              return (
                <>
                  <line x1={pLeft.sx} y1={barY} x2={pRight.sx} y2={barY} stroke="#F59E0B" strokeWidth="2" />
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((f) => {
                    const px = pLeft.sx + (pRight.sx - pLeft.sx) * f;
                    return (
                      <line
                        key={f}
                        x1={px}
                        y1={barY}
                        x2={px}
                        y2={pLeft.sy - 6}
                        stroke="#F59E0B"
                        strokeWidth="1.8"
                        markerEnd="url(#arrow-amber)"
                      />
                    );
                  })}
                  <text
                    x={pRight.sx}
                    y={barY - 6}
                    textAnchor="end"
                    fill={darkBlueprint ? '#FCD34D' : '#B45309'}
                    fontSize="11"
                    fontWeight="600"
                    className="font-mono-tabular"
                  >
                    w = {formatDistLoad(distLoadKNm, unit)}
                  </text>
                </>
              );
            })()}
          </g>
        )}

        {/* Horizontal Wind Force Vector */}
        {windKN > 0.001 && (
          <g>
            {(() => {
              const pWind = layout.toSvgStatic(0, params.heightM * 0.75);
              return (
                <>
                  <line
                    x1={pWind.sx - 56}
                    y1={pWind.sy}
                    x2={pWind.sx - 10}
                    y2={pWind.sy}
                    stroke="#F59E0B"
                    strokeWidth="2.8"
                    markerEnd="url(#arrow-amber)"
                  />
                  <text
                    x={pWind.sx - 58}
                    y={pWind.sy - 7}
                    textAnchor="start"
                    fill={darkBlueprint ? '#FCD34D' : '#B45309'}
                    fontSize="11"
                    fontWeight="700"
                    className="font-mono-tabular"
                  >
                    Fh = {formatForce(windKN, unit)}
                  </text>
                </>
              );
            })()}
          </g>
        )}

        {/* Additional Mass Block (m_adic) */}
        {params.additionalMassKg > 0 && (
          <g>
            <rect
              x={massTarget.sx - 20}
              y={massTarget.sy - 20}
              width="40"
              height="16"
              rx="4"
              fill={darkBlueprint ? '#1E3A8A' : '#DBEAFE'}
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            <text
              x={massTarget.sx}
              y={massTarget.sy - 8.5}
              textAnchor="middle"
              fill={darkBlueprint ? '#BAE6FD' : '#0369A1'}
              fontSize="10"
              fontWeight="700"
              className="font-mono-tabular"
            >
              {params.additionalMassKg} kg
            </text>
          </g>
        )}

        {/* Applied Force Vector Arrow (Angled at forceAngleDeg) */}
        {(() => {
          const rad = (params.forceAngleDeg * Math.PI) / 180;
          const lenPx = 46;
          const tailX = loadTarget.sx - Math.cos(rad) * lenPx;
          const tailY = loadTarget.sy - Math.sin(rad) * lenPx;
          const tipX = loadTarget.sx - Math.cos(rad) * 7;
          const tipY = loadTarget.sy - Math.sin(rad) * 7;
          const labelW = params.forceAngleDeg !== 90 ? 104 : 84;
          return (
            <g>
              <line
                x1={tailX}
                y1={tailY}
                x2={tipX}
                y2={tipY}
                stroke="#EF4444"
                strokeWidth="3.5"
                markerEnd="url(#arrow-red)"
              />
              <rect
                x={tailX - labelW / 2}
                y={tailY - 24}
                width={labelW}
                height="21"
                rx="6"
                fill={darkBlueprint ? '#450A0A' : '#FEF2F2'}
                stroke="#EF4444"
                strokeWidth="1"
              />
              <text
                x={tailX}
                y={tailY - 9.5}
                textAnchor="middle"
                fill={darkBlueprint ? '#FCA5A5' : '#B91C1C'}
                fontSize="11.5"
                fontWeight="700"
                className="font-mono-tabular"
              >
                F = {formatForce(loadKN, unit)}
                {params.forceAngleDeg !== 90 ? ` · ${params.forceAngleDeg}°` : ''}
              </text>
            </g>
          );
        })()}

        {/* Supports & Reaction Vectors (RA and RB) */}
        {supportNodes.map((sn, idx) => {
          const p = layout.toSvgStatic(sn.x, sn.y);
          const isLeft = idx === 0;
          const rVal = isLeft ? reactionAKN : reactionBKN;
          const labelPrefix = isLeft ? 'RA' : 'RB';
          const isCantilever = params.supportCondition === SupportCondition.CANTILEVER && params.structureType === StructureType.TRUSS;
          return (
            <g key={`support-${sn.id}`}>
              {sn.support === 'fixed' ? (
                <rect
                  x={p.sx - 11}
                  y={p.sy + 2}
                  width="22"
                  height="12"
                  rx="2"
                  fill={darkBlueprint ? '#334155' : '#94A3B8'}
                  stroke={darkBlueprint ? '#94A3B8' : '#475569'}
                  strokeWidth="1.5"
                />
              ) : (
                <polygon
                  points={`${p.sx},${p.sy + 3} ${p.sx - 9},${p.sy + 15} ${p.sx + 9},${p.sy + 15}`}
                  fill={darkBlueprint ? '#1E293B' : '#CBD5E1'}
                  stroke={darkBlueprint ? '#64748B' : '#475569'}
                  strokeWidth="1.5"
                />
              )}
              <line
                x1={p.sx}
                y1={p.sy + 52}
                x2={p.sx}
                y2={p.sy + 21}
                stroke="#16A34A"
                strokeWidth="3.2"
                markerEnd="url(#arrow-green)"
              />
              <text
                x={p.sx + (isLeft ? 8 : -8)}
                y={p.sy + 68}
                textAnchor={isLeft ? 'start' : 'end'}
                fill={darkBlueprint ? '#4ADE80' : '#15803D'}
                fontSize="12"
                fontWeight="700"
                className="font-mono-tabular"
              >
                {`${labelPrefix} = ${formatForce(rVal, unit)}`}
                {isLeft && Math.abs(reactionAxKN) > 0.05 ? ` · Rx ${formatForce(reactionAxKN, unit)}` : ''}
                {isLeft && isCantilever ? ` · MA ${formatTorque(fixedMomentAKNm, unit)}` : ''}
              </text>
            </g>
          );
        })}

        {/* Structural Joints / Nodes */}
        {nodes.map((n) => {
          const p = layout.toSvg(n.x, n.y, n.dxMm, n.dyMm);
          const isSelected = selectedNode?.id === n.id;
          return (
            <g
              key={`node-${n.id}`}
              className="cursor-pointer"
              onClick={() => {
                setSelectedMember(null);
                setSelectedNode(isSelected ? null : n);
              }}
            >
              <circle cx={p.sx} cy={p.sy} r={14} fill="transparent" />
              <circle
                cx={p.sx}
                cy={p.sy}
                r={isSelected ? 7.5 : 5.5}
                fill={isSelected ? '#16A34A' : darkBlueprint ? '#0EA5E9' : '#1D4ED8'}
                stroke={darkBlueprint ? '#091A11' : '#FFFFFF'}
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>

      {/* Interactive Inspector Toast at bottom-left */}
      {(selectedMember || selectedNode) && (
        <div
          className={`absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm p-3 rounded-xl border text-xs shadow-lg backdrop-blur-md ${
            darkBlueprint
              ? 'bg-emerald-950/90 border-emerald-700/60 text-emerald-50'
              : 'bg-white/95 dark:bg-emerald-950/90 border-slate-200 dark:border-emerald-700/60 text-slate-800 dark:text-emerald-50'
          }`}
        >
          {selectedMember ? (
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  Elemento E-{selectedMember.id + 1} ·{' '}
                  {selectedMember.axialForceKN >= 0 ? 'Tensión' : 'Compresión'}
                </p>
                <p className="text-[11px] opacity-80 mt-0.5 font-mono-tabular">
                  Fuerza: {formatForce(Math.abs(selectedMember.axialForceKN), unit)} · Esfuerzo:{' '}
                  {selectedMember.stressMPa.toFixed(1)} MPa · Uso:{' '}
                  {(selectedMember.utilization * 100).toFixed(0)}%
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="text-[11px] underline opacity-80 hover:opacity-100"
              >
                Cerrar
              </button>
            </div>
          ) : selectedNode ? (
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  Nodo {selectedNode.label} ({selectedNode.x.toFixed(1)} m, {selectedNode.y.toFixed(1)} m)
                </p>
                <p className="text-[11px] opacity-80 mt-0.5 font-mono-tabular">
                  Desplazamiento Δx: {selectedNode.dxMm.toFixed(2)} mm · Δy:{' '}
                  {selectedNode.dyMm.toFixed(2)} mm
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="text-[11px] underline opacity-80 hover:opacity-100"
              >
                Cerrar
              </button>
            </div>
          ) : null}
        </div>
      )}

      {!selectedMember && !selectedNode && (
        <div className="absolute bottom-2.5 right-3 hidden sm:flex items-center gap-1.5 text-[11px] opacity-65 pointer-events-none">
          <Info className="w-3.5 h-3.5" />
          <span>Toca una barra o nodo para inspeccionar</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {renderCanvas(false)}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de la estructura"
        >
          <div className="w-full max-w-5xl">
            {renderCanvas(true)}
          </div>
        </div>
      )}
    </>
  );
};
