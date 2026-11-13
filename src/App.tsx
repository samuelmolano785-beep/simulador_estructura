import { useEffect, useMemo, useState } from 'react';
import {
  Home,
  Compass,
  BarChart3,
  History,
  User,
  Settings,
  LogOut,
  Play,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import {
  AppSettings,
  AppView,
  ForceUnit,
  HistoryEntry,
  SimulationParams,
  StructureType,
  UserProfile,
} from './types/simulation';
import {
  normalizeParams,
  runStructuralSimulation,
  STRUCTURE_CATALOG,
} from './lib/physics';
import {
  createHistoryEntry,
  loadHistory,
  loadSessionUser,
  loadSettings,
  saveHistory,
  saveSessionUser,
  saveSettings,
  updateUserProfile,
} from './lib/store';
import { BrandLogo } from './components/BrandLogo';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { SimulatorView } from './components/SimulatorView';
import { ResultsView } from './components/ResultsView';
import { HistoryView } from './components/HistoryView';
import { ProfileSettingsView } from './components/ProfileSettingsView';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => loadSessionUser());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [activeView, setActiveView] = useState<AppView>('home');

  const [params, setParams] = useState<SimulationParams>(() => {
    const base = STRUCTURE_CATALOG[0].defaultParams;
    const initialUnit = loadSettings().defaultUnit;
    return {
      ...base,
      unit: initialUnit,
      loadValue: initialUnit === ForceUnit.N ? 1000 : base.loadValue,
      distributedLoadValue:
        initialUnit === ForceUnit.N ? base.distributedLoadValue * 1000 : base.distributedLoadValue,
      windLoadValue: initialUnit === ForceUnit.N ? base.windLoadValue * 1000 : base.windLoadValue,
    };
  });

  const [justSimulated, setJustSimulated] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Sync Tailwind dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const simulationResult = useMemo(() => runStructuralSimulation(params), [params]);

  const handleLoginSuccess = (loggedUser: UserProfile, remember: boolean) => {
    setUser(loggedUser);
    if (remember) {
      saveSessionUser(loggedUser);
    }
    setActiveView('home');
  };

  const handleLogout = () => {
    saveSessionUser(null);
    setUser(null);
  };

  const handleUpdateSettings = (next: AppSettings) => {
    setSettings(next);
    saveSettings(next);
  };

  const handleUpdateProfile = (next: UserProfile) => {
    const saved = updateUserProfile(next);
    setUser(saved);
  };

  const handleSelectStructure = (type: StructureType) => {
    const preset = STRUCTURE_CATALOG.find((s) => s.id === type);
    if (preset) {
      const unit = settings.defaultUnit;
      setParams({
        ...preset.defaultParams,
        unit,
        loadValue:
          unit === ForceUnit.N
            ? preset.defaultParams.loadValue * 1000
            : preset.defaultParams.loadValue,
        distributedLoadValue:
          unit === ForceUnit.N
            ? preset.defaultParams.distributedLoadValue * 1000
            : preset.defaultParams.distributedLoadValue,
        windLoadValue:
          unit === ForceUnit.N
            ? preset.defaultParams.windLoadValue * 1000
            : preset.defaultParams.windLoadValue,
      });
    }
    setActiveView('simulator');
  };

  const handleSimulatePulse = () => {
    setJustSimulated(true);
    setTimeout(() => setJustSimulated(false), 1400);
  };

  const handleSaveResult = () => {
    const entry = createHistoryEntry(simulationResult);
    const nextHistory = [entry, ...history];
    setHistory(nextHistory);
    saveHistory(nextHistory);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleLoadHistoryEntry = (entry: HistoryEntry, target: 'simulator' | 'results') => {
    setParams(normalizeParams(entry.params));
    setActiveView(target);
  };

  const handleDeleteHistoryEntry = (id: string) => {
    const next = history.filter((item) => item.id !== id);
    setHistory(next);
    saveHistory(next);
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  if (!user) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const structureName =
    STRUCTURE_CATALOG.find((s) => s.id === params.structureType)?.name ?? 'Estructura';

  const headerTitle =
    activeView === 'home'
      ? 'Inicio'
      : activeView === 'simulator'
        ? `Simulador · ${structureName}`
        : activeView === 'results'
          ? 'Resultados de Simulación'
          : activeView === 'history'
            ? 'Historial de Simulaciones'
            : activeView === 'profile'
              ? 'Mi Perfil'
              : 'Ajustes';

  const desktopNavItems: Array<{ id: AppView; label: string; icon: typeof Home }> = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'simulator', label: 'Simulador', icon: Compass },
    { id: 'results', label: 'Resultados', icon: BarChart3 },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#F3F6F4] dark:bg-[#07140D] text-slate-900 dark:text-slate-100">
      {/* Desktop Left Sidebar (>= lg) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-gradient-to-b from-[#0A2718] via-[#0B2D1B] to-[#071B10] text-white border-r border-emerald-900/40 z-30">
        <div className="h-16 px-5 flex items-center gap-3 border-b border-emerald-800/40">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-300 shrink-0">
            <BrandLogo className="w-7 h-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight whitespace-nowrap">
            StructuSim
          </span>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'text-emerald-100/80 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-emerald-800/40">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Bar (Compact 56px Mobile / 64px Desktop) */}
        <header className="sticky top-0 z-20 h-14 lg:h-16 bg-white/90 dark:bg-[#0A1E14]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-emerald-900/50 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {activeView !== 'home' ? (
              <button
                type="button"
                onClick={() => setActiveView('home')}
                aria-label="Volver al inicio"
                className="lg:hidden min-w-[40px] min-h-[40px] -ml-1.5 flex items-center justify-center rounded-xl text-slate-700 dark:text-emerald-100 hover:bg-slate-100 dark:hover:bg-emerald-900/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="lg:hidden w-8 h-8 rounded-lg bg-[#115E34] text-white flex items-center justify-center shrink-0">
                <BrandLogo className="w-6 h-4" />
              </div>
            )}

            <span className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate">
              {headerTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                handleUpdateSettings({
                  ...settings,
                  theme: settings.theme === 'dark' ? 'light' : 'dark',
                })
              }
              aria-label={settings.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-emerald-800/60 text-slate-600 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView('profile')}
              className="min-h-[40px] pl-1.5 pr-3 py-1 rounded-full bg-slate-100 dark:bg-emerald-950/70 hover:bg-slate-200 dark:hover:bg-emerald-900/70 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-[#115E34] text-white text-xs font-bold flex items-center justify-center">
                {user.initials}
              </span>
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-slate-800 dark:text-white whitespace-nowrap">
                {user.name}
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable Workspace Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 lg:pb-10">
          {activeView === 'home' && (
            <HomeView
              user={user}
              history={history}
              onSelectStructure={handleSelectStructure}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'simulator' && (
            <SimulatorView
              params={params}
              result={simulationResult}
              exaggerateDeflection={settings.exaggerateDeflection}
              showStressColors={settings.showStressColors}
              onToggleDeflection={() =>
                handleUpdateSettings({
                  ...settings,
                  exaggerateDeflection: !settings.exaggerateDeflection,
                })
              }
              onToggleStressColors={() =>
                handleUpdateSettings({
                  ...settings,
                  showStressColors: !settings.showStressColors,
                })
              }
              onChangeParams={setParams}
              onSimulatePulse={handleSimulatePulse}
              onSaveResult={handleSaveResult}
              onOpenResults={() => setActiveView('results')}
              justSimulated={justSimulated}
              justSaved={justSaved}
            />
          )}

          {activeView === 'results' && (
            <ResultsView
              result={simulationResult}
              darkTheme={settings.theme === 'dark'}
              onSaveResult={handleSaveResult}
              onBackToSimulator={() => setActiveView('simulator')}
              justSaved={justSaved}
            />
          )}

          {activeView === 'history' && (
            <HistoryView
              history={history}
              onLoadSimulation={handleLoadHistoryEntry}
              onDeleteEntry={handleDeleteHistoryEntry}
              onClearAll={handleClearHistory}
            />
          )}

          {(activeView === 'profile' || activeView === 'settings') && (
            <ProfileSettingsView
              section={activeView}
              user={user}
              history={history}
              settings={settings}
              onUpdateProfile={handleUpdateProfile}
              onUpdateSettings={handleUpdateSettings}
              onNavigateSection={(sec) => setActiveView(sec)}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Quiet Desktop Footer */}
        <footer className="hidden lg:flex items-center justify-between px-8 py-4 text-xs text-slate-500 dark:text-emerald-200/60 border-t border-slate-200/70 dark:border-emerald-900/40 max-w-7xl w-full mx-auto">
          <span>2026 StructuSim · Simulador de Estructuras y Estabilidad</span>
          <span>Universidad Autónoma del Cauca · Ingeniería Estructural</span>
        </footer>
      </div>

      {/* Mobile Fixed Bottom Thumb-Zone Navigation (< lg) */}
      <nav
        aria-label="Navegación móvil"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-[#0A1E14]/95 backdrop-blur-md border-t border-slate-200 dark:border-emerald-900/60 px-2 grid grid-cols-5 items-center"
      >
        <button
          type="button"
          onClick={() => setActiveView('home')}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
            activeView === 'home'
              ? 'text-[#16A34A] dark:text-emerald-400'
              : 'text-slate-500 dark:text-emerald-200/70'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Inicio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('history')}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
            activeView === 'history'
              ? 'text-[#16A34A] dark:text-emerald-400'
              : 'text-slate-500 dark:text-emerald-200/70'
          }`}
        >
          <History className="w-5 h-5" />
          <span>Historial</span>
        </button>

        {/* Prominent Center Simulate CTA */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => setActiveView('simulator')}
            aria-label="Abrir simulador"
            className={`w-12 h-12 -mt-4 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              activeView === 'simulator' || activeView === 'results'
                ? 'bg-[#16A34A] text-white ring-4 ring-emerald-500/25'
                : 'bg-[#115E34] text-white'
            }`}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('profile')}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
            activeView === 'profile'
              ? 'text-[#16A34A] dark:text-emerald-400'
              : 'text-slate-500 dark:text-emerald-200/70'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('settings')}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
            activeView === 'settings'
              ? 'text-[#16A34A] dark:text-emerald-400'
              : 'text-slate-500 dark:text-emerald-200/70'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
