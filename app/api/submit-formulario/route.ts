import { google } from "googleapis";
import {
  buildCompulsionChecklistRow,
  buildObsessionChecklistRow,
  buildScoreRow,
  createInitialFormularioState,
  getCompulsionChecklistHeaders,
  getObsessionChecklistHeaders,
  getScoreHeaders,
  toSheetText,
  type FormularioState,
} from "@/app/formulario/formulario-data";

export const runtime = "nodejs";

type SubmissionBody = FormularioState;

const spreadsheetScopes = ["https://www.googleapis.com/auth/spreadsheets"];

function toPlainText(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function stripWrappingQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function normalizePrivateKey(privateKey: string) {
  return stripWrappingQuotes(privateKey.trim())
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function resolvePrivateKey(rawValue: string) {
  const trimmedValue = rawValue.trim();

  if (trimmedValue.startsWith("{")) {
    try {
      const parsedValue = JSON.parse(trimmedValue) as { private_key?: unknown };
      if (typeof parsedValue.private_key === "string" && parsedValue.private_key.trim()) {
        return normalizePrivateKey(parsedValue.private_key);
      }
    } catch {
      // Fall back to the raw value below.
    }
  }

  return normalizePrivateKey(trimmedValue);
}

function buildSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error("Faltan credenciales de Google Sheets en el entorno.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: resolvePrivateKey(privateKey),
    scopes: spreadsheetScopes,
  });

  return {
    auth,
    spreadsheetId,
    sheets: google.sheets({ version: "v4", auth }),
  };
}

async function ensureHeaderAndAppend(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetName: string,
  headers: string[],
  row: (string | number)[],
) {
  const existingValues = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:ZZZ`,
  });

  if (!existingValues.data.values || existingValues.data.values.length === 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [headers],
      },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}

function getSubmissionBody(body: unknown): SubmissionBody | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const candidate = body as Partial<SubmissionBody>;
  const defaults = createInitialFormularioState();
  const paciente = candidate.paciente ?? defaults.paciente;

  return {
    paciente: {
      nombrePaciente: toPlainText(paciente.nombrePaciente),
      nombreEvaluador: toPlainText(paciente.nombreEvaluador),
      fecha: toPlainText(paciente.fecha),
      lugar: toPlainText(paciente.lugar),
      edad: toPlainText(paciente.edad),
      expediente: toPlainText(paciente.expediente),
    },
    obsesionesChecklist:
      ({
        ...defaults.obsesionesChecklist,
        ...(candidate.obsesionesChecklist ?? {}),
      } as SubmissionBody["obsesionesChecklist"]),
    compulsionesChecklist:
      ({
        ...defaults.compulsionesChecklist,
        ...(candidate.compulsionesChecklist ?? {}),
      } as SubmissionBody["compulsionesChecklist"]),
    puntuacionesObsesiones:
      ({
        ...defaults.puntuacionesObsesiones,
        ...(candidate.puntuacionesObsesiones ?? {}),
      } as SubmissionBody["puntuacionesObsesiones"]),
    puntuacionesCompulsiones:
      ({
        ...defaults.puntuacionesCompulsiones,
        ...(candidate.puntuacionesCompulsiones ?? {}),
      } as SubmissionBody["puntuacionesCompulsiones"]),
  };
}

export async function POST(request: Request) {
  try {
    const body = getSubmissionBody(await request.json().catch(() => null));

    if (!body?.paciente.nombrePaciente.trim() || !body?.paciente.fecha.trim()) {
      return Response.json(
        { error: "Faltan campos obligatorios" },
        {
          status: 400,
        },
      );
    }

    const { auth, sheets, spreadsheetId } = buildSheetsClient();
    await auth.authorize();

    const timestamp = new Date().toISOString();

    await ensureHeaderAndAppend(
      sheets,
      spreadsheetId,
      "Paciente",
      ["timestamp", "nombrePaciente", "nombreEvaluador", "fecha", "lugar", "edad", "expediente"],
      [
        timestamp,
        toSheetText(body.paciente.nombrePaciente),
        toSheetText(body.paciente.nombreEvaluador),
        toSheetText(body.paciente.fecha),
        toSheetText(body.paciente.lugar),
        toSheetText(body.paciente.edad),
        toSheetText(body.paciente.expediente),
      ],
    );

    await ensureHeaderAndAppend(
      sheets,
      spreadsheetId,
      "Obsesiones_Checklist",
      getObsessionChecklistHeaders(),
      buildObsessionChecklistRow(body, timestamp),
    );

    await ensureHeaderAndAppend(
      sheets,
      spreadsheetId,
      "Compulsiones_Checklist",
      getCompulsionChecklistHeaders(),
      buildCompulsionChecklistRow(body, timestamp),
    );

    await ensureHeaderAndAppend(
      sheets,
      spreadsheetId,
      "Puntuaciones",
      getScoreHeaders(),
      buildScoreRow(body, timestamp),
    );

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error: "Error al escribir en Google Sheets",
        detail: error instanceof Error ? error.message : "Error desconocido",
      },
      {
        status: 500,
      },
    );
  }
}
