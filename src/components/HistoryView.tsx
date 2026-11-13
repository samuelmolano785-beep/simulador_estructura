import React, { useMemo, useState } from 'react';
import {
  Search,
  Eye,
  Trash2,
  Play,
  CheckCircle2,
  AlertTriangle,
  XOctagon,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import {
  HistoryEntry,
  StabilityStatus,
  StructureType,
} from '../types/simulation';
import { formatForce, MATERIALS } from '../lib/physics';

interface HistoryViewProps {
  history: HistoryEntry[];
  onLoadSimulation: (entry: HistoryEntry, target: 'simulator' | 'results') => void;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
}

type FilterCategory = 'all' | 'bridges' | 'tower' | 'building';

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onLoadSimulation,
  onDeleteEntry,
  onClearAll,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history.filter((entry) => {
      if (filter === 'bridges') {
        if (
          entry.params.structureType !== StructureType.TRUSS &&
          entry.params.structureType !== StructureType.SUSPENSION
        ) {
          return false;
        }
      } else if (filter === 'tower') {
        if (entry.params.structureType !== StructureType.TOWER) return false;
      } else if (filter === 'building') {
        if (entry.params.structureType !== StructureType.BUILDING) return false;
      }

      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.displayDate.toLowerCase().includes(q) ||
        entry.resultSummary.statusLabel.toLowerCase().includes(q) ||
        MATERIALS[entry.params.material].label.toLowerCase().includes(q)
      );
    });
  }, [history, query, filter]);

  const renderStatus = (status: StabilityStatus, label: string) => {
    const Icon =
      status === StabilityStatus.STABLE
        ? CheckCircle2
        : status === StabilityStatus.WARNING
          ? AlertTriangle
          : XOctagon;
    const color =
      status === StabilityStatus.STABLE
        ? 'text-emerald-700 dark:text-emerald-400'
        : status === StabilityStatus.WARNING
          ? 'text-amber-700 dark:text-amber-400'
          : 'text-red-700 dark:text-red-400';

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Historial de Simulaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-200/75 mt-0.5">
            Consulta, recarga o compara tus análisis estructurales guardados
          </p>
        </div>

        {history.length > 0 && (
          <div>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold cursor-pointer"
                >
                  Confirmar borrado
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-emerald-900 text-slate-800 dark:text-emerald-100 text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-white dark:bg-[#0D2318] text-slate-600 dark:text-emerald-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpiar historial</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-900/60 overflow-x-auto">
          {(
            [
              { id: 'all', label: 'Todas' },
              { id: 'bridges', label: 'Puentes' },
              { id: 'tower', label: 'Torres' },
              { id: 'building', label: 'Edificios' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === f.id
                  ? 'bg-[#115E34] text-white'
                  : 'text-slate-600 dark:text-emerald-200/80 hover:bg-slate-100 dark:hover:bg-emerald-900/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar simulación..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-900/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-900/50 p-10 text-center">
          <FolderOpen className="w-10 h-10 text-slate-400 dark:text-emerald-500/60 mx-auto mb-3" />
          <p className="font-display font-semibold text-slate-800 dark:text-white">
            No hay simulaciones que coincidan
          </p>
          <p className="text-sm text-slate-500 dark:text-emerald-200/70 mt-1">
            Ejecuta un análisis en el simulador y presiona Guardar para verlo aquí.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card List (< md) */}
          <div className="space-y-3 md:hidden">
            {filtered.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-slate-900 dark:text-white truncate">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-emerald-200/75 mt-0.5 font-mono-tabular">
                      {entry.params.lengthM} m · {formatForce(entry.params.loadValue / (entry.params.unit === 'N' ? 1000 : 1), entry.params.unit)} · {entry.displayDate}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    aria-label="Eliminar simulación"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-emerald-900/40">
                  {renderStatus(entry.resultSummary.status, entry.resultSummary.statusLabel)}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onLoadSimulation(entry, 'simulator')}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-emerald-950/70 text-slate-800 dark:text-emerald-100 text-xs font-medium"
                    >
                      Simular
                    </button>
                    <button
                      type="button"
                      onClick={() => onLoadSimulation(entry, 'results')}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#115E34] text-white text-xs font-medium inline-flex items-center gap-1"
                    >
                      <span>Ver</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop Data Table (>= md) */}
          <div className="hidden md:block rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-emerald-900/60 bg-slate-50/70 dark:bg-[#081910] text-xs font-semibold text-slate-600 dark:text-emerald-200/80">
                    <th className="py-3.5 px-5">Fecha</th>
                    <th className="py-3.5 px-4">Estructura</th>
                    <th className="py-3.5 px-4">Dimensiones / Material</th>
                    <th className="py-3.5 px-4">Carga</th>
                    <th className="py-3.5 px-4">Resultado</th>
                    <th className="py-3.5 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-emerald-900/40">
                  {filtered.map((entry) => {
                    const loadKN =
                      entry.params.unit === 'N'
                        ? entry.params.loadValue / 1000
                        : entry.params.loadValue;
                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-emerald-950/35 transition-colors"
                      >
                        <td className="py-3.5 px-5 text-xs text-slate-500 dark:text-emerald-200/75 font-mono-tabular whitespace-nowrap">
                          {entry.displayDate}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          {entry.title}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-emerald-200/80">
                          {entry.params.lengthM} m × {entry.params.heightM} m ·{' '}
                          {MATERIALS[entry.params.material].label.split(' ')[0]}
                        </td>
                        <td className="py-3.5 px-4 font-mono-tabular font-medium text-slate-800 dark:text-white whitespace-nowrap">
                          {formatForce(loadKN, entry.params.unit)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {renderStatus(entry.resultSummary.status, entry.resultSummary.statusLabel)}
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onLoadSimulation(entry, 'simulator')}
                              title="Cargar en simulador"
                              className="min-w-[36px] min-h-[36px] px-2.5 rounded-lg text-slate-600 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900/60 inline-flex items-center gap-1 text-xs font-medium cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Simular</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onLoadSimulation(entry, 'results')}
                              title="Ver resultados"
                              className="min-w-[36px] min-h-[36px] px-2.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/60 inline-flex items-center gap-1 text-xs font-medium cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ver</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteEntry(entry.id)}
                              title="Eliminar"
                              aria-label="Eliminar registro"
                              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
