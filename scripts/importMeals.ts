import { readFile } from "node:fs/promises";
import path from "node:path";
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { parse as parseCsv } from "csv-parse/sync";
import type { Ingredient } from "../src/types";

type MealRow = {
  name?: string;
  ingredients?: string;
};

type ImportOptions = {
  filePath: string;
  collection: string;
  dryRun: boolean;
  projectId?: string;
};

type Firebaserc = {
  projects?: Record<string, string>;
};

function getArgValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function hasFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

async function tryReadJson<T>(relativePath: string): Promise<T | null> {
  try {
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const contents = await readFile(absolutePath, "utf8");
    return JSON.parse(contents) as T;
  } catch {
    return null;
  }
}

async function detectProjectIdFromFirebaserc(
  alias?: string,
): Promise<string | undefined> {
  const firebaserc = await tryReadJson<Firebaserc>(".firebaserc");
  const projects = firebaserc?.projects;
  if (!projects) return undefined;

  if (alias && projects[alias]) return projects[alias];

  const values = Object.values(projects).filter(Boolean);
  if (values.length === 1) return values[0];
  if (values.length > 1) return values[0];
  return undefined;
}

function printUsage(): void {
  console.log(
    `\nUsage:\n  npm run import:meals -- --file <path-to-csv> [--dry-run] [--collection meals] [--confirm-production]\n\nProject selection:\n  - Emulator: pass --project <id>, or --project-alias <qual|prod>, or set GCLOUD_PROJECT\n  - If not provided, the script will try to infer from .firebaserc\n  - Production: project is inferred from GOOGLE_APPLICATION_CREDENTIALS\n\nEmulator:\n  - Set FIRESTORE_EMULATOR_HOST, or pass --emulator-host 127.0.0.1:8080\n\nAuth:\n  - For production writes, set GOOGLE_APPLICATION_CREDENTIALS to a service account json path.\n\nSafety:\n  - Writes are blocked unless you are targeting the emulator (FIRESTORE_EMULATOR_HOST)\n    or you pass --confirm-production.\n\nCSV headers:\n  name, ingredients\n\nIngredients formats (cell value):\n  1) JSON array: [{"name":"Chicken","quantity":1,"unit":"lb"}] (also accepts "units")\n  2) Semicolon list with pipes: Chicken|1|lb; Rice|2|cup; Salt|1|tsp\n`,
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseIngredientsCell(raw: string | undefined): Ingredient[] {
  const value = (raw ?? "").trim();
  if (!value) return [];

  // Format 1: JSON array of Ingredient
  if (value.startsWith("[") || value.startsWith("{")) {
    const parsed: unknown = JSON.parse(value);
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.map((item: unknown) => {
      if (!isObject(item)) throw new Error("Ingredient must be an object");

      const name = String(item.name ?? "").trim();
      const quantity = Number(item.quantity ?? 1);
      const unit = String(item.unit ?? "").trim();
      const category = String(item.category ?? "").trim() ?? null;
      if (!name) throw new Error("Ingredient missing name");
      if (!Number.isFinite(quantity))
        throw new Error(`Ingredient quantity invalid for ${name}`);
      return {
        name,
        quantity,
        unit,
        category: category === undefined ? null : category,
      } satisfies Ingredient;
    });
  }

  // Format 2: "name|qty|unit|category?; name|qty|unit"
  const parts = value
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  return parts.map((part) => {
    const [nameRaw, qtyRaw, unitRaw, categoryRaw] = part
      .split("|")
      .map((p) => p.trim());

    const name = (nameRaw ?? "").trim();
    if (!name) throw new Error("Ingredient missing name");

    const quantity = qtyRaw === undefined || qtyRaw === "" ? 1 : Number(qtyRaw);
    if (!Number.isFinite(quantity))
      throw new Error(`Ingredient quantity invalid for ${name}`);

    const unit = (unitRaw ?? "").trim();
    const category = categoryRaw ? categoryRaw : null;

    return { name, quantity, unit, category } satisfies Ingredient;
  });
}

function parseMealsCsv(
  contents: string,
): Array<{ name: string; ingredients: Ingredient[] }> {
  const rows = parseCsv(contents, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as MealRow[];

  const meals: Array<{ name: string; ingredients: Ingredient[] }> = [];

  rows.forEach((row, index) => {
    const name = String(row.name ?? "").trim();
    if (!name) {
      throw new Error(`Row ${index + 2}: missing required column "name"`);
    }

    let ingredients: Ingredient[] = [];
    try {
      ingredients = parseIngredientsCell(row.ingredients);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(
        `Row ${index + 2} (${name}): ingredients parse failed: ${msg}`,
      );
    }

    meals.push({ name, ingredients });
  });

  return meals;
}

function initAdmin(opts: { projectId?: string; useEmulator: boolean }): void {
  if (getApps().length > 0) return;

  // For emulator runs, credentials aren't required but a projectId is.
  if (opts.useEmulator) {
    initializeApp({ projectId: opts.projectId });
    return;
  }

  initializeApp({
    credential: applicationDefault(),
    projectId: opts.projectId,
  });
}

async function writeMeals(opts: ImportOptions): Promise<void> {
  const absolutePath = path.resolve(process.cwd(), opts.filePath);
  const csv = await readFile(absolutePath, "utf8");
  const meals = parseMealsCsv(csv);

  if (opts.dryRun) {
    console.log(
      `Dry run: would import ${meals.length} meals into collection "${opts.collection}" from ${absolutePath}`,
    );
    console.log("First meal preview:");
    console.log(JSON.stringify(meals.slice(0, 1), null, 2));
    return;
  }

  const useEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
  initAdmin({ projectId: opts.projectId, useEmulator });
  const firestore = getFirestore();

  const BATCH_LIMIT = 500;
  let written = 0;

  for (let i = 0; i < meals.length; i += BATCH_LIMIT) {
    const chunk = meals.slice(i, i + BATCH_LIMIT);
    const batch = firestore.batch();

    chunk.forEach((meal) => {
      const ref = firestore.collection(opts.collection).doc(); // auto ID
      batch.set(ref, meal);
    });

    await batch.commit();
    written += chunk.length;
    console.log(`Imported ${written}/${meals.length}`);
  }

  console.log(`Done. Imported ${written} meals into "${opts.collection}".`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (hasFlag(args, "--help") || hasFlag(args, "-h")) {
    printUsage();
    process.exit(0);
  }

  const filePath = getArgValue(args, "--file") ?? getArgValue(args, "-f");
  const collection = getArgValue(args, "--collection") ?? "meals";
  const dryRun = hasFlag(args, "--dry-run");
  const confirmProduction = hasFlag(args, "--confirm-production");

  const emulatorHost = getArgValue(args, "--emulator-host");
  if (emulatorHost) {
    process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;
  }

  const projectAlias = getArgValue(args, "--project-alias");

  const isEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

  const explicitProjectId =
    getArgValue(args, "--project") ??
    process.env.GCLOUD_PROJECT ??
    process.env.GOOGLE_CLOUD_PROJECT ??
    process.env.FIREBASE_PROJECT_ID;

  const projectId =
    explicitProjectId ??
    (isEmulator
      ? await detectProjectIdFromFirebaserc(projectAlias)
      : undefined);

  if (!filePath) {
    printUsage();
    process.exit(1);
  }

  if (!dryRun && isEmulator && !projectId) {
    console.error(
      "Missing project id for emulator. Pass --project <id>, --project-alias <qual|prod>, or set GCLOUD_PROJECT.",
    );
    printUsage();
    process.exit(1);
  }

  if (!dryRun && !isEmulator && !confirmProduction) {
    console.error(
      "Refusing to write to production Firestore. Set FIRESTORE_EMULATOR_HOST or pass --confirm-production.",
    );
    printUsage();
    process.exit(1);
  }

  await writeMeals({ filePath, collection, dryRun, projectId });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
