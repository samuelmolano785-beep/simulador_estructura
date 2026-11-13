export enum StructureType {
  TRUSS = 'truss',
  SUSPENSION = 'suspension',
  TOWER = 'tower',
  BUILDING = 'building',
}

export enum TrussVariant {
  TRIANGULAR = 'triangular',
  RECTANGULAR = 'rectangular',
}

export enum MaterialType {
  STEEL = 'steel',
  CONCRETE = 'concrete',
  ALUMINUM = 'aluminum',
  WOOD = 'wood',
}

export enum ForceUnit {
  KN = 'kN',
  N = 'N',
}

export enum SupportCondition {
  SIMPLE = 'simple', // Articulado - Rodillo
  FIXED_BOTH = 'fixed-both', // Doble Empotramiento
  CANTILEVER = 'cantilever', // Voladizo (Empotrado en A)
}

export enum StabilityStatus {
  STABLE = 'stable',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

export type AppView =
  | 'home'
  | 'simulator'
  | 'results'
  | 'history'
  | 'profile'
  | 'settings';

export interface MaterialSpec {
  id: MaterialType;
  label: string;
  elasticModulusGPa: number; // E (GPa)
  yieldStrengthMPa: number; // sigma_y (MPa)
  densityKgM3: number; // rho (kg/m^3)
  thermalCoeffPerC: number; // alpha (1/°C)
  defaultSectionAreaCm2: number;
  defaultInertiaCm4: number;
}

export interface StructureNode {
  id: number;
  label: string;
  x: number; // meters
  y: number; // meters
  dxMm: number; // horizontal displacement (mm)
  dyMm: number; // vertical displacement (mm)
  support?: 'pin' | 'roller' | 'fixed';
  hasLoad?: boolean;
}

export interface StructureMember {
  id: number;
  startNode: number;
  endNode: number;
  role: 'chord' | 'diagonal' | 'vertical' | 'cable' | 'pylon' | 'column' | 'beam';
  lengthM: number;
  axialForceKN: number; // + tension, - compression
  stressMPa: number;
  utilization: number; // 0..1+ ratio against material limit
}

export interface ChartPoint {
  index: number;
  positionLabel: string;
  positionM: number;
  forceKN: number;
  stressMPa: number;
  deflectionMm: number;
}

export interface CalculationVariable {
  symbol: string;
  meaning: string;
}

export interface CalculationStep {
  id: string;
  stepNumber: number;
  title: string;
  whatIsCalculated: string;
  howItIsDone: string;
  formula: string;
  variables: CalculationVariable[];
  substitution: string;
  resultText: string;
}

export interface SimulationParams {
  structureType: StructureType;
  trussVariant: TrussVariant;
  lengthM: number; // span or base width (m)
  heightM: number; // truss/tower/building height (m)
  loadValue: number; // applied force F (kN or N)
  forceAngleDeg: number; // angle of applied force relative to horizontal (90 = vertical downward)
  loadPositionPct: number; // position of applied force x_F (10..90%)
  additionalMassKg: number; // additional mass m_adic (kg)
  additionalMassPositionPct: number; // position of additional mass x_m (10..90%)
  distributedLoadValue: number; // uniform distributed load (kN/m or N/m)
  windLoadValue: number; // horizontal wind/lateral load (kN or N)
  unit: ForceUnit;
  material: MaterialType;
  baysOrStories: number; // panels / stories
  sectionAreaCm2: number; // cross-sectional area A (cm^2)
  momentOfInertiaCm4: number; // second moment of area I (cm^4)
  effectiveLengthK: number; // buckling K factor (0.5, 0.7, 1.0, 2.0)
  loadFactorGamma: number; // amplification / LRFD load factor (1.0 - 1.6)
  temperatureDeltaC: number; // thermal variation delta T (°C)
  includeSelfWeight: boolean;
  gravityMs2: number; // g (m/s^2)
  requiredSafetyFactor: number; // minimum required FS
  supportCondition: SupportCondition;
}

export interface SimulationResult {
  params: SimulationParams;
  loadKN: number; // total magnitude of applied force F
  forceVerticalKN: number; // F_y = F * sin(theta)
  forceHorizontalKN: number; // F_x = F * cos(theta)
  additionalWeightKN: number; // W_adic = m_adic * g / 1000
  distributedTotalKN: number;
  windKN: number;
  totalMemberLengthM: number;
  structuralMassKg: number;
  totalMassKg: number; // structuralMassKg + additionalMassKg
  selfWeightKN: number;
  totalVerticalLoadKN: number; // nominal vertical sum
  factoredVerticalLoadKN: number; // gamma * totalVerticalLoadKN
  totalHorizontalLoadKN: number; // wind + F_x
  reactionAxKN: number;
  reactionAKN: number;
  reactionBKN: number;
  fixedMomentAKNm: number;
  maxShearKN: number;
  maxMomentKNm: number;
  maxForceKN: number;
  maxCompressionKN: number;
  eulerCriticalLoadKN: number;
  bucklingSafetyFactor: number;
  yieldSafetyFactor: number;
  thermalElongationMm: number; // delta L_T = alpha * L * deltaT * 1000
  maxStressMPa: number;
  maxDeflectionMm: number;
  allowableDeflectionMm: number; // L / 360
  deflectionRatioText: string; // e.g. L/520
  axialStiffnessMN: number; // E * A in MN
  totalTorqueKNm: number;
  centerOfMass: { x: number; y: number };
  safetyFactor: number;
  status: StabilityStatus;
  statusLabel: string;
  recommendation: string;
  calculationSteps: CalculationStep[];
  nodes: StructureNode[];
  members: StructureMember[];
  chartPoints: ChartPoint[];
  computedAt: string;
}

export interface HistoryEntry {
  id: string;
  title: string;
  dateISO: string;
  displayDate: string;
  params: SimulationParams;
  resultSummary: {
    reactionAKN: number;
    reactionBKN: number;
    maxStressMPa: number;
    maxDeflectionMm: number;
    safetyFactor: number;
    status: StabilityStatus;
    statusLabel: string;
  };
}

export interface UserProfile {
  id: string;
  studentCode: string;
  name: string;
  email: string;
  role: string;
  program: string;
  university: string;
  initials: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  defaultUnit: ForceUnit;
  exaggerateDeflection: boolean;
  showStressColors: boolean;
}
