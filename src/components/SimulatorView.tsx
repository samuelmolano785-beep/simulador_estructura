import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  BookmarkCheck,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  XOctagon,
  Calculator,
} from 'lucide-react';
import {
  ForceUnit,
  MaterialType,
  SimulationParams,
  SimulationResult,
  StabilityStatus,
  StructureType,
  SupportCondition,
  TrussVariant,
} from '../types/simulation';
import {
  formatDistLoad,
  formatForce,
  formatTorque,
  fromKN,
  MATERIALS,
  STRUCTURE_CATALOG,
  toKN,
} from '../lib/physics';
import { StructureDiagramSVG } from './StructureDiagramSVG';

interface SimulatorViewProps {
  params: SimulationParams;
  result: SimulationResult;
  exaggerateDeflection: boolean;
  showStressColors: boolean;
  onToggleDeflection: () => void;
  onToggleStressColors: () => void;
  onChangeParams: (next: SimulationParams) => void;
  onSimulatePulse: () => void;
  onSaveResult: () => void;
  onOpenResults: () => void;
  justSimulated: boolean;
  justSaved: boolean;
}

type ParamTab = 'loads' | 'geometry' | 'supports';

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  params,
  result,
  exaggerateDeflection,
  showStressColors,
  onToggleDeflection,
  onToggleStressColors,
  onChangeParams,
  onSimulatePulse,
  onSaveResult,
  onOpenResults,
  justSimulated,
  justSaved,
}) => {
  const [paramTab, setParamTab] = useState<ParamTab>('loads');

  const isTower = params.structureType === StructureType.TOWER;
  const isTruss = params.structureType === StructureType.TRUSS;
  const isBuilding = params.structureType === StructureType.BUILDING;

  const handleStructureSwitch = (type: StructureType) => {
    const preset = STRUCTURE_CATALOG.find((s) => s.id === type);
    if (!preset) return;
    const unit = params.unit;
    const baseKN = toKN(preset.defaultParams.loadValue, preset.defaultParams.unit);
    const distKNm = toKN(preset.defaultParams.distributedLoadValue, preset.defaultParams.unit);
    const windKN = toKN(preset.defaultParams.windLoadValue, preset.defaultParams.unit);
    onChangeParams({
      ...preset.defaultParams,
      unit,
      loadValue: Math.round(fromKN(baseKN, unit)),
      distributedLoadValue: Number(fromKN(distKNm, unit).toFixed(unit === ForceUnit.N ? 0 : 2)),
      windLoadValue: Math.round(fromKN(windKN, unit)),
    });
  };

  const handleUnitSwitch = (nextUnit: ForceUnit) => {
    if (nextUnit === params.unit) return;
    const pointKN = toKN(params.loadValue, params.unit);
    const distKNm = toKN(params.distributedLoadValue, params.unit);
    const windKN = toKN(params.windLoadValue, params.unit);
    onChangeParams({
      ...params,
      unit: nextUnit,
      loadValue: Number(fromKN(pointKN, nextUnit).toFixed(nextUnit === ForceUnit.N ? 0 : 2)),
      distributedLoadValue: Number(
        fromKN(distKNm, nextUnit).toFixed(nextUnit === ForceUnit.N ? 0 : 2)
      ),
      windLoadValue: Number(fromKN(windKN, nextUnit).toFixed(nextUnit === ForceUnit.N ? 0 : 2)),
    });
  };

  const handleMaterialChange = (matId: MaterialType) => {
    const spec = MATERIALS[matId];
    onChangeParams({
      ...params,
      material: matId,
      sectionAreaCm2: spec.defaultSectionAreaCm2,
      momentOfInertiaCm4: spec.defaultInertiaCm4,
    });
  };

  const loadMin = 0;
  const loadMax = params.unit === ForceUnit.N ? 50000 : 250;
  const loadStep = params.unit === ForceUnit.N ? 100 : 1;

  const StatusIcon =
    result.status === StabilityStatus.STABLE
      ? CheckCircle2
      : result.status === StabilityStatus.WARNING
        ? AlertTriangle
        : XOctagon;

  const statusClasses =
    result.status === StabilityStatus.STABLE
      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200'
      : result.status === StabilityStatus.WARNING
        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-200'
        : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800/70 text-red-800 dark:text-red-200';

  return (
    <div className="space-y-5">
      {/* Structure Type Segmented Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-900/50 overflow-x-auto max-w-full">
          {STRUCTURE_CATALOG.map((item) => {
            const active = params.structureType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleStructureSwitch(item.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#115E34] text-white shadow-xs'
                    : 'text-slate-600 dark:text-emerald-200/80 hover:bg-slate-100 dark:hover:bg-emerald-900/50'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Unit Toggle kN / N */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-900/50">
          <span className="text-xs text-slate-500 dark:text-emerald-200/70 px-2">Unidad:</span>
          {[ForceUnit.KN, ForceUnit.N].map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => handleUnitSwitch(u)}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                params.unit === u
                  ? 'bg-[#115E34] text-white'
                  : 'text-slate-600 dark:text-emerald-200/80 hover:bg-slate-100 dark:hover:bg-emerald-900/50'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Workspace: Controls Left + Diagram & Calculations Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Parameter Controls Card */}
        <section className="lg:col-span-5 xl:col-span-4 rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Datos de Entrada
            </h2>
            <button
              type="button"
              onClick={() => handleStructureSwitch(params.structureType)}
              title="Restablecer valores"
              className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900/60 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
          </div>

          {/* Segmented Input Categories */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#081910] border border-slate-200/80 dark:border-emerald-900/50">
            {(
              [
                { id: 'loads', label: 'Fuerza y Masa' },
                { id: 'geometry', label: 'Geometría' },
                { id: 'supports', label: 'Material' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setParamTab(t.id)}
                className={`min-h-[36px] px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  paramTab === t.id
                    ? 'bg-white dark:bg-[#115E34] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-emerald-200/75'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: APPLIED FORCE, ADDITIONAL MASS, POSITIONS & MORE LOADS */}
          {paramTab === 'loads' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Fuerza aplicada F ({params.unit})
                  </label>
                  <input
                    type="number"
                    min={loadMin}
                    max={loadMax}
                    step={loadStep}
                    value={params.loadValue}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        loadValue: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Ángulo fuerza θ (°)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={150}
                    step={5}
                    value={params.forceAngleDeg}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        forceAngleDeg: Math.max(
                          30,
                          Math.min(150, Number(e.target.value) || 90)
                        ),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Masa adicional (kg)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50000}
                    step={50}
                    value={params.additionalMassKg}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        additionalMassKg: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Gravedad g (m/s²)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    step={0.01}
                    value={params.gravityMs2}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        gravityMs2: Math.max(1, Number(e.target.value) || 9.81),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Carga dist. w ({params.unit}/m)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={params.unit === ForceUnit.N ? 10000 : 100}
                    step={params.unit === ForceUnit.N ? 50 : 0.5}
                    value={params.distributedLoadValue}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        distributedLoadValue: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Viento / Lateral Fh ({params.unit})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={params.unit === ForceUnit.N ? 25000 : 150}
                    step={params.unit === ForceUnit.N ? 50 : 1}
                    value={params.windLoadValue}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        windLoadValue: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Applied Force Position x_F */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600 dark:text-emerald-200/80">
                    {isTower ? 'Desbalance fuerza (%)' : 'Posición fuerza aplicada (x_F)'}
                  </span>
                  <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white">
                    {((params.loadPositionPct / 100) * params.lengthM).toFixed(2)} m (
                    {params.loadPositionPct}%)
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={params.loadPositionPct}
                  onChange={(e) =>
                    onChangeParams({ ...params, loadPositionPct: Number(e.target.value) })
                  }
                  className="w-full accent-[#16A34A] cursor-pointer"
                />
              </div>

              {/* Additional Mass Position x_m */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600 dark:text-emerald-200/80">
                    Posición masa adicional (x_m)
                  </span>
                  <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white">
                    {((params.additionalMassPositionPct / 100) * params.lengthM).toFixed(2)} m (
                    {params.additionalMassPositionPct}%)
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={params.additionalMassPositionPct}
                  onChange={(e) =>
                    onChangeParams({
                      ...params,
                      additionalMassPositionPct: Number(e.target.value),
                    })
                  }
                  className="w-full accent-[#0284C7] cursor-pointer"
                />
              </div>

              {/* Include Self-Weight Checkbox */}
              <label className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-200 dark:border-emerald-900/50 cursor-pointer">
                <div>
                  <span className="block text-xs font-semibold text-slate-800 dark:text-white">
                    Incluir peso propio estructural
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-emerald-200/70 font-mono-tabular">
                    W_propio = {formatForce(result.selfWeightKN, params.unit)} · W_adic ={' '}
                    {formatForce(result.additionalWeightKN, params.unit)}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={params.includeSelfWeight}
                  onChange={(e) =>
                    onChangeParams({ ...params, includeSelfWeight: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-[#16A34A]"
                />
              </label>
            </div>
          )}

          {/* TAB 2: GEOMETRY & SECTION */}
          {paramTab === 'geometry' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    {isTower ? 'Ancho base L (m)' : 'Longitud L (m)'}
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={60}
                    step={0.5}
                    value={params.lengthM}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        lengthM: Math.max(2, Math.min(60, Number(e.target.value) || 2)),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Altura H (m)
                  </label>
                  <input
                    type="number"
                    min={1.5}
                    max={40}
                    step={0.5}
                    value={params.heightM}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        heightM: Math.max(1.5, Math.min(40, Number(e.target.value) || 1.5)),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Área sección A (cm²)
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={1000}
                    step={2}
                    value={params.sectionAreaCm2}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        sectionAreaCm2: Math.max(4, Math.min(1000, Number(e.target.value) || 4)),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Inercia I (cm⁴)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={80000}
                    step={50}
                    value={params.momentOfInertiaCm4}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        momentOfInertiaCm4: Math.max(
                          100,
                          Math.min(80000, Number(e.target.value) || 100)
                        ),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    {isBuilding ? 'Niveles / Pisos' : isTower ? 'Cuerpos' : 'Tramos / Paneles'}
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={params.baysOrStories}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        baysOrStories: Math.max(
                          2,
                          Math.min(8, Math.round(Number(e.target.value) || 3))
                        ),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Factor pandeo K
                  </label>
                  <select
                    value={params.effectiveLengthK}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        effectiveLengthK: Number(e.target.value),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-medium text-slate-900 dark:text-white"
                  >
                    <option value={0.5}>K = 0.5 (Empotrado-Empotrado)</option>
                    <option value={0.7}>K = 0.7 (Empotrado-Articulado)</option>
                    <option value={1.0}>K = 1.0 (Articulado-Articulado)</option>
                    <option value={2.0}>K = 2.0 (Voladizo libre)</option>
                  </select>
                </div>
              </div>

              {isTruss && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Geometría Truss
                  </label>
                  <select
                    value={params.trussVariant}
                    onChange={(e) =>
                      onChangeParams({ ...params, trussVariant: e.target.value as TrussVariant })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-medium text-slate-900 dark:text-white"
                  >
                    <option value={TrussVariant.TRIANGULAR}>Triangular (Warren)</option>
                    <option value={TrussVariant.RECTANGULAR}>Rectangular (Pratt)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MATERIAL, SUPPORTS, THERMAL & CODE */}
          {paramTab === 'supports' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                  Material estructural
                </label>
                <select
                  value={params.material}
                  onChange={(e) => handleMaterialChange(e.target.value as MaterialType)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-medium text-slate-900 dark:text-white"
                >
                  {Object.values(MATERIALS).map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.label} · E={mat.elasticModulusGPa} GPa · σy={mat.yieldStrengthMPa} MPa
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                  Condición de apoyos
                </label>
                <select
                  value={params.supportCondition}
                  onChange={(e) =>
                    onChangeParams({
                      ...params,
                      supportCondition: e.target.value as SupportCondition,
                    })
                  }
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-medium text-slate-900 dark:text-white"
                >
                  <option value={SupportCondition.SIMPLE}>
                    Simplemente apoyado (Articulado + Rodillo)
                  </option>
                  <option value={SupportCondition.FIXED_BOTH}>
                    Doble empotramiento (A y B fijos)
                  </option>
                  {isTruss && (
                    <option value={SupportCondition.CANTILEVER}>
                      Voladizo / Cantilever (Empotrado en A)
                    </option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Mayoración γ_f
                  </label>
                  <input
                    type="number"
                    min={1.0}
                    max={2.0}
                    step={0.05}
                    value={params.loadFactorGamma}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        loadFactorGamma: Math.max(1.0, Math.min(2.0, Number(e.target.value) || 1.0)),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Variación ΔT (°C)
                  </label>
                  <input
                    type="number"
                    min={-30}
                    max={80}
                    step={1}
                    value={params.temperatureDeltaC}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        temperatureDeltaC: Math.max(-30, Math.min(80, Number(e.target.value) || 0)),
                      })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800/70 text-sm font-semibold font-mono-tabular text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600 dark:text-emerald-200/80">
                    Factor de seguridad requerido (FS_req)
                  </span>
                  <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white">
                    {params.requiredSafetyFactor.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1.1}
                  max={3.0}
                  step={0.05}
                  value={params.requiredSafetyFactor}
                  onChange={(e) =>
                    onChangeParams({
                      ...params,
                      requiredSafetyFactor: Number(e.target.value),
                    })
                  }
                  className="w-full accent-[#16A34A] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Always-Accessible Quick Applied Force Slider */}
          <div className="pt-1 border-t border-slate-100 dark:border-emerald-900/50">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-600 dark:text-emerald-200/80">
                Fuerza aplicada rápida F
              </span>
              <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white">
                {params.loadValue} {params.unit} ({params.forceAngleDeg}°)
              </span>
            </div>
            <input
              type="range"
              min={loadMin}
              max={loadMax}
              step={loadStep}
              value={Math.min(loadMax, params.loadValue)}
              onChange={(e) => onChangeParams({ ...params, loadValue: Number(e.target.value) })}
              className="w-full accent-[#16A34A] cursor-pointer"
            />
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onSimulatePulse}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{justSimulated ? 'Cálculos Actualizados' : 'Calcular y Simular'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onOpenResults}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-slate-100 dark:bg-emerald-950/70 hover:bg-slate-200 dark:hover:bg-emerald-900/70 text-slate-800 dark:text-emerald-100 font-medium text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Memoria Completa</span>
              </button>

              <button
                type="button"
                onClick={onSaveResult}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60 font-medium text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{justSaved ? 'Guardado' : 'Guardar'}</span>
              </button>
            </div>
          </div>

          <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold ${statusClasses}`}>
            <StatusIcon className="w-4 h-4 shrink-0" />
            <span>
              {result.statusLabel} · FS = {result.safetyFactor.toFixed(2)} (Req. ≥{' '}
              {params.requiredSafetyFactor.toFixed(2)})
            </span>
          </div>
        </section>

        {/* Right Column: Interactive Diagram + Numerical Calculations Grid */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* Interactive Structural Stage */}
          <section className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Vista de la estructura
                </h2>
                <p className="text-xs text-slate-500 dark:text-emerald-200/75">
                  {STRUCTURE_CATALOG.find((s) => s.id === params.structureType)?.name} ·{' '}
                  {params.lengthM} m × {params.heightM} m · Masa total:{' '}
                  {result.totalMassKg.toFixed(0)} kg · w ={' '}
                  {formatDistLoad(result.distributedTotalKN / params.lengthM, params.unit)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleDeflection}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    exaggerateDeflection
                      ? 'bg-emerald-50 dark:bg-emerald-900/60 border-emerald-500/50 text-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-[#081910] border-slate-200 dark:border-emerald-900/60 text-slate-600 dark:text-emerald-200/75'
                  }`}
                >
                  Deformación
                </button>
                <button
                  type="button"
                  onClick={onToggleStressColors}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    showStressColors
                      ? 'bg-emerald-50 dark:bg-emerald-900/60 border-emerald-500/50 text-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-[#081910] border-slate-200 dark:border-emerald-900/60 text-slate-600 dark:text-emerald-200/75'
                  }`}
                >
                  Mapa de Esfuerzos
                </button>
              </div>
            </div>

            <StructureDiagramSVG
              result={result}
              exaggerateDeflection={exaggerateDeflection}
              showStressColors={showStressColors}
            />
          </section>

          {/* Live Numerical Calculations Card */}
          <section className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Cálculos Numéricos en Tiempo Real
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenResults}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Ver memoria paso a paso →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 font-mono-tabular">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-200/70 dark:border-emerald-900/50">
                <span className="block text-[11px] font-sans text-slate-500 dark:text-emerald-200/70">
                  Componentes F (Fx / Fy)
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatForce(result.forceHorizontalKN, params.unit)} /{' '}
                  {formatForce(result.forceVerticalKN, params.unit)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-200/70 dark:border-emerald-900/50">
                <span className="block text-[11px] font-sans text-slate-500 dark:text-emerald-200/70">
                  Peso Masa Adic. (W_adic)
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatForce(result.additionalWeightKN, params.unit)} ({params.additionalMassKg} kg)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-200/70 dark:border-emerald-900/50">
                <span className="block text-[11px] font-sans text-slate-500 dark:text-emerald-200/70">
                  Carga Diseño (γ_f · ΣFy)
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatForce(result.factoredVerticalLoadKN, params.unit)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-200/70 dark:border-emerald-900/50">
                <span className="block text-[11px] font-sans text-slate-500 dark:text-emerald-200/70">
                  Reacciones (RAy / RBy)
                </span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {formatForce(result.reactionAKN, params.unit)} /{' '}
                  {formatForce(result.reactionBKN, params.unit)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-200/70 dark:border-emerald-900/50">
                <span className="block text-[11px] font-sans text-slate-500 dark:text-emerald-200/70">
                  Cortante / Momento Máx.
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatForce(result.maxShearKN, params.unit)} ·{' '}
                  {formatTorque(result.maxMomentKNm, params.unit)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-200/70 dark:border-emerald-900/50">
                <span className="block text-[11px] font-sans text-slate-500 dark:text-emerald-200/70">
                  Esfuerzo Máx. (σ_máx)
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {result.maxStressMPa.toFixed(2)} MPa
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-200/70 dark:border-emerald-900/50">
                <span className="block text-[11px] font-sans text-slate-500 dark:text-emerald-200/70">
                  Pandeo Crítico (P_cr)
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatForce(result.eulerCriticalLoadKN, params.unit)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-200/70 dark:border-emerald-900/50">
                <span className="block text-[11px] font-sans text-slate-500 dark:text-emerald-200/70">
                  Deflexión / Dilat. Térmica
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {result.maxDeflectionMm.toFixed(2)} mm · ΔL {result.thermalElongationMm.toFixed(2)} mm
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
