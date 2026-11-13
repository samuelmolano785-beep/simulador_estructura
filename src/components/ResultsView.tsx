import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XOctagon,
  Download,
  BookmarkCheck,
  SlidersHorizontal,
  Calculator,
} from 'lucide-react';
import {
  SimulationResult,
  StabilityStatus,
} from '../types/simulation';
import {
  formatDistLoad,
  formatForce,
  formatTorque,
  MATERIALS,
  STRUCTURE_CATALOG,
} from '../lib/physics';
import { exportSimulationCSV } from '../lib/store';
import { StressChartSVG } from './StressChartSVG';

interface ResultsViewProps {
  result: SimulationResult;
  darkTheme: boolean;
  onSaveResult: () => void;
  onBackToSimulator: () => void;
  justSaved: boolean;
}

type MobileTab = 'analysis' | 'calculations' | 'charts' | 'details';

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  darkTheme,
  onSaveResult,
  onBackToSimulator,
  justSaved,
}) => {
  const [mobileTab, setMobileTab] = useState<MobileTab>('analysis');
  const unit = result.params.unit;
  const structureName =
    STRUCTURE_CATALOG.find((s) => s.id === result.params.structureType)?.name ??
    'Estructura';
  const material = MATERIALS[result.params.material];

  const StatusIcon =
    result.status === StabilityStatus.STABLE
      ? CheckCircle2
      : result.status === StabilityStatus.WARNING
        ? AlertTriangle
        : XOctagon;

  const statusTone =
    result.status === StabilityStatus.STABLE
      ? {
          badge:
            'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200',
          iconWrap: 'bg-emerald-600 text-white',
        }
      : result.status === StabilityStatus.WARNING
        ? {
            badge:
              'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-200',
            iconWrap: 'bg-amber-500 text-white',
          }
        : {
            badge:
              'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800/70 text-red-800 dark:text-red-200',
            iconWrap: 'bg-red-600 text-white',
          };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Resultados y Memoria de Cálculo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-200/75 mt-0.5">
            {structureName} · {result.params.lengthM} m × {result.params.heightM} m ·{' '}
            {material.label} · P = {formatForce(result.loadKN, unit)} · w ={' '}
            {formatDistLoad(result.distributedTotalKN / result.params.lengthM, unit)}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToSimulator}
            className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-800/60 text-slate-700 dark:text-emerald-100 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Editar Datos</span>
          </button>

          <button
            type="button"
            onClick={() => exportSimulationCSV(result)}
            className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-800/60 text-slate-700 dark:text-emerald-100 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Mobile Segmented Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-900/60 lg:hidden">
        {(
          [
            { id: 'analysis', label: 'Análisis' },
            { id: 'calculations', label: 'Cálculos' },
            { id: 'charts', label: 'Gráficas' },
            { id: 'details', label: 'Barras' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobileTab(tab.id)}
            className={`min-h-[40px] rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              mobileTab === tab.id
                ? 'bg-[#16A34A] text-white'
                : 'text-slate-600 dark:text-emerald-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top 3-Column Dashboard (All visible on lg+, tabbed on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Análisis Estructural */}
        <section
          className={`lg:col-span-4 rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-5 flex flex-col justify-between ${
            mobileTab !== 'analysis' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-3.5">
              Análisis Estructural
            </h2>

            <dl className="divide-y divide-slate-100 dark:divide-emerald-900/50 text-xs sm:text-sm">
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Fuerza Aplicada (Fx / Fy)</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white text-right">
                  {formatForce(result.forceHorizontalKN, unit)} / {formatForce(result.forceVerticalKN, unit)}
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Masa Adicional / Total</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white text-right">
                  {result.params.additionalMassKg} kg / {result.totalMassKg.toFixed(0)} kg
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Carga Diseño (γ_f · ΣFy)</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white">
                  {formatForce(result.factoredVerticalLoadKN, unit)}
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Reacciones (RAy / RBy)</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white text-right">
                  {formatForce(result.reactionAKN, unit)} / {formatForce(result.reactionBKN, unit)}
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Cortante / Momento Máx.</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white text-right">
                  {formatForce(result.maxShearKN, unit)} · {formatTorque(result.maxMomentKNm, unit)}
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Esfuerzo Máximo (σ)</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white">
                  {result.maxStressMPa.toFixed(2)} MPa
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Pandeo Euler (P_cr)</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white">
                  {formatForce(result.eulerCriticalLoadKN, unit)}
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Deformación vs L/360</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white text-right">
                  {result.maxDeflectionMm.toFixed(2)} / {result.allowableDeflectionMm.toFixed(1)} mm
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Dilatación Térmica (ΔL_T)</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white">
                  {result.thermalElongationMm.toFixed(2)} mm
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Centro de Masa</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white">
                  ({result.centerOfMass.x.toFixed(2)} m, {result.centerOfMass.y.toFixed(2)} m)
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-emerald-200/75">Factor Seguridad (FS)</dt>
                <dd className="font-semibold font-mono-tabular text-slate-900 dark:text-white">
                  {result.safetyFactor.toFixed(2)} (Req. ≥ {result.params.requiredSafetyFactor.toFixed(2)})
                </dd>
              </div>
            </dl>
          </div>

          <div
            className={`mt-4 px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 text-sm font-semibold ${statusTone.badge}`}
          >
            <StatusIcon className="w-4 h-4 shrink-0" />
            <span>{result.statusLabel}</span>
          </div>
        </section>

        {/* Column 2: Diagrama de Esfuerzos / Fuerzas */}
        <section
          className={`lg:col-span-5 rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-5 flex flex-col justify-between ${
            mobileTab !== 'charts' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="mb-3">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Diagrama de Esfuerzos y Fuerzas
            </h2>
            <p className="text-xs text-slate-500 dark:text-emerald-200/75">
              Distribución estructural a lo largo de los nodos
            </p>
          </div>

          <StressChartSVG
            points={result.chartPoints}
            unit={unit}
            darkSurface={darkTheme}
          />
        </section>

        {/* Column 3: Recomendación & Guardar */}
        <section
          className={`lg:col-span-3 rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-5 flex flex-col justify-between ${
            mobileTab !== 'analysis' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Recomendación
            </h2>

            <div className="flex flex-col items-center text-center pt-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-xs ${statusTone.iconWrap}`}
              >
                <StatusIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                {result.statusLabel}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={onSaveResult}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{justSaved ? 'Guardado en Historial' : 'Guardar Resultados'}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Step-by-Step Numerical Calculation Memory */}
      <section
        className={`rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-5 ${
          mobileTab !== 'calculations' ? 'hidden lg:block' : 'block'
        }`}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Memoria de Cálculo Numérico (Paso a Paso)
            </h2>
            <p className="text-xs text-slate-500 dark:text-emerald-200/75">
              Ecuaciones de estática, resistencia de materiales y estabilidad evaluadas con tus parámetros
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {result.calculationSteps.map((step) => (
            <article
              key={step.id}
              className="rounded-xl bg-slate-50/80 dark:bg-[#081910] border border-slate-200/80 dark:border-emerald-900/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  {String(step.stepNumber).padStart(2, '0')}. {step.title}
                </h3>
              </div>
              <p className="text-xs font-mono-tabular text-sky-700 dark:text-sky-300 bg-white dark:bg-[#0D2318] px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-emerald-900/50 overflow-x-auto">
                {step.formula}
              </p>
              <p className="text-xs font-mono-tabular text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                {step.substitution}
              </p>
              <p className="text-xs sm:text-sm font-mono-tabular font-bold text-emerald-700 dark:text-emerald-400 pt-1 border-t border-slate-200/70 dark:border-emerald-900/40">
                ⇒ {step.resultText}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Detailed Element-by-Element Breakdown Table */}
      <section
        className={`rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-5 ${
          mobileTab !== 'details' ? 'hidden lg:block' : 'block'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Detalle por Elemento ({result.members.length} barras)
            </h2>
            <p className="text-xs text-slate-500 dark:text-emerald-200/75">
              Fuerzas axiales internas, esfuerzo unitario y porcentaje de utilización respecto al límite de fluencia ({material.yieldStrengthMPa} MPa)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-900/60 text-xs font-semibold text-slate-500 dark:text-emerald-200/75">
                <th className="py-2.5 pr-4">Elemento</th>
                <th className="py-2.5 pr-4">Trabajo</th>
                <th className="py-2.5 pr-4">Longitud</th>
                <th className="py-2.5 pr-4">Fuerza Axial</th>
                <th className="py-2.5 pr-4">Esfuerzo</th>
                <th className="py-2.5">Utilización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-emerald-900/40 font-mono-tabular text-xs sm:text-sm">
              {result.members.map((m) => {
                const isTension = m.axialForceKN >= 0;
                const utilPct = Math.min(100, m.utilization * 100);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-emerald-950/40">
                    <td className="py-2.5 pr-4 font-semibold text-slate-900 dark:text-white">
                      E-{m.id + 1}
                    </td>
                    <td className="py-2.5 pr-4 font-sans">
                      <span
                        className={
                          isTension
                            ? 'text-sky-700 dark:text-sky-400 font-medium'
                            : 'text-amber-700 dark:text-amber-400 font-medium'
                        }
                      >
                        {isTension ? 'Tensión' : 'Compresión'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-emerald-100">
                      {m.lengthM.toFixed(2)} m
                    </td>
                    <td className="py-2.5 pr-4 text-slate-800 dark:text-white">
                      {formatForce(Math.abs(m.axialForceKN), unit)}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-800 dark:text-white">
                      {m.stressMPa.toFixed(2)} MPa
                    </td>
                    <td className="py-2.5 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-emerald-950 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              m.utilization > 0.9
                                ? 'bg-red-500'
                                : m.utilization > 0.65
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-600'
                            }`}
                            style={{ width: `${utilPct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs text-slate-600 dark:text-emerald-200">
                          {(m.utilization * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
