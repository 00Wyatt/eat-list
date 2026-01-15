# eat-list

## Import meals into Firestore (from a spreadsheet)

This repo includes a script that can bulk-import Meals into the `meals` Firestore collection.

Each imported document looks like:

```ts
{
  name: string,
  ingredients: Array<{ name: string; quantity: number; unit: string; category?: string | null }>
}
```

Firestore document IDs are auto-generated (random) by Firestore.

### 1) Export your spreadsheet to CSV

Export your sheet as a `.csv` and ensure it has a header row with these columns:

- `name` (required)
- `ingredients` (optional; see formats below)

### 2) Ingredients cell formats

The `ingredients` cell supports **either** of these formats.

#### Format A: JSON (recommended)

Put a JSON array in the cell:

```json
[
  { "name": "Chicken", "quantity": 1, "unit": "lb" },
  { "name": "Rice", "quantity": 2, "unit": "cup", "category": "Grains" }
]
```

Notes:

- This is the least ambiguous option and supports `category`.
- When stored in CSV, wrap the whole JSON value in double-quotes.

Example CSV row:

```csv
name,ingredients
Chicken Bowl,"[{""name"":""Chicken"",""quantity"":1,""unit"":""lb""},{""name"":""Rice"",""quantity"":2,""unit"":""cup""}]"
```

#### Format B: Pipe/semicolon list (fast to type)

One ingredient per `;` (semicolon). Fields are separated by `|` (pipe):

```
name|qty|unit|category?; name|qty|unit
```

Examples:

```text
Chicken|1|lb; Rice|2|cup; Salt|1|tsp
Chicken|1|lb|Meat; Rice|2|cup|Grains
```

Notes:

- `qty` is optional; if omitted, it defaults to `1`.
- `unit` can be blank, but the app UI generally expects a string.

### 3) Auth / credentials (required for production)

The import script uses the Firebase Admin SDK.

For production writes, set `GOOGLE_APPLICATION_CREDENTIALS` to a service account JSON file path.

Example (PowerShell):

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\\path\\to\\service-account.json"
```

Example (Git Bash):

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/c/path/to/service-account.json"
```

### 4) Safety / production confirmation

To avoid accidental production writes, the script refuses to write unless:

- You are targeting the emulator (`FIRESTORE_EMULATOR_HOST` is set), **or**
- You pass `--confirm-production`

### 5) Run the importer

Dry-run (parses CSV and previews the first meal):

```bash
npm run import:meals -- --file path/to/meals.csv --dry-run
```

Real import (production requires confirmation):

```bash
npm run import:meals -- --file path/to/meals.csv --confirm-production
```

Optional: choose a different collection:

```bash
npm run import:meals -- --file path/to/meals.csv --collection meals
```

### 6) Importing into the Firestore emulator (optional)

If you have the emulator running, point the script at it.

The Admin SDK still needs a project id for emulator runs. The script can get that from:

- `--project <id>` (explicit), or
- `--project-alias <qual|prod>` from `.firebaserc`, or
- `GCLOUD_PROJECT` / `GOOGLE_CLOUD_PROJECT`, or
- `.firebaserc` (auto-detect)

You can set the emulator host either via env var or a flag.

```powershell
$env:FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080"
npm run import:meals -- --file path/to/meals.csv --project-alias qual
```

Git Bash example using the flag (no env var needed):

```bash
npm run import:meals -- --file ./path/to/meals.csv --emulator-host 127.0.0.1:8080 --project-alias qual
```

Script location: [importMeals.ts](importMeals.ts)
