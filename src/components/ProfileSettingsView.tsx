import React, { useState } from 'react';
import {
  User,
  Lock,
  Settings,
  LogOut,
  CheckCircle2,
  Sun,
  Moon,
  Award,
  Layers,
  Calendar,
  ChevronRight,
  Pencil,
} from 'lucide-react';
import {
  AppSettings,
  ForceUnit,
  HistoryEntry,
  StabilityStatus,
  UserProfile,
} from '../types/simulation';
import { updateUserPassword } from '../lib/store';

interface ProfileSettingsViewProps {
  section: 'profile' | 'settings';
  user: UserProfile;
  history: HistoryEntry[];
  settings: AppSettings;
  onUpdateProfile: (next: UserProfile) => void;
  onUpdateSettings: (next: AppSettings) => void;
  onNavigateSection: (section: 'profile' | 'settings') => void;
  onLogout: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  section,
  user,
  history,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onNavigateSection,
  onLogout,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(user.name);
  const [draftEmail, setDraftEmail] = useState(user.email);
  const [draftProgram, setDraftProgram] = useState(user.program);
  const [draftUniversity, setDraftUniversity] = useState(user.university);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const totalSimulations = history.length;
  const stableCount = history.filter(
    (h) => h.resultSummary.status === StabilityStatus.STABLE
  ).length;
  const successRate =
    totalSimulations > 0 ? Math.round((stableCount / totalSimulations) * 100) : 100;
  const latestDate = history.length > 0 ? history[0].displayDate.split(' · ')[0] : 'Hoy';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name: draftName.trim() || user.name,
      email: draftEmail.trim() || user.email,
      program: draftProgram.trim() || user.program,
      university: draftUniversity.trim() || user.university,
    });
    setIsEditingProfile(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateUserPassword(user.id, currentPwd, newPwd);
    if (res.ok) {
      setPwdFeedback({ ok: true, msg: 'Contraseña actualizada correctamente.' });
      setCurrentPwd('');
      setNewPwd('');
    } else {
      setPwdFeedback({ ok: false, msg: res.error ?? 'Error al actualizar contraseña.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs between Profile & Settings */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {section === 'profile' ? 'Mi Perfil' : 'Ajustes del Simulador'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-200/75 mt-0.5">
            {section === 'profile'
              ? 'Información académica, credenciales y estadísticas de simulación'
              : 'Apariencia, unidades predeterminadas y opciones del diagrama'}
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-900/60">
          <button
            type="button"
            onClick={() => onNavigateSection('profile')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer ${
              section === 'profile'
                ? 'bg-[#115E34] text-white'
                : 'text-slate-600 dark:text-emerald-200/80'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Perfil</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('settings')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer ${
              section === 'settings'
                ? 'bg-[#115E34] text-white'
                : 'text-slate-600 dark:text-emerald-200/80'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Ajustes</span>
          </button>
        </div>
      </div>

      {section === 'profile' ? (
        <div className="space-y-5">
          {/* Profile Identity Card */}
          <section className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#115E34] text-white font-display text-xl sm:text-2xl font-bold flex items-center justify-center shrink-0">
                  {user.initials}
                </div>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-emerald-200/80">
                    {user.email} · {user.role}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1 font-mono-tabular">
                    ID: {user.studentCode}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDraftName(user.name);
                  setDraftEmail(user.email);
                  setDraftProgram(user.program);
                  setDraftUniversity(user.university);
                  setIsEditingProfile((prev) => !prev);
                }}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#115E34] hover:bg-[#0D4A29] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer self-start md:self-center"
              >
                <Pencil className="w-4 h-4" />
                <span>{isEditingProfile ? 'Cancelar Edición' : 'Editar Perfil'}</span>
              </button>
            </div>

            {profileSavedToast && (
              <div className="mt-4 px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Perfil actualizado correctamente.</span>
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="mt-6 pt-5 border-t border-slate-200 dark:border-emerald-900/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={draftEmail}
                    onChange={(e) => setDraftEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Programa académico
                  </label>
                  <input
                    type="text"
                    value={draftProgram}
                    onChange={(e) => setDraftProgram(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-emerald-200/80 mb-1">
                    Universidad / Institución
                  </label>
                  <input
                    type="text"
                    value={draftUniversity}
                    onChange={(e) => setDraftUniversity(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800 text-sm"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="min-h-[42px] px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <dl className="mt-6 pt-5 border-t border-slate-200 dark:border-emerald-900/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-500 dark:text-emerald-200/70">Programa</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {user.program}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-emerald-200/70">Universidad</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {user.university}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-emerald-200/70">Nivel</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    Avanzado
                  </dd>
                </div>
              </dl>
            )}
          </section>

          {/* Personal Statistics */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {totalSimulations}
                </p>
                <p className="text-xs text-slate-500 dark:text-emerald-200/75">Simulaciones</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {successRate}%
                </p>
                <p className="text-xs text-slate-500 dark:text-emerald-200/75">Estabilidad / Éxito</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 p-4 sm:p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-900 dark:text-white font-mono-tabular">
                  {latestDate}
                </p>
                <p className="text-xs text-slate-500 dark:text-emerald-200/75">Última actividad</p>
              </div>
            </div>
          </section>

          {/* Account Actions (Change Password, Settings, Sign Out) */}
          <section className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 divide-y divide-slate-100 dark:divide-emerald-900/50 overflow-hidden">
            <div>
              <button
                type="button"
                onClick={() => {
                  setPwdFeedback(null);
                  setShowPasswordForm((prev) => !prev);
                }}
                className="w-full min-h-[56px] px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-white">
                  <Lock className="w-4 h-4 text-slate-500 dark:text-emerald-300" />
                  Cambiar Contraseña
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {showPasswordForm && (
                <form
                  onSubmit={handleChangePassword}
                  className="px-5 pb-5 pt-2 bg-slate-50/70 dark:bg-[#081910] space-y-3"
                >
                  {pwdFeedback && (
                    <p
                      className={`text-xs font-medium ${
                        pwdFeedback.ok
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {pwdFeedback.msg}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="password"
                      required
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      placeholder="Contraseña actual"
                      className="h-11 px-3.5 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-300 dark:border-emerald-800 text-sm"
                    />
                    <input
                      type="password"
                      required
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      placeholder="Nueva contraseña (mín. 4 caracteres)"
                      className="h-11 px-3.5 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-300 dark:border-emerald-800 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[#115E34] text-white text-xs font-semibold cursor-pointer"
                  >
                    Actualizar Contraseña
                  </button>
                </form>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigateSection('settings')}
              className="w-full min-h-[56px] px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-white">
                <Settings className="w-4 h-4 text-slate-500 dark:text-emerald-300" />
                Configuración de Simulación y Tema
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full min-h-[56px] px-5 py-3.5 flex items-center justify-between text-left hover:bg-red-50/70 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-3 text-sm font-medium text-red-700 dark:text-red-400">
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </span>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </button>
          </section>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200/80 dark:border-emerald-900/50 divide-y divide-slate-100 dark:divide-emerald-900/50">
          {/* Theme Switch */}
          <div className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-semibold text-slate-900 dark:text-white">
                Tema de la interfaz
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-200/75 mt-0.5">
                Cambia entre modo claro de alta legibilidad o modo oscuro nocturno
              </p>
            </div>
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#081910] border border-slate-200 dark:border-emerald-900/60">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-emerald-200/75'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Claro</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-[#115E34] text-white shadow-xs'
                    : 'text-slate-600 dark:text-emerald-200/75'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Oscuro</span>
              </button>
            </div>
          </div>

          {/* Default Force Unit */}
          <div className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-semibold text-slate-900 dark:text-white">
                Unidad de fuerza predeterminada
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-200/75 mt-0.5">
                Elige Kilonewtons (kN) para ingeniería civil o Newtons (N) para modelos a escala
              </p>
            </div>
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#081910] border border-slate-200 dark:border-emerald-900/60">
              {[ForceUnit.KN, ForceUnit.N].map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, defaultUnit: unit })}
                  className={`min-h-[38px] px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    settings.defaultUnit === unit
                      ? 'bg-[#115E34] text-white shadow-xs'
                      : 'text-slate-600 dark:text-emerald-200/75'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* Blueprint Visualization Toggles */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-semibold text-slate-900 dark:text-white">
                Visualizar deformación elástica
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-200/75 mt-0.5">
                Muestra la geometría original punteada junto con la deflexión amplificada
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.exaggerateDeflection}
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  exaggerateDeflection: !settings.exaggerateDeflection,
                })
              }
              className={`w-12 h-7 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                settings.exaggerateDeflection ? 'bg-[#16A34A]' : 'bg-slate-300 dark:bg-emerald-950'
              }`}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white shadow-xs transition-transform ${
                  settings.exaggerateDeflection ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-semibold text-slate-900 dark:text-white">
                Colores de esfuerzo axial
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-200/75 mt-0.5">
                Resalta barras en tensión (azul), compresión (ámbar) y sobrecarga (rojo)
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showStressColors}
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  showStressColors: !settings.showStressColors,
                })
              }
              className={`w-12 h-7 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                settings.showStressColors ? 'bg-[#16A34A]' : 'bg-slate-300 dark:bg-emerald-950'
              }`}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white shadow-xs transition-transform ${
                  settings.showStressColors ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
