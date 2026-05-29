export type ChecklistEntry = {
  presente: boolean;
  emsp: boolean;
};

export type ScoreEntry = {
  padre: number | null;
  nino: number | null;
  sumario: number | null;
};

type ChecklistItem = {
  key: string;
  label: string;
};

type ChecklistGroup = {
  title: string;
  items: readonly ChecklistItem[];
};

type ScoreItem = {
  key: string;
  title: string;
  includeInTotal: boolean;
};

export const scaleDescriptions = [
  {
    value: 0,
    label: "0",
    description: "Sin sintomas o impacto muy leve.",
  },
  {
    value: 1,
    label: "1",
    description: "Molestia leve, presente solo en ciertos momentos.",
  },
  {
    value: 2,
    label: "2",
    description: "Interferencia moderada o dificultad clara.",
  },
  {
    value: 3,
    label: "3",
    description: "Interferencia importante, frecuente o persistente.",
  },
  {
    value: 4,
    label: "4",
    description: "Maxima severidad, casi constante o muy incapacitante.",
  },
] as const;

export const obsessionChecklistGroups = [
  {
    title: "Contaminacion",
    items: [
      { key: "suciedad_germenes", label: "Suciedad / gérmenes" },
      { key: "desechos_secreciones", label: "Desechos / secreciones" },
      { key: "contaminantes_ambientales", label: "Contaminantes ambientales" },
      { key: "articulos_limpieza", label: "Artículos de limpieza" },
      { key: "animales", label: "Animales" },
      { key: "sustancias_pegajosas", label: "Sustancias pegajosas" },
      { key: "contaminantes_enfermen", label: "Contaminantes que enfermen" },
      { key: "enfermar_a_otros", label: "Enfermar a otros" },
      { key: "consecuencias_contaminacion", label: "Consecuencias de la contaminación" },
    ],
  },
  {
    title: "Agresion",
    items: [
      { key: "lastimarse_mismo", label: "Lastimarse a si mismo" },
      { key: "lastimar_demas", label: "Lastimar a los demas" },
      { key: "dano_venga_a_el", label: "Dano que venga a el" },
      { key: "dano_por_accion_omision", label: "Dano por accion u omision" },
      { key: "imagenes_violentas", label: "Imagenes violentas" },
      { key: "obscenidades_insultos", label: "Obscenidades o insultos" },
      { key: "algo_vergonzoso", label: "Algo vergonzoso" },
      { key: "impulsos_indeseables", label: "Impulsos indeseables" },
      { key: "robarse_cosas", label: "Robarse cosas" },
      { key: "responsable_algo_terrible", label: "Responsable de algo terrible" },
    ],
  },
  {
    title: "Sexuales",
    items: [
      { key: "pensamientos_sexuales_prohibidos", label: "Pensamientos sexuales prohibidos" },
      { key: "homosexualidad", label: "Homosexualidad" },
      { key: "conducta_sexual_agresiva", label: "Conducta sexual agresiva" },
    ],
  },
  {
    title: "Atesorar",
    items: [{ key: "guardar_coleccionar", label: "Guardar / coleccionar" }],
  },
  {
    title: "Magicos",
    items: [{ key: "numeros_colores_magicos", label: "Numeros o colores magicos" }],
  },
  {
    title: "Somaticas",
    items: [
      { key: "preocupacion_enfermedades", label: "Preocupacion por enfermedades" },
      { key: "dismorfofobia", label: "Dismorfofobia" },
    ],
  },
  {
    title: "Religiosas",
    items: [
      { key: "ofender_dios", label: "Ofender a Dios" },
      { key: "bueno_malo_moralidad", label: "Bueno / malo / moralidad" },
    ],
  },
  {
    title: "Varias",
    items: [
      { key: "necesidad_saber_recordar", label: "Necesidad de saber / recordar" },
      { key: "temor_decir_cosas", label: "Temor a decir cosas" },
      { key: "temor_no_decir_correctamente", label: "Temor a no decirlo correctamente" },
      { key: "imagenes_intrusivas", label: "Imagenes intrusivas" },
      { key: "sonidos_palabras_musica", label: "Sonidos, palabras o musica" },
      { key: "simetria_exactitud", label: "Simetria / exactitud" },
    ],
  },
] as const satisfies readonly ChecklistGroup[];

export const compulsionsChecklistGroups = [
  {
    title: "Limpieza / Lavado",
    items: [
      { key: "lavado_manos", label: "Lavado de manos" },
      { key: "bano_arreglo_personal", label: "Bano / arreglo personal" },
      { key: "limpieza_objetos", label: "Limpieza de objetos" },
      { key: "prevenir_contacto_contaminantes", label: "Prevenir contacto con contaminantes" },
    ],
  },
  {
    title: "Revisar",
    items: [
      { key: "revisar_cerraduras_objetos", label: "Revisar cerraduras u objetos" },
      { key: "revisar_lavado_vestido", label: "Revisar lavado o vestido" },
      { key: "revisar_dano_a_otros", label: "Revisar dano a otros" },
      { key: "revisar_dano_a_si_mismo", label: "Revisar dano a si mismo" },
      { key: "revisar_nada_terrible", label: "Revisar que nada terrible pase" },
      { key: "revisar_errores", label: "Revisar errores" },
      { key: "chequeo_somatico", label: "Chequeo somatico" },
    ],
  },
  {
    title: "Repeticion",
    items: [
      { key: "releer_borrar_reescribir", label: "Releer, borrar o reescribir" },
      { key: "repetir_actividades_rutinarias", label: "Repetir actividades rutinarias" },
    ],
  },
  {
    title: "Contar",
    items: [{ key: "contar_objetos_numeros", label: "Contar objetos o numeros" }],
  },
  {
    title: "Ordenar",
    items: [{ key: "ordenar_simetria", label: "Ordenar / simetria" }],
  },
  {
    title: "Guardar",
    items: [{ key: "dificultad_tirar_cosas", label: "Dificultad para tirar cosas" }],
  },
  {
    title: "Juegos magicos",
    items: [{ key: "juegos_magicos_supersticiosos", label: "Juegos magicos / supersticiosos" }],
  },
  {
    title: "Rituales con otros",
    items: [{ key: "rituales_involucrando_otros", label: "Rituales involucrando a otros" }],
  },
  {
    title: "Varias",
    items: [
      { key: "rituales_mentales", label: "Rituales mentales" },
      { key: "necesidad_decir_preguntar_confesar", label: "Necesidad de decir / preguntar / confesar" },
      { key: "prevenir_dano", label: "Prevenir dano" },
      { key: "conductas_ritualizadas_comer", label: "Conductas ritualizadas al comer" },
      { key: "hacer_listas", label: "Hacer listas" },
      { key: "necesidad_tocar_frotar", label: "Necesidad de tocar / frotar" },
      { key: "hacer_hasta_bien", label: "Hacer hasta que quede bien" },
      { key: "parpadeo_fijar_mirada", label: "Parpadeo / fijar la mirada" },
      { key: "tricotilomania", label: "Tricotilomania" },
      { key: "autodano", label: "Autodano" },
    ],
  },
] as const satisfies readonly ChecklistGroup[];

export const scoreItemsObsesiones = [
  { key: "item1a", title: "Tiempo ocupado por pensamientos obsesivos", includeInTotal: true },
  { key: "item1b", title: "Intervalos libres de obsesiones", includeInTotal: false },
  { key: "item2", title: "Interferencia debida a pensamientos obsesivos", includeInTotal: true },
  { key: "item3", title: "Malestar asociado a pensamientos obsesivos", includeInTotal: true },
  { key: "item4", title: "Resistencia contra las obsesiones", includeInTotal: true },
  { key: "item5", title: "Grado de control sobre los pensamientos obsesivos", includeInTotal: true },
] as const satisfies readonly ScoreItem[];

export const scoreItemsCompulsiones = [
  { key: "item6a", title: "Tiempo ocupado en conductas compulsivas", includeInTotal: true },
  { key: "item6b", title: "Intervalos libres de compulsiones", includeInTotal: false },
  { key: "item7", title: "Interferencia debida a conductas compulsivas", includeInTotal: true },
  { key: "item8", title: "Malestar asociado a conducta compulsiva", includeInTotal: true },
  { key: "item9", title: "Resistencia en contra de las compulsiones", includeInTotal: true },
  { key: "item10", title: "Grado de control sobre las conductas compulsivas", includeInTotal: true },
] as const satisfies readonly ScoreItem[];

export type ObsessionChecklistKey = (typeof obsessionChecklistGroups)[number]["items"][number]["key"];
export type CompulsionChecklistKey = (typeof compulsionsChecklistGroups)[number]["items"][number]["key"];
export type ScoreObsessionKey = (typeof scoreItemsObsesiones)[number]["key"];
export type ScoreCompulsionKey = (typeof scoreItemsCompulsiones)[number]["key"];

export type FormularioState = {
  paciente: {
    nombrePaciente: string;
    nombreEvaluador: string;
    fecha: string;
    lugar: string;
    edad: string;
    expediente: string;
  };
  obsesionesChecklist: Record<ObsessionChecklistKey, ChecklistEntry>;
  compulsionesChecklist: Record<CompulsionChecklistKey, ChecklistEntry>;
  puntuacionesObsesiones: Record<ScoreObsessionKey, ScoreEntry>;
  puntuacionesCompulsiones: Record<ScoreCompulsionKey, ScoreEntry>;
};

function collectChecklistKeys(groups: readonly ChecklistGroup[]) {
  return groups.flatMap((group) => group.items.map((item) => item.key));
}

function createChecklistState<T extends readonly ChecklistGroup[]>(groups: T) {
  return Object.fromEntries(
    collectChecklistKeys(groups).map((key) => [
      key,
      { presente: false, emsp: false },
    ]),
  ) as Record<T[number]["items"][number]["key"], ChecklistEntry>;
}

function createScoreState<T extends readonly ScoreItem[]>(items: T) {
  return Object.fromEntries(
    items.map((item) => [
      item.key,
      { padre: null, nino: null, sumario: null },
    ]),
  ) as Record<T[number]["key"], ScoreEntry>;
}

export function createInitialFormularioState(): FormularioState {
  return {
    paciente: {
      nombrePaciente: "",
      nombreEvaluador: "",
      fecha: "",
      lugar: "",
      edad: "",
      expediente: "",
    },
    obsesionesChecklist: createChecklistState(obsessionChecklistGroups),
    compulsionesChecklist: createChecklistState(compulsionsChecklistGroups),
    puntuacionesObsesiones: createScoreState(scoreItemsObsesiones),
    puntuacionesCompulsiones: createScoreState(scoreItemsCompulsiones),
  };
}

function checklistHeaders(groups: readonly ChecklistGroup[]) {
  return collectChecklistKeys(groups).flatMap((key) => [`${key}_presente`, `${key}_emsp`]);
}

function scoreHeaders(items: readonly ScoreItem[]) {
  return items.flatMap((item) => [`${item.key}_padre`, `${item.key}_nino`, `${item.key}_sumario`]);
}

export function getObsessionChecklistHeaders() {
  return ["timestamp", "nombrePaciente", "expediente", ...checklistHeaders(obsessionChecklistGroups)];
}

export function getCompulsionChecklistHeaders() {
  return ["timestamp", "nombrePaciente", "expediente", ...checklistHeaders(compulsionsChecklistGroups)];
}

export function getScoreHeaders() {
  return [
    "timestamp",
    "nombrePaciente",
    "expediente",
    ...scoreHeaders(scoreItemsObsesiones),
    ...scoreHeaders(scoreItemsCompulsiones),
    "total_obsesiones",
    "total_compulsiones",
    "total_general",
  ];
}

function toSheetBoolean(value: boolean) {
  return value ? "Sí" : "No";
}

function toSheetNumber(value: number | null) {
  return value === null ? "" : value;
}

function sumIncludedScores(items: readonly ScoreItem[], scores: Record<string, ScoreEntry>) {
  return items.reduce((total, item) => {
    if (!item.includeInTotal) {
      return total;
    }

    const value = scores[item.key]?.sumario;
    return total + (typeof value === "number" ? value : 0);
  }, 0);
}

export function buildObsessionChecklistRow(
  formData: FormularioState,
  timestamp: string,
) {
  return [
    timestamp,
    formData.paciente.nombrePaciente,
    formData.paciente.expediente,
    ...collectChecklistKeys(obsessionChecklistGroups).flatMap((key) => {
      const entry = formData.obsesionesChecklist[key as ObsessionChecklistKey];
      return [toSheetBoolean(entry.presente), toSheetBoolean(entry.emsp)];
    }),
  ];
}

export function buildCompulsionChecklistRow(
  formData: FormularioState,
  timestamp: string,
) {
  return [
    timestamp,
    formData.paciente.nombrePaciente,
    formData.paciente.expediente,
    ...collectChecklistKeys(compulsionsChecklistGroups).flatMap((key) => {
      const entry = formData.compulsionesChecklist[key as CompulsionChecklistKey];
      return [toSheetBoolean(entry.presente), toSheetBoolean(entry.emsp)];
    }),
  ];
}

export function buildScoreRow(formData: FormularioState, timestamp: string) {
  const obsessionTotal = sumIncludedScores(scoreItemsObsesiones, formData.puntuacionesObsesiones);
  const compulsionTotal = sumIncludedScores(
    scoreItemsCompulsiones,
    formData.puntuacionesCompulsiones,
  );

  const scoreCells = [
    ...scoreItemsObsesiones.flatMap((item) => {
      const entry = formData.puntuacionesObsesiones[item.key];
      return [toSheetNumber(entry.padre), toSheetNumber(entry.nino), toSheetNumber(entry.sumario)];
    }),
    ...scoreItemsCompulsiones.flatMap((item) => {
      const entry = formData.puntuacionesCompulsiones[item.key];
      return [toSheetNumber(entry.padre), toSheetNumber(entry.nino), toSheetNumber(entry.sumario)];
    }),
  ];

  return [
    timestamp,
    formData.paciente.nombrePaciente,
    formData.paciente.expediente,
    ...scoreCells,
    obsessionTotal,
    compulsionTotal,
    obsessionTotal + compulsionTotal,
  ];
}

export function calculateScoreTotals(formData: FormularioState) {
  const totalObsesiones = sumIncludedScores(scoreItemsObsesiones, formData.puntuacionesObsesiones);
  const totalCompulsiones = sumIncludedScores(
    scoreItemsCompulsiones,
    formData.puntuacionesCompulsiones,
  );

  return {
    totalObsesiones,
    totalCompulsiones,
    totalGeneral: totalObsesiones + totalCompulsiones,
  };
}

export function getChecklistGroups(kind: "obsesiones" | "compulsiones") {
  return kind === "obsesiones" ? obsessionChecklistGroups : compulsionsChecklistGroups;
}

export function getObsessionChecklistItems() {
  const items: { key: string; label: string }[] = [];

  for (const group of obsessionChecklistGroups) {
    for (const item of group.items) {
      items.push(item);
    }
  }

  return items as readonly { key: string; label: string }[];
}

export function getCompulsionChecklistItems() {
  const items: { key: string; label: string }[] = [];

  for (const group of compulsionsChecklistGroups) {
    for (const item of group.items) {
      items.push(item);
    }
  }

  return items as readonly { key: string; label: string }[];
}

export function getScoreItems(kind: "obsesiones" | "compulsiones") {
  return kind === "obsesiones" ? scoreItemsObsesiones : scoreItemsCompulsiones;
}
