"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  calculateScoreTotals,
  createInitialFormularioState,
  getCompulsionChecklistItems,
  getChecklistGroups,
  getObsessionChecklistItems,
  scoreItemsCompulsiones,
  scoreItemsObsesiones,
  scaleDescriptions,
  type ChecklistEntry,
  type FormularioState,
  type ScoreEntry,
} from "./formulario-data";

const steps = [
  "Datos del paciente",
  "Obsesiones - Checklist",
  "Compulsiones - Checklist",
  "Evaluación de obsesiones",
  "Evaluación de compulsiones",
  "Confirmación",
] as const;

const obsessionSummaryItems = getObsessionChecklistItems();
const compulsionSummaryItems = getCompulsionChecklistItems();

type SubmissionState =
  | { status: "idle"; message: ""; detail: "" }
  | { status: "loading"; message: string; detail: string }
  | { status: "success"; message: string; detail: string }
  | { status: "error"; message: string; detail: string };

const initialSubmissionState: SubmissionState = {
  status: "idle",
  message: "",
  detail: "",
};

function StepChip({
  index,
  active,
  label,
}: {
  index: number;
  active: boolean;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/15"
          : "border-slate-200 bg-white/80 text-slate-600"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
          active ? "bg-white text-slate-900" : "bg-slate-100 text-slate-700"
        }`}
      >
        {index + 1}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-[0.2em] opacity-70">
          Paso {index + 1}
        </div>
        <div className="truncate text-sm font-semibold">{label}</div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function FieldLabel({
  label,
  htmlFor,
  hint,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {hint ? <span className="ml-2 text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function ScoreScaleLegend() {
  return (
    <details className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
      <summary className="cursor-pointer font-medium text-slate-800">
        Ver descripciones de la escala 0-4
      </summary>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {scaleDescriptions.map((item) => (
          <div key={item.value} className="rounded-xl bg-white px-3 py-2 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{item.label}</div>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </details>
  );
}

function ChecklistGroupTable({
  title,
  items,
  values,
  onChange,
}: {
  title: string;
  items: readonly { key: string; label: string }[];
  values: Record<string, ChecklistEntry>;
  onChange: (key: string, field: keyof ChecklistEntry, checked: boolean) => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="divide-y divide-slate-200">
        {items.map((item) => {
          const entry = values[item.key] ?? { presente: false, emsp: false };

          return (
            <div
              key={item.key}
              className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1fr)_140px_140px]"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">Clave: {item.key}</p>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <input
                  type="checkbox"
                  checked={entry.presente}
                  onChange={(event) => onChange(item.key, "presente", event.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                Presente
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={entry.emsp}
                  onChange={(event) => onChange(item.key, "emsp", event.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                EMSP
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ScoreItemCard({
  itemKey,
  title,
  includeInTotal,
  value,
  onChange,
}: {
  itemKey: string;
  title: string;
  includeInTotal: boolean;
  value: ScoreEntry;
  onChange: (key: string, field: keyof ScoreEntry, nextValue: number | null) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        {!includeInTotal ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
            No se incluye en el puntaje total
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-slate-500">Clave: {itemKey}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          ["padre", "Padre"],
          ["nino", "Niño"],
          ["sumario", "Sumario"],
        ].map(([field, label]) => (
          <label key={field} className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
            <select
              value={value[field as keyof ScoreEntry] ?? ""}
              onChange={(event) =>
                onChange(
                  itemKey,
                  field as keyof ScoreEntry,
                  event.target.value === "" ? null : Number(event.target.value),
                )
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">Selecciona</option>
              {scaleDescriptions.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <details className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-800">
          Ver descripciones de la escala
        </summary>
        <div className="mt-3 grid gap-2">
          {scaleDescriptions.map((level) => (
            <div key={level.value} className="rounded-xl bg-slate-50 px-3 py-2">
              <div className="font-semibold text-slate-900">{level.value}</div>
              <p>{level.description}</p>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

function SummaryList({
  title,
  items,
  values,
  badge,
}: {
  title: string;
  items: readonly { key: string; label: string }[];
  values: Record<string, ChecklistEntry>;
  badge?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        {badge ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2">
        {items.map((item) => {
          const entry = values[item.key] ?? { presente: false, emsp: false };

          return (
            <div
              key={item.key}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"
            >
              <div>
                <div className="font-medium text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-500">{item.key}</div>
              </div>
              <div className="flex gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.presente ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                  Presente: {entry.presente ? "Sí" : "No"}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.emsp ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                  EMSP: {entry.emsp ? "Sí" : "No"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ScoreSummary({
  title,
  items,
  values,
  includeNote,
}: {
  title: string;
  items: readonly { key: string; title: string; includeInTotal: boolean }[];
  values: Record<string, ScoreEntry>;
  includeNote: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
          {includeNote}
        </span>
      </div>
      <div className="mt-3 grid gap-3">
        {items.map((item) => {
          const entry = values[item.key] ?? { padre: null, nino: null, sumario: null };

          return (
            <div key={item.key} className="rounded-xl bg-slate-50 px-3 py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.key}</div>
                </div>
                {!item.includeInTotal ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                    No se incluye en el puntaje total
                  </span>
                ) : null}
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                <div className="rounded-lg bg-white px-3 py-2">Padre: {entry.padre ?? "-"}</div>
                <div className="rounded-lg bg-white px-3 py-2">Niño: {entry.nino ?? "-"}</div>
                <div className="rounded-lg bg-white px-3 py-2">Sumario: {entry.sumario ?? "-"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getFieldErrorMessage(formData: FormularioState) {
  if (!formData.paciente.nombrePaciente.trim()) {
    return "El nombre del paciente es obligatorio.";
  }

  if (!formData.paciente.fecha.trim()) {
    return "La fecha es obligatoria.";
  }

  return "";
}

export default function FormularioPage() {
  const [formData, setFormData] = useState<FormularioState>(() => createInitialFormularioState());
  const [activeStep, setActiveStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>(initialSubmissionState);
  const [summaryOpen, setSummaryOpen] = useState(true);

  const totals = calculateScoreTotals(formData);
  const obsessionScoredCount = scoreItemsObsesiones.filter(
    (item) => item.includeInTotal && formData.puntuacionesObsesiones[item.key].sumario !== null,
  ).length;
  const compulsionScoredCount = scoreItemsCompulsiones.filter(
    (item) => item.includeInTotal && formData.puntuacionesCompulsiones[item.key].sumario !== null,
  ).length;
  const obsessionScoredTotal = scoreItemsObsesiones.filter((item) => item.includeInTotal).length;
  const compulsionScoredTotal = scoreItemsCompulsiones.filter((item) => item.includeInTotal).length;
  const isSubmitting = submissionState.status === "loading";

  const updatePaciente = (field: keyof FormularioState["paciente"], nextValue: string) => {
    setFormData((current) => ({
      ...current,
      paciente: {
        ...current.paciente,
        [field]: nextValue,
      },
    }));
  };

  const updateChecklist = (
    section: "obsesionesChecklist" | "compulsionesChecklist",
    key: string,
    field: keyof ChecklistEntry,
    checked: boolean,
  ) => {
    setFormData((current) => ({
      ...current,
      [section]: (() => {
        const sectionValues = current[section];
        const typedKey = key as keyof typeof sectionValues;
        const currentEntry = sectionValues[typedKey] as ChecklistEntry;

        return {
          ...sectionValues,
          [typedKey]: {
            ...currentEntry,
            [field]: checked,
          },
        };
      })(),
    }));
  };

  const updateScore = (
    section: "puntuacionesObsesiones" | "puntuacionesCompulsiones",
    key: string,
    field: keyof ScoreEntry,
    nextValue: number | null,
  ) => {
    setFormData((current) => ({
      ...current,
      [section]: (() => {
        const sectionValues = current[section];
        const typedKey = key as keyof typeof sectionValues;
        const currentEntry = sectionValues[typedKey] as ScoreEntry;

        return {
          ...sectionValues,
          [typedKey]: {
            ...currentEntry,
            [field]: nextValue,
          },
        };
      })(),
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const errorMessage = getFieldErrorMessage(formData);
      if (errorMessage) {
        setStepError(errorMessage);
        return;
      }
    }

    setStepError("");
    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStepError("");
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const resetForm = () => {
    setFormData(createInitialFormularioState());
    setActiveStep(0);
    setStepError("");
    setSubmissionState(initialSubmissionState);
    setSummaryOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (activeStep !== 5 || isSubmitting) {
      return;
    }

    const errorMessage = getFieldErrorMessage(formData);
    if (errorMessage) {
      setStepError(errorMessage);
      setActiveStep(0);
      return;
    }

    setSubmissionState({
      status: "loading",
      message: "Enviando formulario...",
      detail: "Guardando datos en Google Sheets.",
    });
    setStepError("");

    try {
      const response = await fetch("/api/submit-formulario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; detail?: string }
        | null;

      if (!response.ok) {
        setSubmissionState({
          status: "error",
          message: result?.error ?? "No se pudo enviar el formulario.",
          detail: result?.detail ?? "Intentalo de nuevo en unos segundos.",
        });
        return;
      }

      setSubmissionState({
        status: "success",
        message: "Formulario enviado correctamente.",
        detail: "Los datos quedaron guardados en Google Sheets.",
      });
    } catch (error) {
      setSubmissionState({
        status: "error",
        message: "No se pudo conectar con el servidor.",
        detail: error instanceof Error ? error.message : "Error desconocido.",
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  if (submissionState.status === "success") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.12),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-10 text-slate-900">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-center">
          <section className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_16px_50px_rgba(15,23,42,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              CY-BOCS
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {submissionState.message}
            </h1>
            <p className="mt-3 text-sm text-slate-600">{submissionState.detail}</p>
            <button
              type="button"
              onClick={resetForm}
              className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Cargar nuevo formulario
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.12),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Formulario CY-BOCS
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Registro publico
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Completa el wizard paso a paso. El formulario guarda datos de identificacion,
                checklists y puntuaciones en las hojas de Google Sheets configuradas en el
                entorno.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Total general</p>
              <p className="mt-1 text-3xl font-semibold">{totals.totalGeneral}</p>
              <p className="text-sm text-slate-300">
                Obsesiones {totals.totalObsesiones} + Compulsiones {totals.totalCompulsiones}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-6">
            {steps.map((step, index) => (
              <StepChip key={step} index={index} label={step} active={index === activeStep} />
            ))}
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-950 transition-all duration-300"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Obsesiones</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {totals.totalObsesiones}
              </p>
              <p className="text-sm text-slate-600">
                {obsessionScoredCount}/{obsessionScoredTotal} puntuaciones sumario
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Compulsiones</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {totals.totalCompulsiones}
              </p>
              <p className="text-sm text-slate-600">
                {compulsionScoredCount}/{compulsionScoredTotal} puntuaciones sumario
              </p>
            </div>
            <div className="rounded-2xl border border-slate-950 bg-slate-950 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">General</p>
              <p className="mt-1 text-2xl font-semibold">{totals.totalGeneral}</p>
              <p className="text-sm text-slate-300">Suma de ambos totales</p>
            </div>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(event) => {
            if (activeStep === 5 && event.key === "Enter") {
              event.preventDefault();
            }
          }}
          className="grid gap-6"
        >
          {activeStep === 0 ? (
            <SectionCard
              eyebrow="Paso 1"
              title="Datos del paciente"
              description="Registra la informacion basica antes de continuar al checklist y las puntuaciones."
            >
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    field: "nombrePaciente" as const,
                    label: "Nombre del paciente",
                    required: true,
                  },
                  {
                    field: "nombreEvaluador" as const,
                    label: "Nombre del evaluador",
                    required: false,
                  },
                  { field: "fecha" as const, label: "Fecha", required: true },
                  { field: "lugar" as const, label: "Lugar", required: false },
                  { field: "edad" as const, label: "Edad", required: false },
                  {
                    field: "expediente" as const,
                    label: "Expediente",
                    required: false,
                  },
                ].map(({ field, label, required }) => (
                  <div key={field}>
                    <FieldLabel
                      htmlFor={field}
                      label={label}
                      hint={required ? "Obligatorio" : undefined}
                    />
                  <input
                    id={field}
                    type={field === "fecha" ? "date" : "text"}
                    value={formData.paciente[field]}
                    onChange={(event) => updatePaciente(field, event.target.value)}
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
              ))}
              </div>

              {stepError ? (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {stepError}
                </p>
              ) : null}
            </SectionCard>
          ) : null}

          {activeStep === 1 ? (
            <SectionCard
              eyebrow="Paso 2"
              title="Obsesiones - Checklist"
              description="Marca Presente y EMSP por cada sintoma, agrupado por categoria."
            >
              <div className="grid gap-4">
                {getChecklistGroups("obsesiones").map((group) => (
                  <ChecklistGroupTable
                    key={group.title}
                    title={group.title}
                    items={group.items}
                    values={formData.obsesionesChecklist}
                    onChange={(itemKey, field, checked) =>
                      updateChecklist("obsesionesChecklist", itemKey, field, checked)
                    }
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeStep === 2 ? (
            <SectionCard
              eyebrow="Paso 3"
              title="Compulsiones - Checklist"
              description="Marca Presente y EMSP por cada conducta compulsiva, agrupada por categoria."
            >
              <div className="grid gap-4">
                {getChecklistGroups("compulsiones").map((group) => (
                  <ChecklistGroupTable
                    key={group.title}
                    title={group.title}
                    items={group.items}
                    values={formData.compulsionesChecklist}
                    onChange={(itemKey, field, checked) =>
                      updateChecklist("compulsionesChecklist", itemKey, field, checked)
                    }
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeStep === 3 ? (
            <SectionCard
              eyebrow="Paso 4"
              title="Evaluacion de obsesiones"
              description="Cada item se califica de 0 a 4 para Padre, Niño y Sumario."
            >
              <ScoreScaleLegend />
              <div className="mt-5 grid gap-4">
                {scoreItemsObsesiones.map((item) => (
                  <ScoreItemCard
                    key={item.key}
                    itemKey={item.key}
                    title={item.title}
                    includeInTotal={item.includeInTotal}
                    value={formData.puntuacionesObsesiones[item.key]}
                    onChange={(itemKey, field, nextValue) =>
                      updateScore("puntuacionesObsesiones", itemKey, field, nextValue)
                    }
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeStep === 4 ? (
            <SectionCard
              eyebrow="Paso 5"
              title="Evaluacion de compulsiones"
              description="Cada item se califica de 0 a 4 para Padre, Niño y Sumario."
            >
              <ScoreScaleLegend />
              <div className="mt-5 grid gap-4">
                {scoreItemsCompulsiones.map((item) => (
                  <ScoreItemCard
                    key={item.key}
                    itemKey={item.key}
                    title={item.title}
                    includeInTotal={item.includeInTotal}
                    value={formData.puntuacionesCompulsiones[item.key]}
                    onChange={(itemKey, field, nextValue) =>
                      updateScore("puntuacionesCompulsiones", itemKey, field, nextValue)
                    }
                  />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeStep === 5 ? (
            <SectionCard
              eyebrow="Paso 6"
              title="Confirmación"
              description="Revisa el resumen completo antes de enviar."
            >
              <details
                open={summaryOpen}
                onToggle={(event) => setSummaryOpen(event.currentTarget.open)}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-slate-950">
                  Resumen del formulario
                </summary>

                <div className="mt-5 grid gap-4">
                  <section className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h3 className="font-semibold text-slate-950">Datos del paciente</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {[
                        ["Nombre del paciente", formData.paciente.nombrePaciente],
                        ["Nombre del evaluador", formData.paciente.nombreEvaluador],
                        ["Fecha", formData.paciente.fecha],
                        ["Lugar", formData.paciente.lugar],
                        ["Edad", formData.paciente.edad],
                        ["Expediente", formData.paciente.expediente],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-slate-50 px-3 py-2">
                          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                            {label}
                          </div>
                          <div className="mt-1 font-medium text-slate-900">
                            {value || "Sin registrar"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <SummaryList
                    title="Obsesiones - Checklist"
                    items={obsessionSummaryItems}
                    values={formData.obsesionesChecklist}
                  />

                  <SummaryList
                    title="Compulsiones - Checklist"
                    items={compulsionSummaryItems}
                    values={formData.compulsionesChecklist}
                  />

                  <ScoreSummary
                    title="Puntuaciones de obsesiones"
                    items={scoreItemsObsesiones}
                    values={formData.puntuacionesObsesiones}
                    includeNote="Incluye 1a, 2, 3, 4 y 5"
                  />

                  <ScoreSummary
                    title="Puntuaciones de compulsiones"
                    items={scoreItemsCompulsiones}
                    values={formData.puntuacionesCompulsiones}
                    includeNote="Incluye 6a, 7, 8, 9 y 10"
                  />

                  <section className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
                    <h3 className="font-semibold">Totales calculados</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <div className="rounded-xl bg-white/10 px-3 py-2">
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-300">
                          Total obsesiones
                        </div>
                        <div className="mt-1 text-2xl font-semibold">{totals.totalObsesiones}</div>
                      </div>
                      <div className="rounded-xl bg-white/10 px-3 py-2">
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-300">
                          Total compulsiones
                        </div>
                        <div className="mt-1 text-2xl font-semibold">{totals.totalCompulsiones}</div>
                      </div>
                      <div className="rounded-xl bg-white/10 px-3 py-2">
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-300">
                          Total general
                        </div>
                        <div className="mt-1 text-2xl font-semibold">{totals.totalGeneral}</div>
                      </div>
                    </div>
                  </section>
                </div>
              </details>

              {submissionState.status === "error" ? (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <p className="font-semibold">{submissionState.message}</p>
                  <p className="mt-1">{submissionState.detail}</p>
                </div>
              ) : null}

              {submissionState.status === "loading" ? (
                <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                  {submissionState.message}
                </div>
              ) : null}
            </SectionCard>
          ) : null}

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              Paso actual: <span className="font-semibold text-slate-900">{steps[activeStep]}</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={activeStep === 0 || isSubmitting}
                    className="cursor-pointer rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>

              {activeStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void handleFinalSubmit();
                  }}
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Enviar formulario"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
