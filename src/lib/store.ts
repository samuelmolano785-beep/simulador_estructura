import {
  AppSettings,
  ForceUnit,
  HistoryEntry,
  MaterialType,
  SimulationParams,
  SimulationResult,
  StructureType,
  TrussVariant,
  UserProfile,
} from '../types/simulation';
import {
  formatDistLoad,
  formatForce,
  formatTorque,
  normalizeParams,
  runStructuralSimulation,
  STRUCTURE_CATALOG,
} from './physics';

const STORAGE_KEYS = {
  SESSION: 'structusim_session_v1',
  USERS: 'structusim_users_v1',
  HISTORY: 'structusim_history_v1',
  SETTINGS: 'structusim_settings_v1',
};

export interface StoredAccount {
  profile: UserProfile;
  password: string;
}

export const DEFAULT_USER: UserProfile = {
  id: 'usr-andres-01',
  studentCode: '785111205',
  name: 'Andrés Cando',
  email: 'candojaiver@gmail.com',
  role: 'Estudiante',
  program: 'Ingeniería de Software',
  university: 'U. Autónoma del Cauca',
  initials: 'AN',
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  defaultUnit: ForceUnit.KN,
  exaggerateDeflection: true,
  showStressColors: true,
};

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'US';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function createInitialHistory(): HistoryEntry[] {
  const seeds: Array<{ id: string; title: string; dateISO: string; displayDate: string; params: Partial<SimulationParams> }> = [
    {
      id: 'sim-seed-1',
      title: 'Puente Truss',
      dateISO: '2026-11-10T14:30:00',
      displayDate: '10/11/2026 · 14:30',
      params: {
        structureType: StructureType.TRUSS,
        trussVariant: TrussVariant.TRIANGULAR,
        lengthM: 10,
        heightM: 3,
        loadValue: 50,
        unit: ForceUnit.KN,
        loadPositionPct: 50,
        material: MaterialType.STEEL,
        baysOrStories: 4,
      },
    },
    {
      id: 'sim-seed-2',
      title: 'Torre Eléctrica',
      dateISO: '2026-11-09T17:20:00',
      displayDate: '09/11/2026 · 17:20',
      params: {
        structureType: StructureType.TOWER,
        trussVariant: TrussVariant.TRIANGULAR,
        lengthM: 6,
        heightM: 14,
        loadValue: 30,
        unit: ForceUnit.KN,
        loadPositionPct: 55,
        material: MaterialType.STEEL,
        baysOrStories: 4,
      },
    },
    {
      id: 'sim-seed-3',
      title: 'Puente Colgante',
      dateISO: '2026-11-08T11:15:00',
      displayDate: '08/11/2026 · 11:15',
      params: {
        structureType: StructureType.SUSPENSION,
        trussVariant: TrussVariant.TRIANGULAR,
        lengthM: 24,
        heightM: 7,
        loadValue: 80,
        unit: ForceUnit.KN,
        loadPositionPct: 50,
        material: MaterialType.STEEL,
        baysOrStories: 6,
      },
    },
    {
      id: 'sim-seed-4',
      title: 'Estructura Edificio',
      dateISO: '2026-11-06T09:40:00',
      displayDate: '06/11/2026 · 09:40',
      params: {
        structureType: StructureType.BUILDING,
        trussVariant: TrussVariant.RECTANGULAR,
        lengthM: 12,
        heightM: 10,
        loadValue: 100,
        unit: ForceUnit.KN,
        loadPositionPct: 50,
        material: MaterialType.CONCRETE,
        baysOrStories: 3,
      },
    },
  ];

  return seeds.map((s) => {
    const normalized = normalizeParams(s.params);
    const res = runStructuralSimulation(normalized);
    return {
      id: s.id,
      title: s.title,
      dateISO: s.dateISO,
      displayDate: s.displayDate,
      params: normalized,
      resultSummary: {
        reactionAKN: res.reactionAKN,
        reactionBKN: res.reactionBKN,
        maxStressMPa: res.maxStressMPa,
        maxDeflectionMm: res.maxDeflectionMm,
        safetyFactor: res.safetyFactor,
        status: res.status,
        statusLabel: res.statusLabel,
      },
    };
  });
}

export function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredAccount[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  const initial: StoredAccount[] = [{ profile: DEFAULT_USER, password: 'demo1234' }];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
  return initial;
}

export function saveAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(accounts));
}

export function loadSessionUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveSessionUser(user: UserProfile | null): void {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return;
  }
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
}

export function authenticateUser(emailOrName: string, password: string): { user?: UserProfile; error?: string } {
  const accounts = loadAccounts();
  const q = emailOrName.trim().toLowerCase();
  if (!q || !password.trim()) {
    return { error: 'Ingresa tu correo o usuario y tu contraseña.' };
  }
  const found = accounts.find(
    (a) => a.profile.email.toLowerCase() === q || a.profile.name.toLowerCase() === q
  );
  if (!found) {
    return { error: 'Usuario no encontrado. Regístrate o usa la cuenta demo.' };
  }
  if (found.password !== password) {
    return { error: 'Contraseña incorrecta. Verifica tus datos.' };
  }
  return { user: found.profile };
}

export function registerUser(name: string, email: string, password: string): { user?: UserProfile; error?: string } {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanName || !cleanEmail || password.length < 4) {
    return { error: 'Completa nombre, correo válido y una contraseña de al menos 4 caracteres.' };
  }
  const accounts = loadAccounts();
  if (accounts.some((a) => a.profile.email.toLowerCase() === cleanEmail)) {
    return { error: 'Ya existe una cuenta registrada con ese correo.' };
  }
  const newProfile: UserProfile = {
    id: `usr-${Date.now()}`,
    studentCode: String(Math.floor(700000000 + Math.random() * 299999999)),
    name: cleanName,
    email: cleanEmail,
    role: 'Estudiante',
    program: 'Ingeniería Civil y Estructural',
    university: 'U. Autónoma del Cauca',
    initials: computeInitials(cleanName),
  };
  saveAccounts([...accounts, { profile: newProfile, password }]);
  return { user: newProfile };
}

export function updateUserProfile(updated: UserProfile): UserProfile {
  const normalized: UserProfile = {
    ...updated,
    initials: computeInitials(updated.name),
  };
  const accounts = loadAccounts();
  const next = accounts.map((a) =>
    a.profile.id === normalized.id ? { ...a, profile: normalized } : a
  );
  saveAccounts(next);
  saveSessionUser(normalized);
  return normalized;
}

export function updateUserPassword(userId: string, currentPwd: string, newPwd: string): { ok: boolean; error?: string } {
  if (newPwd.length < 4) {
    return { ok: false, error: 'La nueva contraseña debe tener al menos 4 caracteres.' };
  }
  const accounts = loadAccounts();
  const acc = accounts.find((a) => a.profile.id === userId);
  if (!acc) return { ok: false, error: 'Cuenta no encontrada.' };
  if (acc.password !== currentPwd) return { ok: false, error: 'La contraseña actual no coincide.' };
  const next = accounts.map((a) => (a.profile.id === userId ? { ...a, password: newPwd } : a));
  saveAccounts(next);
  return { ok: true };
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw) as HistoryEntry[];
      if (Array.isArray(parsed)) {
        return parsed.map((entry) => ({
          ...entry,
          params: normalizeParams(entry.params),
        }));
      }
    }
  } catch {
    // fallback
  }
  const seeded = createInitialHistory();
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(seeded));
  return seeded;
}

export function saveHistory(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(entries));
}

export function createHistoryEntry(result: SimulationResult): HistoryEntry {
  const meta = STRUCTURE_CATALOG.find((s) => s.id === result.params.structureType);
  const variantLabel =
    result.params.structureType === StructureType.TRUSS
      ? result.params.trussVariant === TrussVariant.TRIANGULAR
        ? ' · Triangular'
        : ' · Rectangular'
      : '';
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const displayDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} · ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return {
    id: `sim-${Date.now()}`,
    title: `${meta?.name ?? 'Estructura'}${variantLabel}`,
    dateISO: now.toISOString(),
    displayDate,
    params: { ...result.params },
    resultSummary: {
      reactionAKN: result.reactionAKN,
      reactionBKN: result.reactionBKN,
      maxStressMPa: result.maxStressMPa,
      maxDeflectionMm: result.maxDeflectionMm,
      safetyFactor: result.safetyFactor,
      status: result.status,
      statusLabel: result.statusLabel,
    },
  };
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function exportSimulationCSV(result: SimulationResult): void {
  const unit = result.params.unit;
  const rows = [
    ['Reporte de Simulación Estructural - StructuSim'],
    ['Fecha', new Date(result.computedAt).toLocaleString('es-CO')],
    ['Estructura', STRUCTURE_CATALOG.find((s) => s.id === result.params.structureType)?.name ?? result.params.structureType],
    ['Longitud / Base (m)', String(result.params.lengthM)],
    ['Altura (m)', String(result.params.heightM)],
    ['Área transversal A (cm²)', String(result.params.sectionAreaCm2)],
    ['Momento de inercia I (cm⁴)', String(result.params.momentOfInertiaCm4)],
    ['Coeficiente de pandeo K', String(result.params.effectiveLengthK)],
    ['Fuerza aplicada F', formatForce(result.loadKN, unit)],
    ['Ángulo fuerza θ (°)', String(result.params.forceAngleDeg)],
    ['Posición fuerza x_F (%)', String(result.params.loadPositionPct)],
    ['Masa adicional (kg)', String(result.params.additionalMassKg)],
    ['Posición masa x_m (%)', String(result.params.additionalMassPositionPct)],
    ['Carga distribuida w', formatDistLoad(result.distributedTotalKN / result.params.lengthM, unit)],
    ['Carga lateral / viento', formatForce(result.windKN, unit)],
    ['Factor de mayoración γ_f', String(result.params.loadFactorGamma)],
    ['Variación térmica ΔT (°C)', String(result.params.temperatureDeltaC)],
    ['Masa estructural / total (kg)', `${result.structuralMassKg.toFixed(1)} / ${result.totalMassKg.toFixed(1)}`],
    ['Peso propio', formatForce(result.selfWeightKN, unit)],
    ['Carga diseño vertical (γ_f · ΣFy)', formatForce(result.factoredVerticalLoadKN, unit)],
    ['Dilatación térmica ΔL_T (mm)', result.thermalElongationMm.toFixed(2)],
    ['Reacción horizontal RAx', formatForce(result.reactionAxKN, unit)],
    ['Reacción A (RAy)', formatForce(result.reactionAKN, unit)],
    ['Reacción B (RBy)', formatForce(result.reactionBKN, unit)],
    ['Cortante Máximo V_máx', formatForce(result.maxShearKN, unit)],
    ['Momento Flector Máximo M_máx', formatTorque(result.maxMomentKNm, unit)],
    ['Esfuerzo Máximo (MPa)', result.maxStressMPa.toFixed(2)],
    ['Carga Crítica de Euler P_cr', formatForce(result.eulerCriticalLoadKN, unit)],
    ['Deformación Máxima (mm)', result.maxDeflectionMm.toFixed(2)],
    ['Flecha Admisible L/360 (mm)', result.allowableDeflectionMm.toFixed(2)],
    ['Factor de Seguridad Real', result.safetyFactor.toFixed(2)],
    ['Factor de Seguridad Requerido', result.params.requiredSafetyFactor.toFixed(2)],
    ['Estado', result.statusLabel],
    [],
    ['Memoria de Cálculo Numérico'],
    ['Paso', 'Concepto', 'Fórmula', 'Sustitución', 'Resultado'],
    ...result.calculationSteps.map((s) => [
      String(s.stepNumber),
      s.title,
      s.formula,
      s.substitution,
      s.resultText,
    ]),
    [],
    ['Elemento', 'Tipo', 'Longitud (m)', `Fuerza Axial (${unit})`, 'Esfuerzo (MPa)', 'Utilización (%)'],
    ...result.members.map((m) => [
      `E-${m.id + 1}`,
      m.axialForceKN >= 0 ? 'Tensión' : 'Compresión',
      m.lengthM.toFixed(2),
      unit === ForceUnit.N ? (m.axialForceKN * 1000).toFixed(1) : m.axialForceKN.toFixed(2),
      m.stressMPa.toFixed(2),
      (m.utilization * 100).toFixed(1),
    ]),
  ];

  const csvContent = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `structusim-${result.params.structureType}-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
