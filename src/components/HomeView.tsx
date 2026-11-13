import React from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { APP_IMAGES } from '../lib/assets';
import { STRUCTURE_CATALOG } from '../lib/physics';
import {
  AppView,
  HistoryEntry,
  StabilityStatus,
  StructureType,
  UserProfile,
} from '../types/simulation';

interface HomeViewProps {
  user: UserProfile;
  history: HistoryEntry[];
  onSelectStructure: (type: StructureType) => void;
  onNavigate: (view: AppView) => void;
}

const STRUCTURE_MEDIA: Record<
  StructureType,
  { img: string; alt: string; gradientFallback: string }
> = {
  [StructureType.TRUSS]: {
    img: APP_IMAGES.trussBridge,
    alt: 'Puente de celosía metálica tipo Warren',
    gradientFallback: 'from-emerald-900 to-slate-800',
  },
  [StructureType.SUSPENSION]: {
    img: APP_IMAGES.suspensionBridge,
    alt: 'Puente colgante con torres y cables principales',
    gradientFallback: 'from-sky-900 to-emerald-900',
  },
  [StructureType.TOWER]: {
    img: APP_IMAGES.electricTower,
    alt: 'Torre eléctrica reticulada de acero galvanizado',
    gradientFallback: 'from-slate-800 to-emerald-950',
  },
  [StructureType.BUILDING]: {
    img: APP_IMAGES.buildingFrame,
    alt: 'Estructura porticada de edificio en concreto y acero',
    gradientFallback: 'from-stone-800 to-emerald-950',
  },
};

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  history,
  onSelectStructure,
  onNavigate,
}) => {
  const firstName = user.name.split(' ')[0] || 'Ingeniero';
  const totalSimulations = history.length;
  const successfulCount = history.filter(
    (h) => h.resultSummary.status === StabilityStatus.STABLE
  ).length;
  const successRate =
    totalSimulations > 0 ? Math.round((successfulCount / totalSimulations) * 100) : 100;
  const latestLabel = history.length > 0 ? history[0].title.split(' · ')[0] : 'Hoy';

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-[#0A2618] text-white shadow-sm">
        <img
          src={APP_IMAGES.heroBridge}
          alt="Puente atirantado arquitectónico"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071D12]/95 via-[#092919]/80 to-[#0D3B23]/45" />

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white text-balance">
              ¡Bienvenido, {firstName}!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-lg">
              Analiza, calcula y mejora el equilibrio de tus estructuras con simulación matricial de fuerzas, esfuerzos y deformaciones.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('simulator')}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              >
                <span>Comenzar Simulación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('results')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Ver Últimos Resultados
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Metrics Row */}
      <section aria-label="Resumen de actividad" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-emerald-200/70 truncate">Simulaciones</p>
            <p className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {totalSimulations}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-emerald-200/70 truncate">Análisis Exitosos</p>
            <p className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {successRate}%
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-emerald-200/70 truncate">Última Simulación</p>
            <p className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {latestLabel}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-emerald-200/70 truncate">Precisión FEM</p>
            <p className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              100%
            </p>
          </div>
        </div>
      </section>

      {/* Structure Selection Grid */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Selecciona una estructura
            </h2>
            <p className="text-sm text-slate-600 dark:text-emerald-200/75 mt-0.5">
              Elige un modelo base para configurar cargas, dimensiones y materiales
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {STRUCTURE_CATALOG.map((item) => {
            const media = STRUCTURE_MEDIA[item.id];
            return (
              <article
                key={item.id}
                className="group rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 overflow-hidden flex flex-col justify-between transition-all hover:border-emerald-600/50 hover:shadow-md"
              >
                <div>
                  <div className={`relative h-40 sm:h-44 overflow-hidden bg-gradient-to-br ${media.gradientFallback}`}>
                    <img
                      src={media.img}
                      alt={media.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-emerald-200/75 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <button
                    type="button"
                    onClick={() => onSelectStructure(item.id)}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#115E34] hover:bg-[#0D4A29] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Seleccionar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Engineering Capabilities Showcase Banner (mirrors desktop showcase card) */}
      <section className="relative rounded-2xl overflow-hidden bg-[#0A2618] text-white">
        <img
          src={APP_IMAGES.heroBridge}
          alt="Infraestructura de ingeniería civil"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071D12]/95 via-[#092919]/90 to-[#0B301E]/85" />

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
              Ingeniería en tus manos
            </h2>
            <p className="mt-2 text-sm sm:text-base text-emerald-100/85 max-w-lg">
              Aprende, experimenta y evalúa el comportamiento estructural antes de construir. Compatible con pantalla táctil y escritorio.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('simulator')}
              className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explorar Simulador</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {[
              { icon: Cpu, label: 'Simulador Interactivo 2D' },
              { icon: Zap, label: 'Cálculos Matriciales en Tiempo Real' },
              { icon: BarChart3, label: 'Diagramas de Esfuerzo y Deformación' },
              { icon: ShieldCheck, label: 'Validación de Factor de Seguridad' },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.label}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs"
                >
                  <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span className="text-sm font-medium text-white">{feat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
