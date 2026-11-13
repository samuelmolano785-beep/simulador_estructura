import {
  CalculationStep,
  ChartPoint,
  ForceUnit,
  MaterialSpec,
  MaterialType,
  SimulationParams,
  SimulationResult,
  StabilityStatus,
  StructureMember,
  StructureNode,
  StructureType,
  SupportCondition,
  TrussVariant,
} from '../types/simulation';

export const MATERIALS: Record<MaterialType, MaterialSpec> = {
  [MaterialType.STEEL]: {
    id: MaterialType.STEEL,
    label: 'Acero Estructural (A36)',
    elasticModulusGPa: 200,
    yieldStrengthMPa: 250,
    densityKgM3: 7850,
    thermalCoeffPerC: 12e-6,
    defaultSectionAreaCm2: 24,
    defaultInertiaCm4: 1850,
  },
  [MaterialType.CONCRETE]: {
    id: MaterialType.CONCRETE,
    label: 'Concreto Armado',
    elasticModulusGPa: 30,
    yieldStrengthMPa: 35,
    densityKgM3: 2400,
    thermalCoeffPerC: 10e-6,
    defaultSectionAreaCm2: 180,
    defaultInertiaCm4: 13500,
  },
  [MaterialType.ALUMINUM]: {
    id: MaterialType.ALUMINUM,
    label: 'Aluminio 6061-T6',
    elasticModulusGPa: 69,
    yieldStrengthMPa: 145,
    densityKgM3: 2700,
    thermalCoeffPerC: 23e-6,
    defaultSectionAreaCm2: 28,
    defaultInertiaCm4: 2100,
  },
  [MaterialType.WOOD]: {
    id: MaterialType.WOOD,
    label: 'Madera Laminada',
    elasticModulusGPa: 12,
    yieldStrengthMPa: 38,
    densityKgM3: 550,
    thermalCoeffPerC: 5e-6,
    defaultSectionAreaCm2: 120,
    defaultInertiaCm4: 9000,
  },
};

export const STRUCTURE_CATALOG: Array<{
  id: StructureType;
  name: string;
  shortName: string;
  description: string;
  defaultParams: SimulationParams;
}> = [
  {
    id: StructureType.TRUSS,
    name: 'Puente Truss',
    shortName: 'Puente Truss',
    description: 'Analiza puentes de celosía en acero, madera o concreto.',
    defaultParams: {
      structureType: StructureType.TRUSS,
      trussVariant: TrussVariant.TRIANGULAR,
      lengthM: 10,
      heightM: 3,
      loadValue: 50,
      forceAngleDeg: 90,
      loadPositionPct: 50,
      additionalMassKg: 500,
      additionalMassPositionPct: 35,
      distributedLoadValue: 2.5,
      windLoadValue: 5,
      unit: ForceUnit.KN,
      material: MaterialType.STEEL,
      baysOrStories: 4,
      sectionAreaCm2: 24,
      momentOfInertiaCm4: 1850,
      effectiveLengthK: 1.0,
      loadFactorGamma: 1.0,
      temperatureDeltaC: 15,
      includeSelfWeight: true,
      gravityMs2: 9.81,
      requiredSafetyFactor: 1.5,
      supportCondition: SupportCondition.SIMPLE,
    },
  },
  {
    id: StructureType.SUSPENSION,
    name: 'Puente Colgante',
    shortName: 'Colgante',
    description: 'Evalúa cables parabólicos, péndolas y tensiones.',
    defaultParams: {
      structureType: StructureType.SUSPENSION,
      trussVariant: TrussVariant.TRIANGULAR,
      lengthM: 24,
      heightM: 7,
      loadValue: 80,
      forceAngleDeg: 90,
      loadPositionPct: 50,
      additionalMassKg: 1200,
      additionalMassPositionPct: 60,
      distributedLoadValue: 4.0,
      windLoadValue: 12,
      unit: ForceUnit.KN,
      material: MaterialType.STEEL,
      baysOrStories: 6,
      sectionAreaCm2: 32,
      momentOfInertiaCm4: 2400,
      effectiveLengthK: 1.0,
      loadFactorGamma: 1.0,
      temperatureDeltaC: 20,
      includeSelfWeight: true,
      gravityMs2: 9.81,
      requiredSafetyFactor: 1.67,
      supportCondition: SupportCondition.SIMPLE,
    },
  },
  {
    id: StructureType.TOWER,
    name: 'Torre Eléctrica',
    shortName: 'Torre Eléctrica',
    description: 'Calcula estabilidad, compresión y vuelco en torres.',
    defaultParams: {
      structureType: StructureType.TOWER,
      trussVariant: TrussVariant.TRIANGULAR,
      lengthM: 6,
      heightM: 14,
      loadValue: 30,
      forceAngleDeg: 90,
      loadPositionPct: 50,
      additionalMassKg: 450,
      additionalMassPositionPct: 50,
      distributedLoadValue: 0.8,
      windLoadValue: 14,
      unit: ForceUnit.KN,
      material: MaterialType.STEEL,
      baysOrStories: 4,
      sectionAreaCm2: 24,
      momentOfInertiaCm4: 1850,
      effectiveLengthK: 1.0,
      loadFactorGamma: 1.0,
      temperatureDeltaC: 15,
      includeSelfWeight: true,
      gravityMs2: 9.81,
      requiredSafetyFactor: 1.5,
      supportCondition: SupportCondition.FIXED_BOTH,
    },
  },
  {
    id: StructureType.BUILDING,
    name: 'Estructura Edificio',
    shortName: 'Edificio',
    description: 'Analiza marcos estructurales, vigas y columnas.',
    defaultParams: {
      structureType: StructureType.BUILDING,
      trussVariant: TrussVariant.RECTANGULAR,
      lengthM: 12,
      heightM: 10,
      loadValue: 100,
      forceAngleDeg: 90,
      loadPositionPct: 50,
      additionalMassKg: 2000,
      additionalMassPositionPct: 40,
      distributedLoadValue: 8.0,
      windLoadValue: 18,
      unit: ForceUnit.KN,
      material: MaterialType.CONCRETE,
      baysOrStories: 3,
      sectionAreaCm2: 180,
      momentOfInertiaCm4: 13500,
      effectiveLengthK: 0.7,
      loadFactorGamma: 1.0,
      temperatureDeltaC: 10,
      includeSelfWeight: true,
      gravityMs2: 9.81,
      requiredSafetyFactor: 1.6,
      supportCondition: SupportCondition.FIXED_BOTH,
    },
  },
];

export function normalizeParams(raw: Partial<SimulationParams>): SimulationParams {
  const base =
    STRUCTURE_CATALOG.find((s) => s.id === raw.structureType)?.defaultParams ??
    STRUCTURE_CATALOG[0].defaultParams;
  const mat = MATERIALS[raw.material ?? base.material] ?? MATERIALS[MaterialType.STEEL];

  return {
    ...base,
    ...raw,
    forceAngleDeg:
      typeof raw.forceAngleDeg === 'number' ? raw.forceAngleDeg : base.forceAngleDeg,
    additionalMassKg:
      typeof raw.additionalMassKg === 'number' && raw.additionalMassKg >= 0
        ? raw.additionalMassKg
        : base.additionalMassKg,
    additionalMassPositionPct:
      typeof raw.additionalMassPositionPct === 'number'
        ? raw.additionalMassPositionPct
        : base.additionalMassPositionPct,
    distributedLoadValue:
      typeof raw.distributedLoadValue === 'number'
        ? raw.distributedLoadValue
        : base.distributedLoadValue,
    windLoadValue:
      typeof raw.windLoadValue === 'number' ? raw.windLoadValue : base.windLoadValue,
    sectionAreaCm2:
      typeof raw.sectionAreaCm2 === 'number' && raw.sectionAreaCm2 > 0
        ? raw.sectionAreaCm2
        : mat.defaultSectionAreaCm2,
    momentOfInertiaCm4:
      typeof raw.momentOfInertiaCm4 === 'number' && raw.momentOfInertiaCm4 > 0
        ? raw.momentOfInertiaCm4
        : mat.defaultInertiaCm4,
    effectiveLengthK:
      typeof raw.effectiveLengthK === 'number' && raw.effectiveLengthK > 0
        ? raw.effectiveLengthK
        : base.effectiveLengthK,
    loadFactorGamma:
      typeof raw.loadFactorGamma === 'number' && raw.loadFactorGamma >= 1
        ? raw.loadFactorGamma
        : base.loadFactorGamma,
    temperatureDeltaC:
      typeof raw.temperatureDeltaC === 'number' ? raw.temperatureDeltaC : base.temperatureDeltaC,
    includeSelfWeight:
      typeof raw.includeSelfWeight === 'boolean'
        ? raw.includeSelfWeight
        : base.includeSelfWeight,
    gravityMs2:
      typeof raw.gravityMs2 === 'number' && raw.gravityMs2 > 0
        ? raw.gravityMs2
        : 9.81,
    requiredSafetyFactor:
      typeof raw.requiredSafetyFactor === 'number' && raw.requiredSafetyFactor >= 1
        ? raw.requiredSafetyFactor
        : 1.5,
    supportCondition: raw.supportCondition ?? base.supportCondition,
  };
}

export function toKN(value: number, unit: ForceUnit): number {
  return unit === ForceUnit.N ? value / 1000 : value;
}

export function fromKN(kN: number, unit: ForceUnit): number {
  return unit === ForceUnit.N ? kN * 1000 : kN;
}

export function formatForce(kN: number, unit: ForceUnit, decimals?: number): string {
  const val = fromKN(kN, unit);
  if (unit === ForceUnit.N) {
    const d = decimals ?? (Math.abs(val) < 10 ? 1 : 0);
    return `${val.toFixed(d)} N`;
  }
  const d = decimals ?? (Math.abs(val) < 10 ? 2 : 1);
  const formatted = Number(val.toFixed(d)).toString();
  return `${formatted} kN`;
}

export function formatDistLoad(kNm: number, unit: ForceUnit): string {
  const val = fromKN(kNm, unit);
  return `${val.toFixed(unit === ForceUnit.N ? 0 : 2)} ${unit}/m`;
}

export function formatTorque(kNm: number, unit: ForceUnit): string {
  if (unit === ForceUnit.N) {
    return `${(kNm * 1000).toFixed(2)} N·m`;
  }
  return `${kNm.toFixed(2)} kN·m`;
}

function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > maxVal) {
        maxVal = Math.abs(M[row][col]);
        pivotRow = row;
      }
    }

    if (maxVal < 1e-10) {
      M[col][col] += 1e-6;
    } else if (pivotRow !== col) {
      [M[col], M[pivotRow]] = [M[pivotRow], M[col]];
    }

    const pivot = M[col][col];
    for (let row = col + 1; row < n; row++) {
      const factor = M[row][col] / pivot;
      if (Math.abs(factor) < 1e-14) continue;
      for (let j = col; j <= n; j++) {
        M[row][j] -= factor * M[col][j];
      }
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = sum / M[i][i];
  }
  return x;
}

function solve2DTrussFEM(
  rawNodes: Array<{
    id: number;
    label: string;
    x: number;
    y: number;
    support?: 'pin' | 'roller' | 'fixed';
  }>,
  rawMembers: Array<{
    id: number;
    startNode: number;
    endNode: number;
    role: StructureMember['role'];
    areaScale?: number;
  }>,
  nodalLoads: Array<{ nodeId: number; fxKN: number; fyKN: number }>,
  material: MaterialSpec,
  userAreaCm2: number
): {
  displacements: Array<{ dxM: number; dyM: number }>;
  members: StructureMember[];
  reactionMap: Record<number, { rxKN: number; ryKN: number }>;
} {
  const nNodes = rawNodes.length;
  const nDof = nNodes * 2;
  const K: number[][] = Array.from({ length: nDof }, () => new Array(nDof).fill(0));
  const F: number[] = new Array(nDof).fill(0);

  const E_kPa = material.elasticModulusGPa * 1e6;
  const baseAreaM2 = userAreaCm2 * 1e-4;

  for (const load of nodalLoads) {
    F[load.nodeId * 2] += load.fxKN;
    F[load.nodeId * 2 + 1] += load.fyKN;
  }

  for (const m of rawMembers) {
    const n1 = rawNodes[m.startNode];
    const n2 = rawNodes[m.endNode];
    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;
    const L = Math.hypot(dx, dy) || 0.001;
    const c = dx / L;
    const s = dy / L;
    const A = baseAreaM2 * (m.areaScale ?? 1);
    const k = (E_kPa * A) / L;

    const ke = [
      [c * c, c * s, -c * c, -c * s],
      [c * s, s * s, -c * s, -s * s],
      [-c * c, -c * s, c * c, c * s],
      [-c * s, -s * s, c * s, s * s],
    ];

    const dofs = [m.startNode * 2, m.startNode * 2 + 1, m.endNode * 2, m.endNode * 2 + 1];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        K[dofs[i]][dofs[j]] += k * ke[i][j];
      }
    }
  }

  const KOrig = K.map((row) => [...row]);
  const FOrig = [...F];

  const constrained = new Set<number>();
  for (const node of rawNodes) {
    if (node.support === 'pin' || node.support === 'fixed') {
      constrained.add(node.id * 2);
      constrained.add(node.id * 2 + 1);
    } else if (node.support === 'roller') {
      constrained.add(node.id * 2 + 1);
    }
  }

  const KMod = K.map((row) => [...row]);
  const FMod = [...F];
  for (const dof of constrained) {
    for (let j = 0; j < nDof; j++) {
      KMod[dof][j] = 0;
      KMod[j][dof] = 0;
    }
    KMod[dof][dof] = 1;
    FMod[dof] = 0;
  }

  for (let i = 0; i < nDof; i++) {
    if (Math.abs(KMod[i][i]) < 1e-8) {
      KMod[i][i] += 1e-3;
    }
  }

  const U = solveLinearSystem(KMod, FMod);

  const displacements = rawNodes.map((_, idx) => ({
    dxM: U[idx * 2],
    dyM: U[idx * 2 + 1],
  }));

  const reactionMap: Record<number, { rxKN: number; ryKN: number }> = {};
  for (const node of rawNodes) {
    if (node.support) {
      const ix = node.id * 2;
      const iy = node.id * 2 + 1;
      let rx = -FOrig[ix];
      let ry = -FOrig[iy];
      for (let j = 0; j < nDof; j++) {
        rx += KOrig[ix][j] * U[j];
        ry += KOrig[iy][j] * U[j];
      }
      reactionMap[node.id] = { rxKN: rx, ryKN: ry };
    }
  }

  const members: StructureMember[] = rawMembers.map((m) => {
    const n1 = rawNodes[m.startNode];
    const n2 = rawNodes[m.endNode];
    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;
    const L = Math.hypot(dx, dy) || 0.001;
    const c = dx / L;
    const s = dy / L;
    const A = baseAreaM2 * (m.areaScale ?? 1);

    const u1x = U[m.startNode * 2];
    const u1y = U[m.startNode * 2 + 1];
    const u2x = U[m.endNode * 2];
    const u2y = U[m.endNode * 2 + 1];

    const deltaL = (u2x - u1x) * c + (u2y - u1y) * s;
    const axialForceKN = ((E_kPa * A) / L) * deltaL;
    const areaCm2 = userAreaCm2 * (m.areaScale ?? 1);
    const stressMPa = Math.abs(axialForceKN * 10) / areaCm2;
    const utilization = stressMPa / material.yieldStrengthMPa;

    return {
      id: m.id,
      startNode: m.startNode,
      endNode: m.endNode,
      role: m.role,
      lengthM: L,
      axialForceKN,
      stressMPa,
      utilization,
    };
  });

  return { displacements, members, reactionMap };
}

function buildCalculationSteps(data: {
  params: SimulationParams;
  material: MaterialSpec;
  L: number;
  H: number;
  xLoad: number;
  xMass: number;
  loadKN: number;
  forceVerticalKN: number;
  forceHorizontalKN: number;
  additionalWeightKN: number;
  distLoadKNm: number;
  distributedTotalKN: number;
  windKN: number;
  totalMemberLengthM: number;
  structuralMassKg: number;
  totalMassKg: number;
  selfWeightKN: number;
  totalVerticalLoadKN: number;
  factoredVerticalLoadKN: number;
  totalHorizontalLoadKN: number;
  reactionAxKN: number;
  reactionAKN: number;
  reactionBKN: number;
  fixedMomentAKNm: number;
  maxShearKN: number;
  maxMomentKNm: number;
  maxStressMPa: number;
  thermalElongationMm: number;
  thermalStressMPa: number;
  maxCompressionKN: number;
  eulerCriticalLoadKN: number;
  bucklingSafetyFactor: number;
  yieldSafetyFactor: number;
  maxDeflectionMm: number;
  allowableDeflectionMm: number;
  safetyFactor: number;
}): CalculationStep[] {
  const {
    params,
    material,
    L,
    H,
    xLoad,
    xMass,
    loadKN,
    forceVerticalKN,
    forceHorizontalKN,
    additionalWeightKN,
    distLoadKNm,
    distributedTotalKN,
    windKN,
    totalMemberLengthM,
    structuralMassKg,
    totalMassKg,
    selfWeightKN,
    totalVerticalLoadKN,
    factoredVerticalLoadKN,
    totalHorizontalLoadKN,
    reactionAxKN,
    reactionAKN,
    reactionBKN,
    fixedMomentAKNm,
    maxShearKN,
    maxMomentKNm,
    maxStressMPa,
    thermalElongationMm,
    thermalStressMPa,
    maxCompressionKN,
    eulerCriticalLoadKN,
    bucklingSafetyFactor,
    yieldSafetyFactor,
    maxDeflectionMm,
    allowableDeflectionMm,
    safetyFactor,
  } = data;

  const u = params.unit;
  const areaM2 = params.sectionAreaCm2 * 1e-4;
  const inertiaM4 = params.momentOfInertiaCm4 * 1e-8;
  const E_MPa = material.elasticModulusGPa * 1000;
  const angleRad = (params.forceAngleDeg * Math.PI) / 180;
  const sinT = Math.sin(angleRad);
  const cosT = Math.cos(angleRad);
  const volumeM3 = areaM2 * totalMemberLengthM;
  const activeSelfWeight = params.includeSelfWeight ? selfWeightKN : 0;

  const supportNote =
    params.supportCondition === SupportCondition.CANTILEVER
      ? `Empotramiento en A: R_Ay = ${formatForce(reactionAKN, u)}, M_A = ${formatTorque(fixedMomentAKNm, u)}, R_By = 0`
      : `R_Ax = ${formatForce(reactionAxKN, u)} · R_Ay = ${formatForce(reactionAKN, u)} · R_By = ${formatForce(reactionBKN, u)}`;

  const bucklingText =
    maxCompressionKN > 0.01
      ? `P_cr = ${formatForce(eulerCriticalLoadKN, u)} · FS_pandeo = ${bucklingSafetyFactor.toFixed(2)}`
      : `Sin compresión crítica · P_cr = ${formatForce(eulerCriticalLoadKN, u)}`;

  return [
    {
      id: 'step-force-decomposition',
      stepNumber: 1,
      title: 'Descomposición de la Fuerza Aplicada y Peso de la Masa Adicional',
      whatIsCalculated:
        'Se calcula cuánto de la fuerza aplicada empuja hacia abajo (componente vertical), cuánto empuja hacia los lados (componente horizontal) y cuánta fuerza ejerce la masa adicional por acción de la gravedad.',
      howItIsDone:
        '1) Se multiplica la fuerza F por el seno del ángulo θ para sacar la fuerza vertical F_y. 2) Se multiplica F por el coseno de θ para sacar el empuje horizontal F_x. 3) Se multiplica la masa adicional (kg) por la gravedad g para obtener Newtons y se divide entre 1000 para pasar a kN.',
      formula: 'F_y = F · sen(θ)   |   F_x = F · cos(θ)   |   W_adic = (m_adic · g) / 1000',
      variables: [
        { symbol: 'F', meaning: `Fuerza puntual aplicada (${formatForce(loadKN, u)}) en x_F = ${xLoad.toFixed(2)} m` },
        { symbol: 'θ', meaning: `Ángulo de aplicación de la fuerza (${params.forceAngleDeg}° respecto a la horizontal)` },
        { symbol: 'F_y', meaning: 'Componente vertical de la fuerza aplicada (carga hacia abajo)' },
        { symbol: 'F_x', meaning: 'Componente horizontal de la fuerza aplicada (empuje lateral)' },
        { symbol: 'm_adic', meaning: `Masa adicional colocada sobre la estructura (${params.additionalMassKg} kg) en x_m = ${xMass.toFixed(2)} m` },
        { symbol: 'g', meaning: `Aceleración de la gravedad (${params.gravityMs2} m/s²)` },
        { symbol: 'W_adic', meaning: 'Peso en fuerza generado por la masa adicional' },
      ],
      substitution: `F_y = ${formatForce(loadKN, u)} × sen(${params.forceAngleDeg}° = ${sinT.toFixed(3)}) = ${formatForce(forceVerticalKN, u)}  |  F_x = ${formatForce(loadKN, u)} × cos(${params.forceAngleDeg}° = ${cosT.toFixed(3)}) = ${formatForce(forceHorizontalKN, u)}  |  W_adic = (${params.additionalMassKg} kg × ${params.gravityMs2} m/s²) / 1000 = ${formatForce(additionalWeightKN, u)}`,
      resultText: `F_y = ${formatForce(forceVerticalKN, u)} · F_x = ${formatForce(forceHorizontalKN, u)} · W_adic = ${formatForce(additionalWeightKN, u)}`,
    },
    {
      id: 'step-self-weight',
      stepNumber: 2,
      title: 'Peso Propio de la Estructura y Masa Total',
      whatIsCalculated:
        'Se determina cuánto pesa la estructura por sí sola según su tamaño y material (peso propio) y cuál es la masa total sumando la masa adicional.',
      howItIsDone:
        '1) Se convierte el área A de cm² a m² dividiendo entre 10 000. 2) Se multiplica esa área por la suma de longitudes de todas las barras (ΣL_i) para obtener el volumen V. 3) Se multiplica V por la densidad ρ del material para sacar la masa propia m_est. 4) Se multiplica m_est por g y se divide entre 1000 para sacar el peso propio W_propio.',
      formula: 'V = A · ΣL_i   |   m_est = ρ · V   |   m_total = m_est + m_adic   |   W_propio = (m_est · g) / 1000',
      variables: [
        { symbol: 'A', meaning: `Área de la sección transversal de cada barra (${params.sectionAreaCm2} cm² = ${areaM2.toFixed(4)} m²)` },
        { symbol: 'ΣL_i', meaning: `Suma de las longitudes de todas las barras de la estructura (${totalMemberLengthM.toFixed(2)} m)` },
        { symbol: 'V', meaning: 'Volumen total de material usado en la estructura (m³)' },
        { symbol: 'ρ', meaning: `Densidad del material ${material.label} (${material.densityKgM3} kg/m³)` },
        { symbol: 'm_est', meaning: 'Masa propia de la estructura sin cargas externas (kg)' },
        { symbol: 'm_total', meaning: 'Suma de la masa propia + la masa adicional (kg)' },
        { symbol: 'W_propio', meaning: 'Peso de la estructura hacia abajo debido a la gravedad' },
      ],
      substitution: `V ≈ ${areaM2.toFixed(4)} m² × ${totalMemberLengthM.toFixed(2)} m = ${volumeM3.toFixed(4)} m³  |  m_est = ${structuralMassKg.toFixed(1)} kg  |  m_total = ${structuralMassKg.toFixed(1)} + ${params.additionalMassKg} = ${totalMassKg.toFixed(1)} kg  |  W_propio = (${structuralMassKg.toFixed(1)} × ${params.gravityMs2}) / 1000 = ${formatForce(selfWeightKN, u)}`,
      resultText: `m_est = ${structuralMassKg.toFixed(1)} kg · m_total = ${totalMassKg.toFixed(1)} kg · W_propio = ${params.includeSelfWeight ? formatForce(selfWeightKN, u) : `${formatForce(selfWeightKN, u)} (No sumado)`}`,
    },
    {
      id: 'step-total-loads',
      stepNumber: 3,
      title: 'Suma Total de Cargas y Factor de Mayoración de Diseño',
      whatIsCalculated:
        'Se suman todas las fuerzas verticales (puntual, masa adicional, carga distribuida y peso propio) y todas las fuerzas horizontales (viento + F_x), y luego se multiplican por el factor de seguridad de carga γ_f.',
      howItIsDone:
        '1) La carga distribuida w se multiplica por toda la longitud L para convertirla en fuerza total W_dist. 2) Se suman F_y + W_adic + W_dist + W_propio para hallar la carga vertical nominal ΣF_y,nom. 3) Se multiplica por γ_f para obtener la carga de diseño F_y,dis. 4) Se suman el viento F_h y F_x (multiplicados por γ_f) para hallar la fuerza horizontal total ΣF_x.',
      formula: 'W_dist = w · L   |   ΣF_y,nom = F_y + W_adic + W_dist + W_propio   |   F_y,dis = γ_f · ΣF_y,nom',
      variables: [
        { symbol: 'w', meaning: `Carga distribuida uniforme (${formatDistLoad(distLoadKNm, u)}) repartida por metro` },
        { symbol: 'L', meaning: `Longitud total o ancho base de la estructura (${L.toFixed(1)} m)` },
        { symbol: 'W_dist', meaning: `Fuerza equivalente de la carga distribuida (${formatForce(distributedTotalKN, u)})` },
        { symbol: 'ΣF_y,nom', meaning: 'Carga vertical total real sin mayorar' },
        { symbol: 'γ_f', meaning: `Factor de mayoración de carga (${params.loadFactorGamma.toFixed(2)}) para diseño seguro` },
        { symbol: 'F_y,dis', meaning: 'Carga vertical total mayorada usada en el cálculo' },
        { symbol: 'F_h / ΣF_x', meaning: `Fuerza de viento (${formatForce(windKN, u)}) y suma horizontal total (${formatForce(totalHorizontalLoadKN, u)})` },
      ],
      substitution: `W_dist = ${formatDistLoad(distLoadKNm, u)} × ${L.toFixed(1)} m = ${formatForce(distributedTotalKN, u)}  |  ΣF_y,nom = ${formatForce(forceVerticalKN, u)} + ${formatForce(additionalWeightKN, u)} + ${formatForce(distributedTotalKN, u)} + ${formatForce(activeSelfWeight, u)} = ${formatForce(totalVerticalLoadKN, u)}  |  F_y,dis = ${params.loadFactorGamma.toFixed(2)} × ${formatForce(totalVerticalLoadKN, u)} = ${formatForce(factoredVerticalLoadKN, u)}`,
      resultText: `Nominal ΣFy = ${formatForce(totalVerticalLoadKN, u)} · Diseño F_y,dis = ${formatForce(factoredVerticalLoadKN, u)} · ΣFx = ${formatForce(totalHorizontalLoadKN, u)}`,
    },
    {
      id: 'step-equilibrium',
      stepNumber: 4,
      title: 'Equilibrio Estático y Reacciones en los Apoyos (RA y RB)',
      whatIsCalculated:
        'Se calcula cuánta fuerza hacia arriba y hacia los lados debe soportar cada apoyo (izquierdo A y derecho B) para que la estructura no se hunda, no se deslice ni gire.',
      howItIsDone:
        '1) Por equilibrio horizontal (ΣF_x = 0), el apoyo A resiste el empuje horizontal total (R_Ax = -ΣF_x). 2) Se suman los momentos de giro alrededor del punto A multiplicando cada fuerza por su distancia (brazo) para despejar R_By = Momento Total / L. 3) Por equilibrio vertical (ΣF_y = 0), el apoyo A soporta el resto: R_Ay = F_y,dis - R_By.',
      formula: 'ΣF_x = 0 ⇒ R_Ax = -ΣF_x   |   ΣM_A = 0 ⇒ R_By = (F_y·x_F + W_adic·x_m + W_u·L/2 + ΣF_x·H_c) / L   |   R_Ay = F_y,dis - R_By',
      variables: [
        { symbol: 'R_Ax', meaning: 'Reacción horizontal en el apoyo izquierdo A' },
        { symbol: 'R_Ay', meaning: 'Reacción vertical hacia arriba en el apoyo izquierdo A' },
        { symbol: 'R_By', meaning: 'Reacción vertical hacia arriba en el apoyo derecho B' },
        { symbol: 'x_F', meaning: `Distancia desde el apoyo A hasta la fuerza F (${xLoad.toFixed(2)} m)` },
        { symbol: 'x_m', meaning: `Distancia desde el apoyo A hasta la masa adicional (${xMass.toFixed(2)} m)` },
        { symbol: 'W_u', meaning: 'Suma de cargas uniformes (W_dist + W_propio)' },
        { symbol: 'H / H_c', meaning: `Altura de la estructura (${H.toFixed(1)} m) y altura efectiva del viento` },
        { symbol: 'M_A', meaning: 'Momento de empotramiento en el apoyo A (aplica en voladizo)' },
      ],
      substitution: `x_F = ${xLoad.toFixed(2)} m, x_m = ${xMass.toFixed(2)} m, L = ${L.toFixed(1)} m, F_y,dis = ${formatForce(factoredVerticalLoadKN, u)}  |  R_Ay + R_By = ${formatForce(reactionAKN + reactionBKN, u)}`,
      resultText: supportNote,
    },
    {
      id: 'step-stress-thermal',
      stepNumber: 5,
      title: 'Cortante, Momento Flector, Esfuerzo Máximo y Dilatación Térmica',
      whatIsCalculated:
        'Se halla la fuerza cortante máxima, el momento de flexión más grande, el esfuerzo interno σ_máx (qué tan exigido está el material en MPa) y cuánto se estira o encoge la estructura por cambio de temperatura ΔT.',
      howItIsDone:
        '1) El cortante máximo V_máx equivale a la mayor reacción vertical en los apoyos. 2) El momento flector M_máx mide la máxima tendencia a doblarse. 3) El esfuerzo mecánico se obtiene dividiendo la fuerza interna más alta entre el área transversal A (σ = F/A) y sumando el esfuerzo térmico σ_T si los apoyos están bloqueados. 4) La dilatación térmica se calcula multiplicando α × L × ΔT × 1000 mm.',
      formula: 'σ_mec = |F_máx| / A   |   σ_máx = σ_mec + σ_T   |   ΔL_T = α · L · ΔT · 1000',
      variables: [
        { symbol: 'V_máx', meaning: 'Fuerza cortante máxima en la estructura' },
        { symbol: 'M_máx', meaning: 'Momento flector máximo (esfuerzo de doblado)' },
        { symbol: 'σ_mec', meaning: 'Esfuerzo mecánico en MegaPascales (MPa = N/mm²)' },
        { symbol: 'σ_T', meaning: 'Esfuerzo térmico adicional cuando los dos apoyos están empotrados' },
        { symbol: 'σ_máx', meaning: `Esfuerzo máximo total en el elemento más crítico (${maxStressMPa.toFixed(2)} MPa)` },
        { symbol: 'σ_y', meaning: `Límite de fluencia o resistencia del material (${material.yieldStrengthMPa} MPa)` },
        { symbol: 'α', meaning: `Coeficiente de dilatación térmica del material (${material.thermalCoeffPerC.toExponential(1)} /°C)` },
        { symbol: 'ΔT', meaning: `Cambio de temperatura (${params.temperatureDeltaC} °C)` },
        { symbol: 'ΔL_T', meaning: 'Alargamiento o contracción térmica en milímetros (mm)' },
      ],
      substitution: `V_máx = ${formatForce(maxShearKN, u)}  |  M_máx = ${formatTorque(maxMomentKNm, u)}  |  E = ${E_MPa.toLocaleString('es-CO')} MPa  |  ΔL_T = ${material.thermalCoeffPerC.toExponential(1)} × ${L.toFixed(1)} m × ${params.temperatureDeltaC}°C × 1000 = ${thermalElongationMm.toFixed(2)} mm`,
      resultText: `σ_máx = ${maxStressMPa.toFixed(2)} MPa (Límite σ_y = ${material.yieldStrengthMPa} MPa · σ_T = ${thermalStressMPa.toFixed(2)} MPa) · ΔL_T = ${thermalElongationMm.toFixed(2)} mm`,
    },
    {
      id: 'step-buckling',
      stepNumber: 6,
      title: 'Pandeo Crítico de Euler y Verificación de Deformación (Flecha)',
      whatIsCalculated:
        'Se verifica que ninguna barra comprimida se doble lateralmente por pandeo (carga crítica P_cr) y que el pandeo vertical o deformación δ_máx no supere el límite permitido para que la estructura no se curve en exceso.',
      howItIsDone:
        '1) Se multiplica el factor de apoyo K por la longitud de la barra comprimida más larga para hallar la longitud efectiva (K·L_e). 2) Se aplica la fórmula de Euler P_cr = (π² × E × I) / (K·L_e)². 3) Se divide la longitud L en milímetros entre 360 para obtener la flecha máxima admisible δ_adm y se compara contra la deformación real δ_máx.',
      formula: 'P_cr = (π² · E · I) / (K · L_e)²   |   δ_adm = (L · 1000) / 360',
      variables: [
        { symbol: 'P_cr', meaning: 'Carga crítica de Euler: fuerza máxima de compresión antes de que una barra se doble por pandeo' },
        { symbol: 'E', meaning: `Módulo de elasticidad o rigidez del material (${material.elasticModulusGPa} GPa)` },
        { symbol: 'I', meaning: `Momento de inercia de la sección (${params.momentOfInertiaCm4} cm⁴ = ${inertiaM4.toExponential(2)} m⁴)` },
        { symbol: 'K', meaning: `Factor de longitud efectiva según los apoyos de la barra (${params.effectiveLengthK})` },
        { symbol: 'L_e', meaning: 'Longitud libre de la barra más larga sometida a compresión (m)' },
        { symbol: 'δ_máx', meaning: `Deformación o desplazamiento máximo calculado (${maxDeflectionMm.toFixed(2)} mm)` },
        { symbol: 'δ_adm', meaning: `Deformación máxima permitida por norma L/360 (${allowableDeflectionMm.toFixed(2)} mm)` },
      ],
      substitution: `π² × ${material.elasticModulusGPa} GPa × ${inertiaM4.toExponential(2)} m⁴ con K = ${params.effectiveLengthK}  |  δ_máx = ${maxDeflectionMm.toFixed(2)} mm vs δ_adm = (${L.toFixed(1)}×1000)/360 = ${allowableDeflectionMm.toFixed(2)} mm`,
      resultText: `${bucklingText} · ${maxDeflectionMm <= allowableDeflectionMm ? 'Flecha CUMPLE (δ_máx ≤ δ_adm)' : 'Flecha EXCEDE L/360'}`,
    },
    {
      id: 'step-safety',
      stepNumber: 7,
      title: 'Factor de Seguridad Final (FS) vs Exigencia del Código',
      whatIsCalculated:
        'Se obtiene el número final que indica cuántas veces resiste la estructura por encima de la carga aplicada antes de ceder por esfuerzo o pandeo, y se compara contra el mínimo exigido FS_req.',
      howItIsDone:
        '1) Se divide la resistencia del material σ_y entre el esfuerzo máximo real σ_máx para sacar el factor por fluencia (FS_fluencia). 2) Se divide P_cr entre la compresión máxima para sacar el factor por pandeo (FS_pandeo). 3) Se toma el menor de los dos porque el modo más débil gobierna la seguridad, y se verifica si FS ≥ FS_req.',
      formula: 'FS_fluencia = σ_y / σ_máx   |   FS_pandeo = P_cr / |F_comp|   |   FS = mín(FS_fluencia, FS_pandeo)',
      variables: [
        { symbol: 'FS_fluencia', meaning: 'Margen de seguridad antes de que el material se deforme permanentemente o rompa' },
        { symbol: 'FS_pandeo', meaning: 'Margen de seguridad antes de que una barra comprimida se pandee' },
        { symbol: 'F_comp', meaning: `Fuerza máxima de compresión en una barra (${formatForce(maxCompressionKN, u)})` },
        { symbol: 'FS', meaning: 'Factor de seguridad gobernante (el más crítico de la estructura)' },
        { symbol: 'FS_req', meaning: `Factor de seguridad mínimo exigido que configuraste (${params.requiredSafetyFactor.toFixed(2)})` },
      ],
      substitution: `FS_fluencia = ${material.yieldStrengthMPa} / ${maxStressMPa.toFixed(2)} = ${yieldSafetyFactor.toFixed(2)}  |  FS_pandeo = ${bucklingSafetyFactor > 99 ? '∞ (sin riesgo)' : bucklingSafetyFactor.toFixed(2)}  |  mín = ${safetyFactor.toFixed(2)} vs FS_req = ${params.requiredSafetyFactor.toFixed(2)}`,
      resultText: `FS final = ${safetyFactor.toFixed(2)} (${safetyFactor >= params.requiredSafetyFactor ? 'CUMPLE: Estructura segura' : 'NO CUMPLE: Requiere refuerzo'})`,
    },
  ];
}

function classifyStability(
  safetyFactor: number,
  params: SimulationParams,
  material: MaterialSpec,
  bucklingFS: number,
  maxDeflectionMm: number,
  allowableDeflectionMm: number
): {
  status: StabilityStatus;
  statusLabel: string;
  recommendation: string;
} {
  const req = params.requiredSafetyFactor;
  const deflectionExceeded = maxDeflectionMm > allowableDeflectionMm;

  if (safetyFactor >= req && !deflectionExceeded) {
    return {
      status: StabilityStatus.STABLE,
      statusLabel: 'Estructura estable',
      recommendation:
        safetyFactor > req * 2.5
          ? `La estructura cumple con holgura (FS = ${safetyFactor.toFixed(2)} ≥ ${req.toFixed(2)}) bajo cargas mayoradas (γ_f = ${params.loadFactorGamma}) y masa adicional (${params.additionalMassKg} kg).`
          : `La estructura resiste las fuerzas aplicadas, masa adicional y variación térmica (${params.temperatureDeltaC}°C) con FS = ${safetyFactor.toFixed(2)} ≥ ${req.toFixed(2)}.`,
    };
  }
  if (safetyFactor >= 1.0) {
    const reason = deflectionExceeded
      ? `la deformación (${maxDeflectionMm.toFixed(2)} mm) excede el límite de servicio L/360 (${allowableDeflectionMm.toFixed(1)} mm)`
      : bucklingFS < safetyFactor + 0.05
        ? `el factor de seguridad a pandeo de Euler (${bucklingFS.toFixed(2)} con K=${params.effectiveLengthK}) es bajo`
        : `el factor de seguridad (${safetyFactor.toFixed(2)}) está por debajo del requerido (${req.toFixed(2)})`;
    return {
      status: StabilityStatus.WARNING,
      statusLabel: 'Precaución estructural',
      recommendation: `Atención: ${reason}. Incrementa el momento de inercia (I = ${params.momentOfInertiaCm4} cm⁴), reduce la masa adicional o ajusta la posición de carga.`,
    };
  }
  return {
    status: StabilityStatus.CRITICAL,
    statusLabel: 'Sobrecarga crítica',
    recommendation: `Falla potencial: la tensión o pandeo excede la capacidad de ${material.label} (FS = ${safetyFactor.toFixed(2)} < 1.00). Reduce la fuerza aplicada o masa adicional, o refuerza la sección.`,
  };
}

export function runStructuralSimulation(rawParams: SimulationParams): SimulationResult {
  const params = normalizeParams(rawParams);
  const material = MATERIALS[params.material];
  const L = Math.max(2, params.lengthM);
  const H = Math.max(1.5, params.heightM);
  const loadKN = Math.max(0, toKN(params.loadValue, params.unit));
  const angleRad = (params.forceAngleDeg * Math.PI) / 180;
  const forceVerticalKN = loadKN * Math.sin(angleRad);
  const forceHorizontalKN = loadKN * Math.cos(angleRad);

  const additionalWeightKN = (params.additionalMassKg * params.gravityMs2) / 1000;
  const distLoadKNm = Math.max(0, toKN(params.distributedLoadValue, params.unit));
  const windKN = Math.max(0, toKN(params.windLoadValue, params.unit));

  const loadFrac = Math.min(0.9, Math.max(0.1, params.loadPositionPct / 100));
  const massFrac = Math.min(0.9, Math.max(0.1, params.additionalMassPositionPct / 100));
  const xLoad = loadFrac * L;
  const xMass = massFrac * L;

  const areaM2 = params.sectionAreaCm2 * 1e-4;
  const inertiaM4 = params.momentOfInertiaCm4 * 1e-8;
  const E_kPa = material.elasticModulusGPa * 1e6;
  const axialStiffnessMN = material.elasticModulusGPa * 1000 * areaM2;

  let rawNodes: Array<{
    id: number;
    label: string;
    x: number;
    y: number;
    support?: 'pin' | 'roller' | 'fixed';
  }> = [];
  let rawMembers: Array<{
    id: number;
    startNode: number;
    endNode: number;
    role: StructureMember['role'];
    areaScale?: number;
  }> = [];

  if (params.structureType === StructureType.TRUSS) {
    const bays = Math.max(2, Math.min(8, params.baysOrStories || 4));
    const isCantilever = params.supportCondition === SupportCondition.CANTILEVER;
    const isFixedBoth = params.supportCondition === SupportCondition.FIXED_BOTH;

    if (params.trussVariant === TrussVariant.TRIANGULAR) {
      for (let i = 0; i <= bays; i++) {
        rawNodes.push({
          id: i,
          label: `N${i + 1}`,
          x: (i / bays) * L,
          y: 0,
          support:
            i === 0
              ? isCantilever || isFixedBoth
                ? 'fixed'
                : 'pin'
              : i === bays && !isCantilever
                ? isFixedBoth
                  ? 'fixed'
                  : 'roller'
                : undefined,
        });
      }
      for (let i = 0; i < bays; i++) {
        rawNodes.push({
          id: bays + 1 + i,
          label: `S${i + 1}`,
          x: ((i + 0.5) / bays) * L,
          y: H,
        });
      }

      let mid = 0;
      for (let i = 0; i < bays; i++) {
        rawMembers.push({ id: mid++, startNode: i, endNode: i + 1, role: 'chord' });
      }
      for (let i = 0; i < bays - 1; i++) {
        rawMembers.push({
          id: mid++,
          startNode: bays + 1 + i,
          endNode: bays + 2 + i,
          role: 'chord',
        });
      }
      for (let i = 0; i < bays; i++) {
        const top = bays + 1 + i;
        rawMembers.push({ id: mid++, startNode: i, endNode: top, role: 'diagonal' });
        rawMembers.push({ id: mid++, startNode: top, endNode: i + 1, role: 'diagonal' });
      }
      if (isCantilever) {
        rawNodes[bays + 1].support = 'pin';
      }
    } else {
      for (let i = 0; i <= bays; i++) {
        rawNodes.push({
          id: i,
          label: `B${i + 1}`,
          x: (i / bays) * L,
          y: 0,
          support:
            i === 0
              ? isCantilever || isFixedBoth
                ? 'fixed'
                : 'pin'
              : i === bays && !isCantilever
                ? isFixedBoth
                  ? 'fixed'
                  : 'roller'
                : undefined,
        });
      }
      for (let i = 0; i <= bays; i++) {
        rawNodes.push({
          id: bays + 1 + i,
          label: `T${i + 1}`,
          x: (i / bays) * L,
          y: H,
          support: isCantilever && i === 0 ? 'pin' : undefined,
        });
      }

      let mid = 0;
      for (let i = 0; i < bays; i++) {
        rawMembers.push({ id: mid++, startNode: i, endNode: i + 1, role: 'chord' });
        rawMembers.push({
          id: mid++,
          startNode: bays + 1 + i,
          endNode: bays + 2 + i,
          role: 'chord',
        });
      }
      for (let i = 0; i <= bays; i++) {
        rawMembers.push({ id: mid++, startNode: i, endNode: bays + 1 + i, role: 'vertical' });
      }
      for (let i = 0; i < bays; i++) {
        const leftHalf = i < bays / 2 && !isCantilever;
        if (leftHalf) {
          rawMembers.push({ id: mid++, startNode: i, endNode: bays + 2 + i, role: 'diagonal' });
        } else {
          rawMembers.push({
            id: mid++,
            startNode: bays + 1 + i,
            endNode: i + 1,
            role: 'diagonal',
          });
        }
      }
    }
  } else if (params.structureType === StructureType.SUSPENSION) {
    const segments = Math.max(6, Math.min(10, params.baysOrStories || 6));
    const pylonLeftIdx = 1;
    const pylonRightIdx = segments - 1;
    const sag = H * 0.72;

    for (let i = 0; i <= segments; i++) {
      rawNodes.push({
        id: i,
        label: `D${i + 1}`,
        x: (i / segments) * L,
        y: 0,
        support: i === 0 ? 'pin' : i === segments ? 'roller' : undefined,
      });
    }
    const cableOffset = segments + 1;
    for (let i = 1; i < segments; i++) {
      const x = (i / segments) * L;
      const u = (x - L / 2) / (0.3 * L || 1);
      const y =
        i === pylonLeftIdx || i === pylonRightIdx
          ? H
          : H - sag * (1 - Math.min(1, u * u));
      rawNodes.push({
        id: cableOffset + (i - 1),
        label: i === pylonLeftIdx || i === pylonRightIdx ? `P${i}` : `C${i}`,
        x,
        y,
      });
    }

    let mid = 0;
    for (let i = 0; i < segments; i++) {
      rawMembers.push({ id: mid++, startNode: i, endNode: i + 1, role: 'beam', areaScale: 1.4 });
    }
    rawMembers.push({
      id: mid++,
      startNode: pylonLeftIdx,
      endNode: cableOffset + (pylonLeftIdx - 1),
      role: 'pylon',
      areaScale: 2.0,
    });
    rawMembers.push({
      id: mid++,
      startNode: pylonRightIdx,
      endNode: cableOffset + (pylonRightIdx - 1),
      role: 'pylon',
      areaScale: 2.0,
    });
    rawMembers.push({ id: mid++, startNode: 0, endNode: cableOffset, role: 'cable', areaScale: 1.2 });
    rawMembers.push({
      id: mid++,
      startNode: segments,
      endNode: cableOffset + (segments - 2),
      role: 'cable',
      areaScale: 1.2,
    });
    for (let i = 1; i < segments - 1; i++) {
      rawMembers.push({
        id: mid++,
        startNode: cableOffset + (i - 1),
        endNode: cableOffset + i,
        role: 'cable',
        areaScale: 1.2,
      });
    }
    for (let i = 1; i < segments; i++) {
      if (i !== pylonLeftIdx && i !== pylonRightIdx) {
        rawMembers.push({
          id: mid++,
          startNode: i,
          endNode: cableOffset + (i - 1),
          role: 'vertical',
          areaScale: 0.7,
        });
      }
    }
  } else if (params.structureType === StructureType.TOWER) {
    const tiers = Math.max(3, Math.min(6, params.baysOrStories || 4));
    const baseW = L;
    const topW = Math.max(1.2, baseW * 0.24);

    for (let t = 0; t <= tiers; t++) {
      const frac = t / tiers;
      const halfW = (baseW * (1 - frac) + topW * frac) / 2;
      const y = frac * H;
      rawNodes.push({
        id: t * 2,
        label: `L${t + 1}`,
        x: baseW / 2 - halfW,
        y,
        support: t === 0 ? 'fixed' : undefined,
      });
      rawNodes.push({
        id: t * 2 + 1,
        label: `R${t + 1}`,
        x: baseW / 2 + halfW,
        y,
        support: t === 0 ? 'fixed' : undefined,
      });
    }

    const leftArmId = rawNodes.length;
    rawNodes.push({ id: leftArmId, label: 'Brazo A', x: baseW / 2 - topW * 1.6, y: H * 0.9 });
    const rightArmId = rawNodes.length;
    rawNodes.push({ id: rightArmId, label: 'Brazo B', x: baseW / 2 + topW * 1.6, y: H * 0.9 });

    let mid = 0;
    for (let t = 0; t < tiers; t++) {
      const bl = t * 2;
      const br = t * 2 + 1;
      const tl = (t + 1) * 2;
      const tr = (t + 1) * 2 + 1;
      rawMembers.push({ id: mid++, startNode: bl, endNode: tl, role: 'column', areaScale: 1.3 });
      rawMembers.push({ id: mid++, startNode: br, endNode: tr, role: 'column', areaScale: 1.3 });
      rawMembers.push({ id: mid++, startNode: tl, endNode: tr, role: 'chord' });
      rawMembers.push({ id: mid++, startNode: bl, endNode: tr, role: 'diagonal', areaScale: 0.75 });
      rawMembers.push({ id: mid++, startNode: br, endNode: tl, role: 'diagonal', areaScale: 0.75 });
    }
    const topL = tiers * 2;
    const topR = tiers * 2 + 1;
    const midL = (tiers - 1) * 2;
    const midR = (tiers - 1) * 2 + 1;
    rawMembers.push({ id: mid++, startNode: topL, endNode: leftArmId, role: 'beam', areaScale: 0.85 });
    rawMembers.push({ id: mid++, startNode: midL, endNode: leftArmId, role: 'diagonal', areaScale: 0.7 });
    rawMembers.push({ id: mid++, startNode: topR, endNode: rightArmId, role: 'beam', areaScale: 0.85 });
    rawMembers.push({ id: mid++, startNode: midR, endNode: rightArmId, role: 'diagonal', areaScale: 0.7 });
  } else {
    // BUILDING PORTAL FRAME
    const stories = Math.max(2, Math.min(5, params.baysOrStories || 3));
    const bays = 2;
    for (let s = 0; s <= stories; s++) {
      const y = (s / stories) * H;
      for (let b = 0; b <= bays; b++) {
        const x = (b / bays) * L;
        rawNodes.push({
          id: s * (bays + 1) + b,
          label: `P${s}-${b + 1}`,
          x,
          y,
          support: s === 0 ? 'fixed' : undefined,
        });
      }
    }

    let mid = 0;
    for (let s = 0; s < stories; s++) {
      for (let b = 0; b <= bays; b++) {
        rawMembers.push({
          id: mid++,
          startNode: s * (bays + 1) + b,
          endNode: (s + 1) * (bays + 1) + b,
          role: 'column',
          areaScale: 1.5,
        });
      }
      for (let b = 0; b < bays; b++) {
        rawMembers.push({
          id: mid++,
          startNode: (s + 1) * (bays + 1) + b,
          endNode: (s + 1) * (bays + 1) + b + 1,
          role: 'beam',
          areaScale: 1.2,
        });
      }
    }
  }

  // Geometry, Mass, Self-weight & Combined Loads
  const totalMemberLengthM = rawMembers.reduce((sum, m) => {
    const n1 = rawNodes[m.startNode];
    const n2 = rawNodes[m.endNode];
    return sum + Math.hypot(n2.x - n1.x, n2.y - n1.y);
  }, 0);

  const totalVolumeM3 = rawMembers.reduce((sum, m) => {
    const n1 = rawNodes[m.startNode];
    const n2 = rawNodes[m.endNode];
    const len = Math.hypot(n2.x - n1.x, n2.y - n1.y);
    return sum + len * areaM2 * (m.areaScale ?? 1);
  }, 0);

  const structuralMassKg = totalVolumeM3 * material.densityKgM3;
  const totalMassKg = structuralMassKg + params.additionalMassKg;
  const selfWeightKN = (structuralMassKg * params.gravityMs2) / 1000;
  const activeSelfWeightKN = params.includeSelfWeight ? selfWeightKN : 0;
  const distributedTotalKN = distLoadKNm * L;

  const gamma = Math.max(1, params.loadFactorGamma);
  const totalVerticalLoadKN =
    forceVerticalKN + additionalWeightKN + distributedTotalKN + activeSelfWeightKN;
  const factoredVerticalLoadKN = totalVerticalLoadKN * gamma;
  const totalHorizontalLoadKN = (windKN + forceHorizontalKN) * gamma;

  // Dynamic Center of Mass including additional mass position
  const cmX =
    (structuralMassKg * (L / 2) + params.additionalMassKg * xMass) /
    Math.max(1, totalMassKg);
  const cmY =
    (structuralMassKg * (H * 0.45) + params.additionalMassKg * (params.structureType === StructureType.SUSPENSION ? 0 : H * 0.85)) /
    Math.max(1, totalMassKg);

  // Static Equilibrium & Reactions (using factored design loads)
  const fyDesign = forceVerticalKN * gamma;
  const wAdicDesign = additionalWeightKN * gamma;
  const wUniformDesign = (distributedTotalKN + activeSelfWeightKN) * gamma;
  const fxDesign = forceHorizontalKN * gamma;
  const windDesign = windKN * gamma;

  let reactionAxKN = -totalHorizontalLoadKN;
  let reactionAKN = 0;
  let reactionBKN = 0;
  let fixedMomentAKNm = 0;
  let maxMomentKNm = 0;
  let maxShearKN = 0;

  if (
    params.supportCondition === SupportCondition.CANTILEVER &&
    params.structureType === StructureType.TRUSS
  ) {
    reactionAKN = factoredVerticalLoadKN;
    reactionBKN = 0;
    fixedMomentAKNm =
      fyDesign * xLoad +
      wAdicDesign * xMass +
      wUniformDesign * (L / 2) +
      windDesign * (H * 0.5) +
      fxDesign * H;
    maxMomentKNm = fixedMomentAKNm;
    maxShearKN = factoredVerticalLoadKN;
  } else if (params.structureType === StructureType.TOWER) {
    const overturningMoment =
      windDesign * (H * 0.78) +
      fxDesign * H +
      fyDesign * (loadFrac - 0.5) * L * 0.5 +
      wAdicDesign * (massFrac - 0.5) * L * 0.5;
    reactionAKN = factoredVerticalLoadKN / 2 - overturningMoment / L;
    reactionBKN = factoredVerticalLoadKN / 2 + overturningMoment / L;
    maxMomentKNm = Math.abs(overturningMoment);
    maxShearKN = Math.max(Math.abs(totalHorizontalLoadKN), Math.abs(reactionAKN), Math.abs(reactionBKN));
  } else {
    const horizMoment = windDesign * (H * 0.5) + fxDesign * H;
    reactionBKN =
      (fyDesign * xLoad + wAdicDesign * xMass + wUniformDesign * (L / 2) + horizMoment) / L;
    reactionAKN = factoredVerticalLoadKN - reactionBKN;
    const isFixed = params.supportCondition === SupportCondition.FIXED_BOTH;
    if (isFixed) {
      fixedMomentAKNm =
        (fyDesign * xLoad * Math.pow(L - xLoad, 2)) / (L * L) +
        (wAdicDesign * xMass * Math.pow(L - xMass, 2)) / (L * L) +
        (wUniformDesign * L) / 12;
    }
    const pointMoment = (fyDesign * xLoad * (L - xLoad)) / L;
    const massMoment = (wAdicDesign * xMass * (L - xMass)) / L;
    const distMoment = (wUniformDesign * L) / 8;
    maxMomentKNm = (pointMoment + massMoment + distMoment) * (isFixed ? 0.65 : 1);
    maxShearKN = Math.max(Math.abs(reactionAKN), Math.abs(reactionBKN));
  }

  // Thermal elongation and restrained thermal stress
  const thermalElongationMm = material.thermalCoeffPerC * L * params.temperatureDeltaC * 1000;
  const thermalStressMPa =
    params.supportCondition === SupportCondition.FIXED_BOTH
      ? material.elasticModulusGPa * 1000 * material.thermalCoeffPerC * Math.abs(params.temperatureDeltaC)
      : 0;

  let nodes: StructureNode[] = [];
  let members: StructureMember[] = [];
  let chartPoints: ChartPoint[] = [];
  let maxStressMPa = 0;
  let maxForceKN = 0;
  let maxDeflectionMm = 0;

  const distributePointLoadToTop = (
    topNodes: Array<{ id: number; x: number }>,
    targetX: number,
    fx: number,
    fy: number,
    nodalLoads: Array<{ nodeId: number; fxKN: number; fyKN: number }>
  ) => {
    if (topNodes.length === 0) return;
    let leftTop = topNodes[0];
    let rightTop = topNodes[topNodes.length - 1];
    for (let i = 0; i < topNodes.length - 1; i++) {
      if (targetX >= topNodes[i].x && targetX <= topNodes[i + 1].x) {
        leftTop = topNodes[i];
        rightTop = topNodes[i + 1];
        break;
      }
    }
    if (targetX <= topNodes[0].x) {
      nodalLoads.push({ nodeId: topNodes[0].id, fxKN: fx, fyKN: fy });
    } else if (targetX >= topNodes[topNodes.length - 1].x) {
      nodalLoads.push({ nodeId: topNodes[topNodes.length - 1].id, fxKN: fx, fyKN: fy });
    } else {
      const spanTop = rightTop.x - leftTop.x || 1;
      const wRight = (targetX - leftTop.x) / spanTop;
      nodalLoads.push({ nodeId: leftTop.id, fxKN: fx * (1 - wRight), fyKN: fy * (1 - wRight) });
      nodalLoads.push({ nodeId: rightTop.id, fxKN: fx * wRight, fyKN: fy * wRight });
    }
  };

  if (params.structureType === StructureType.TRUSS) {
    const topNodes = rawNodes.filter((n) => n.y > 0);
    const nodalLoads: Array<{ nodeId: number; fxKN: number; fyKN: number }> = [];

    // Applied force F (x & y components) at xLoad
    distributePointLoadToTop(topNodes, xLoad, fxDesign, -fyDesign, nodalLoads);
    // Additional mass weight W_adic at xMass
    if (wAdicDesign > 0) {
      distributePointLoadToTop(topNodes, xMass, 0, -wAdicDesign, nodalLoads);
    }

    if (wUniformDesign > 0) {
      const perTop = wUniformDesign / topNodes.length;
      for (const tn of topNodes) {
        nodalLoads.push({ nodeId: tn.id, fxKN: 0, fyKN: -perTop });
      }
    }

    if (windDesign > 0) {
      nodalLoads.push({ nodeId: topNodes[0].id, fxKN: windDesign, fyKN: 0 });
    }

    const fem = solve2DTrussFEM(rawNodes, rawMembers, nodalLoads, material, params.sectionAreaCm2);
    members = fem.members;
    const deflectionScale = params.supportCondition === SupportCondition.FIXED_BOTH ? 0.65 : 1;

    nodes = rawNodes.map((n, idx) => ({
      ...n,
      dxMm: fem.displacements[idx].dxM * 1000 * deflectionScale,
      dyMm: fem.displacements[idx].dyM * 1000 * deflectionScale,
      hasLoad: nodalLoads.some((nl) => nl.nodeId === n.id && Math.abs(nl.fyKN) > 0.01),
    }));

    const bottomNodes = nodes.filter((n) => n.y === 0);
    maxStressMPa = Math.max(...members.map((m) => m.stressMPa), 0.01) + thermalStressMPa;
    maxForceKN = Math.max(...members.map((m) => Math.abs(m.axialForceKN)), loadKN);
    maxDeflectionMm = Math.max(...nodes.map((n) => Math.hypot(n.dxMm, n.dyMm)), 0.01);

    chartPoints = bottomNodes.map((n, i) => {
      const connectedStress =
        members
          .filter((m) => m.startNode === n.id || m.endNode === n.id)
          .reduce((mx, m) => Math.max(mx, m.stressMPa), 0) + thermalStressMPa;
      const localMoment =
        params.supportCondition === SupportCondition.CANTILEVER
          ? Math.max(0, fixedMomentAKNm - reactionAKN * n.x + (wUniformDesign / L) * (n.x * n.x) / 2)
          : n.x <= xLoad
            ? reactionAKN * n.x - (wUniformDesign / L) * (n.x * n.x) / 2
            : reactionBKN * (L - n.x) - (wUniformDesign / L) * Math.pow(L - n.x, 2) / 2;

      return {
        index: i + 1,
        positionLabel: `${n.x.toFixed(1)}m`,
        positionM: n.x,
        forceKN: Math.max(0, Math.abs(localMoment) / H),
        stressMPa: connectedStress,
        deflectionMm: Math.abs(n.dyMm),
      };
    });
  } else if (params.structureType === StructureType.SUSPENSION) {
    const segments = Math.max(6, Math.min(10, params.baysOrStories || 6));
    const sag = H * 0.72;
    const horizCableTensionKN =
      (wUniformDesign * L) / (8 * sag) +
      (fyDesign * xLoad * (L - xLoad)) / (L * sag) +
      (wAdicDesign * xMass * (L - xMass)) / (L * sag);
    const maxCableTensionKN = Math.hypot(
      horizCableTensionKN,
      Math.max(Math.abs(reactionAKN), Math.abs(reactionBKN))
    );
    const cableAreaCm2 = params.sectionAreaCm2 * 1.2;
    maxStressMPa = (maxCableTensionKN * 10) / cableAreaCm2 + thermalStressMPa;
    maxForceKN = maxCableTensionKN;
    maxDeflectionMm =
      (((fyDesign + wAdicDesign + wUniformDesign * 0.625) * Math.pow(L * 0.6, 3)) /
        (48 * E_kPa * (inertiaM4 || areaM2 * Math.pow(H * 0.35, 2)))) *
      1000 *
      0.18;

    nodes = rawNodes.map((n) => {
      const distRatio = Math.sin((Math.PI * Math.min(L, Math.max(0, n.x))) / L);
      const dyMm = n.support ? 0 : -maxDeflectionMm * distRatio;
      const dxMm = n.support ? 0 : (totalHorizontalLoadKN / (E_kPa * areaM2)) * H * 800;
      return {
        ...n,
        dxMm,
        dyMm,
        hasLoad: Math.abs(n.x - xLoad) <= L / segments && n.y === 0,
      };
    });

    members = rawMembers.map((m) => {
      const n1 = rawNodes[m.startNode];
      const n2 = rawNodes[m.endNode];
      const len = Math.hypot(n2.x - n1.x, n2.y - n1.y);
      let force = horizCableTensionKN * 0.65;
      if (m.role === 'cable') force = maxCableTensionKN;
      if (m.role === 'pylon') force = -Math.max(reactionAKN, reactionBKN) * 1.15;
      if (m.role === 'vertical') force = factoredVerticalLoadKN / (segments - 2);
      if (m.role === 'beam') force = -horizCableTensionKN * 0.35;
      const stress =
        (Math.abs(force) * 10) / (params.sectionAreaCm2 * (m.areaScale ?? 1)) + thermalStressMPa;
      return {
        id: m.id,
        startNode: m.startNode,
        endNode: m.endNode,
        role: m.role,
        lengthM: len,
        axialForceKN: force,
        stressMPa: stress,
        utilization: stress / material.yieldStrengthMPa,
      };
    });

    chartPoints = Array.from({ length: segments + 1 }, (_, i) => {
      const x = (i / segments) * L;
      const shape = Math.sin((Math.PI * x) / L);
      return {
        index: i + 1,
        positionLabel: `${x.toFixed(1)}m`,
        positionM: x,
        forceKN: horizCableTensionKN * (0.6 + 0.4 * shape),
        stressMPa: maxStressMPa * (0.45 + 0.55 * shape),
        deflectionMm: maxDeflectionMm * shape,
      };
    });
  } else if (params.structureType === StructureType.TOWER) {
    const tiers = Math.max(3, Math.min(6, params.baysOrStories || 4));
    const legCompressionKN = Math.max(Math.abs(reactionAKN), Math.abs(reactionBKN)) * 1.05;
    const legAreaCm2 = params.sectionAreaCm2 * 1.3;
    maxStressMPa = (legCompressionKN * 10) / legAreaCm2 + thermalStressMPa;
    maxForceKN = legCompressionKN;

    const tipSwayMm =
      (((Math.abs(totalHorizontalLoadKN) + (fyDesign + wAdicDesign) * 0.04) * Math.pow(H, 3)) /
        (3 * E_kPa * (areaM2 * 1.3 * Math.pow(L * 0.45, 2)))) *
      1000;
    maxDeflectionMm = Math.max(0.05, tipSwayMm);

    nodes = rawNodes.map((n) => {
      const hFrac = n.y / H;
      return {
        ...n,
        dxMm: maxDeflectionMm * Math.pow(hFrac, 2),
        dyMm: ((-hFrac * (legCompressionKN * H)) / (E_kPa * areaM2 * 1.3)) * 1000,
        hasLoad: n.label.startsWith('Brazo'),
      };
    });

    members = rawMembers.map((m) => {
      const n1 = rawNodes[m.startNode];
      const n2 = rawNodes[m.endNode];
      const len = Math.hypot(n2.x - n1.x, n2.y - n1.y);
      const isCol = m.role === 'column';
      const force = isCol
        ? -legCompressionKN * 0.92
        : m.role === 'diagonal'
          ? Math.abs(totalHorizontalLoadKN) + factoredVerticalLoadKN * 0.1
          : -factoredVerticalLoadKN * 0.22;
      const stress =
        (Math.abs(force) * 10) / (params.sectionAreaCm2 * (m.areaScale ?? 1)) + thermalStressMPa;
      return {
        id: m.id,
        startNode: m.startNode,
        endNode: m.endNode,
        role: m.role,
        lengthM: len,
        axialForceKN: force,
        stressMPa: stress,
        utilization: stress / material.yieldStrengthMPa,
      };
    });

    chartPoints = Array.from({ length: tiers + 1 }, (_, t) => {
      const h = (t / tiers) * H;
      const taperFactor = 1 - 0.35 * (t / tiers);
      return {
        index: t + 1,
        positionLabel: `${h.toFixed(1)}m`,
        positionM: h,
        forceKN: legCompressionKN * taperFactor,
        stressMPa: maxStressMPa * taperFactor,
        deflectionMm: maxDeflectionMm * Math.pow(t / tiers, 2),
      };
    });
  } else {
    // BUILDING PORTAL FRAME
    const stories = Math.max(2, Math.min(5, params.baysOrStories || 3));
    const bays = 2;
    const baySpan = L / bays;
    const beamMomentKNm =
      ((fyDesign + wAdicDesign) * baySpan) / 4 + (wUniformDesign * baySpan) / 16;
    const c_approx = Math.pow(12 * inertiaM4, 0.25) / 2;
    const bendingStressMPa = ((beamMomentKNm * c_approx) / inertiaM4) / 1000;
    const axialColStressMPa =
      (Math.max(Math.abs(reactionAKN), Math.abs(reactionBKN)) * 10) / (params.sectionAreaCm2 * 1.5);

    maxStressMPa = Math.max(bendingStressMPa, axialColStressMPa) + thermalStressMPa;
    maxForceKN = Math.max(Math.abs(reactionAKN), Math.abs(reactionBKN));

    const vertDeflMm =
      (((fyDesign + wAdicDesign + wUniformDesign * 0.625) * Math.pow(baySpan, 3)) /
        (48 * E_kPa * (inertiaM4 || 0.00018))) *
      1000;
    const lateralDriftMm =
      ((Math.abs(totalHorizontalLoadKN) * Math.pow(H, 3)) / (12 * E_kPa * (inertiaM4 || 0.00018) * 3)) * 1000;
    maxDeflectionMm = Math.max(0.05, Math.hypot(vertDeflMm, lateralDriftMm));

    nodes = rawNodes.map((n) => {
      const isTopLoad = n.y === H && Math.abs(n.x - xLoad) <= baySpan * 0.6;
      return {
        ...n,
        dxMm: lateralDriftMm * (n.y / H),
        dyMm: n.y === 0 ? 0 : -vertDeflMm * (n.y / H) * 0.5,
        hasLoad: isTopLoad,
      };
    });

    members = rawMembers.map((m) => {
      const n1 = rawNodes[m.startNode];
      const n2 = rawNodes[m.endNode];
      const len = Math.hypot(n2.x - n1.x, n2.y - n1.y);
      const force =
        m.role === 'column'
          ? -(factoredVerticalLoadKN / (bays + 1)) * 1.15
          : factoredVerticalLoadKN * 0.42;
      const stress =
        (m.role === 'beam'
          ? maxStressMPa * 0.94
          : (Math.abs(force) * 10) / (params.sectionAreaCm2 * 1.5)) + thermalStressMPa;
      return {
        id: m.id,
        startNode: m.startNode,
        endNode: m.endNode,
        role: m.role,
        lengthM: len,
        axialForceKN: force,
        stressMPa: stress,
        utilization: stress / material.yieldStrengthMPa,
      };
    });

    chartPoints = Array.from({ length: stories + 1 }, (_, s) => {
      const y = (s / stories) * H;
      const factor = 1 - 0.42 * (s / stories);
      return {
        index: s + 1,
        positionLabel: `N${s}`,
        positionM: y,
        forceKN: factoredVerticalLoadKN * factor,
        stressMPa: maxStressMPa * factor,
        deflectionMm: maxDeflectionMm * (s / stories),
      };
    });
  }

  // Euler Buckling check across compressed members using K factor
  const compressedMembers = members.filter((m) => m.axialForceKN < -0.01);
  const longestCompLenM =
    compressedMembers.length > 0
      ? Math.max(...compressedMembers.map((m) => m.lengthM))
      : Math.max(...members.map((m) => m.lengthM), 2);
  const maxCompressionKN =
    compressedMembers.length > 0
      ? Math.max(...compressedMembers.map((m) => Math.abs(m.axialForceKN)))
      : 0;

  const effectiveLengthM = Math.max(0.5, params.effectiveLengthK * longestCompLenM);
  const eulerCriticalLoadKN = (Math.PI * Math.PI * E_kPa * inertiaM4) / Math.pow(effectiveLengthM, 2);
  const bucklingSafetyFactor =
    maxCompressionKN > 0.01 ? eulerCriticalLoadKN / maxCompressionKN : 999;

  const yieldSafetyFactor = material.yieldStrengthMPa / Math.max(0.01, maxStressMPa);
  const safetyFactor = Math.min(yieldSafetyFactor, bucklingSafetyFactor);

  const allowableDeflectionMm = (L * 1000) / 360;
  const defRatio = Math.round((L * 1000) / Math.max(0.01, maxDeflectionMm));
  const deflectionRatioText = defRatio > 99999 ? 'L / >99999' : `L / ${defRatio}`;

  const netTorque =
    params.supportCondition === SupportCondition.CANTILEVER
      ? fixedMomentAKNm
      : Math.abs(
          reactionBKN * L -
            (fyDesign * xLoad +
              wAdicDesign * xMass +
              wUniformDesign * (L / 2) +
              windDesign * (H * 0.5) +
              fxDesign * H)
        );

  const stab = classifyStability(
    safetyFactor,
    params,
    material,
    bucklingSafetyFactor,
    maxDeflectionMm,
    allowableDeflectionMm
  );

  const calculationSteps = buildCalculationSteps({
    params,
    material,
    L,
    H,
    xLoad,
    xMass,
    loadKN,
    forceVerticalKN,
    forceHorizontalKN,
    additionalWeightKN,
    distLoadKNm,
    distributedTotalKN,
    windKN,
    totalMemberLengthM,
    structuralMassKg,
    totalMassKg,
    selfWeightKN,
    totalVerticalLoadKN,
    factoredVerticalLoadKN,
    totalHorizontalLoadKN,
    reactionAxKN,
    reactionAKN,
    reactionBKN,
    fixedMomentAKNm,
    maxShearKN,
    maxMomentKNm,
    maxStressMPa,
    thermalElongationMm,
    thermalStressMPa,
    maxCompressionKN,
    eulerCriticalLoadKN,
    bucklingSafetyFactor,
    yieldSafetyFactor,
    maxDeflectionMm,
    allowableDeflectionMm,
    safetyFactor,
  });

  return {
    params,
    loadKN,
    forceVerticalKN,
    forceHorizontalKN,
    additionalWeightKN,
    distributedTotalKN,
    windKN,
    totalMemberLengthM,
    structuralMassKg,
    totalMassKg,
    selfWeightKN,
    totalVerticalLoadKN,
    factoredVerticalLoadKN,
    totalHorizontalLoadKN,
    reactionAxKN,
    reactionAKN,
    reactionBKN,
    fixedMomentAKNm,
    maxShearKN,
    maxMomentKNm,
    maxForceKN,
    maxCompressionKN,
    eulerCriticalLoadKN,
    bucklingSafetyFactor,
    yieldSafetyFactor,
    thermalElongationMm,
    maxStressMPa,
    maxDeflectionMm,
    allowableDeflectionMm,
    deflectionRatioText,
    axialStiffnessMN,
    totalTorqueKNm: netTorque < 0.01 ? 0 : netTorque,
    centerOfMass: { x: cmX, y: cmY },
    safetyFactor,
    ...stab,
    calculationSteps,
    nodes,
    members,
    chartPoints,
    computedAt: new Date().toISOString(),
  };
}
