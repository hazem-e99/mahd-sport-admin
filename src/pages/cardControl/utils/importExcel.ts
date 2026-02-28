import * as XLSX from "xlsx";
import type { PlayerCard, PerformanceLevel } from "../types/card-control.type";

// ---------------------------------------------------------------------------
// Performance map  – Arabic values from the actual file
// ---------------------------------------------------------------------------
const PERFORMANCE_MAP: Record<string, PerformanceLevel> = {
  // Arabic (as found in the file)
  "الماسي": "diamond",
  "ماسي": "diamond",
  "الذهبي": "gold",
  "ذهبي": "gold",
  "الفضي": "silver",
  "فضي": "silver",
  "الأبيض": "silver",   // white → mapped to silver (lowest tier)
  "ابيض": "silver",
  "أبيض": "silver",
  // English fallbacks
  "diamond": "diamond",
  "gold": "gold",
  "silver": "silver",
  "white": "silver",
};

// Sport detected from the sheet title
const SHEET_SPORT_MAP: Record<string, string> = {
  "كرة القدم": "Football",
  "الجودو": "Judo",
  "ألعاب القوى": "Athletics",
  "تايكوندو": "Taekwondo",
};

// ---------------------------------------------------------------------------
// Column indices  (0-based) — derived from the actual file structure
//
// Row 1  → title row  (e.g. "Football Players Data")
// Row 2  → group headers (الاسم الكامل | Location | KPI | Performance …)
// Row 3  → sub-headers  (Arabic Name | English Name | Cognition | …)
// Row 4+ → data
//
// Football sheet  (A:P = 16 cols):
//   0  Arabic Name
//   1  English Name
//   2  Location
//   3  Birth Year (date)
//   4  Nationality
//   5  Position
//   6  Player Number
//   7  Cognition
//   8  Technical
//   9  Wellness  (ignored)
//   10 Physical
//   11 Psychology
//   12 Medical
//   13 Performance
//   14 Photo URL
//   15 (extra / ignored)
//
// Judo / Athletics / Taekwondo  (A:N = 14 cols):
//   0  Arabic Name
//   1  English Name
//   2  Location
//   3  Birth Year (date)
//   4  Nationality
//   5  Cognition
//   6  Technical
//   7  Wellness  (ignored)
//   8  Physical
//   9  Psychology
//   10 Medical
//   11 Photo URL
//   12 (ignored)
//   13 (ignored)
// ---------------------------------------------------------------------------

interface SheetLayout {
  arabicName: number;
  englishName: number;
  location: number;
  birthYear: number;
  nationality: number;
  position: number | null;
  playerNumber: number | null;
  cognition: number;
  technical: number;
  physical: number;
  psychology: number;
  medical: number;
  performance: number | null;
  photoUrl: number;
  dataStartRow: number; // 0-based row index where data begins
}

const FOOTBALL_LAYOUT: SheetLayout = {
  arabicName: 0,
  englishName: 1,
  location: 2,
  birthYear: 3,
  nationality: 4,
  position: 5,
  playerNumber: 6,
  cognition: 7,
  technical: 8,
  physical: 10,
  psychology: 11,
  medical: 12,
  performance: 13,
  photoUrl: 14,
  dataStartRow: 3,
};

const DEFAULT_LAYOUT: SheetLayout = {
  arabicName: 0,
  englishName: 1,
  location: 2,
  birthYear: 3,
  nationality: 4,
  position: null,
  playerNumber: null,
  cognition: 5,
  technical: 6,
  physical: 8,
  psychology: 9,
  medical: 10,
  performance: null,
  photoUrl: 11,
  dataStartRow: 3,
};

function getLayout(sheetName: string): SheetLayout {
  return sheetName === "كرة القدم" ? FOOTBALL_LAYOUT : DEFAULT_LAYOUT;
}

function parsePerformance(val: unknown): PerformanceLevel {
  if (!val) return "silver";
  const s = String(val).trim();
  return PERFORMANCE_MAP[s] ?? PERFORMANCE_MAP[s.toLowerCase()] ?? "silver";
}

function parseNumber(val: unknown): number {
  if (val === null || val === undefined || val === "") return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
}

function parseYear(val: unknown): string {
  if (!val) return "";
  if (val instanceof Date) return String(val.getFullYear());
  const s = String(val);
  // XLSX sometimes returns date as serial or string like "2011-05-05T00:00:00.000Z"
  const dateMatch = s.match(/(\d{4})/);
  return dateMatch ? dateMatch[1] : s;
}

function getCellVal(row: unknown[], idx: number | null): unknown {
  if (idx === null || idx === undefined) return null;
  return row[idx] ?? null;
}

export interface ImportResult {
  players: PlayerCard[];
  warnings: string[];
  skipped: number;
  detectedColumns: string[];
  sheetsImported: string[];
}

export function parseExcelFile(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });

        const warnings: string[] = [];
        let skipped = 0;
        const allPlayers: PlayerCard[] = [];
        const sheetsImported: string[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sport = SHEET_SPORT_MAP[sheetName];
          if (!sport) {
            warnings.push(`Sheet "${sheetName}" not recognized — skipped.`);
            return;
          }

          const worksheet = workbook.Sheets[sheetName];
          // Use raw arrays so we control column indices precisely
          const rows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: null,
            raw: false,
          }) as unknown[][];

          const layout = getLayout(sheetName);

          rows.forEach((row, rowIdx) => {
            if (rowIdx < layout.dataStartRow) return; // skip header rows

            const arabicName = String(getCellVal(row, layout.arabicName) ?? "").trim();
            const englishName = String(getCellVal(row, layout.englishName) ?? "").trim();

            if (!arabicName && !englishName) {
              skipped++;
              return;
            }

            const player: PlayerCard = {
              id: Math.random().toString(36).substr(2, 9),
              fullNameAr: arabicName || englishName,
              fullNameEn: englishName || arabicName,
              sport,
              playerNumber: String(getCellVal(row, layout.playerNumber) ?? "").trim(),
              position: String(getCellVal(row, layout.position) ?? "").trim(),
              country: String(getCellVal(row, layout.nationality) ?? "").trim(),
              countryCode: "",
              performance: parsePerformance(getCellVal(row, layout.performance)),
              photoUrl:
                String(getCellVal(row, layout.photoUrl) ?? "").trim() ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(englishName || arabicName)}`,
              birthYear: parseYear(getCellVal(row, layout.birthYear)),
              location: String(getCellVal(row, layout.location) ?? "").trim(),
              status: true,
              orderIndex: allPlayers.length + 1,
              kpi: {
                cognition: parseNumber(getCellVal(row, layout.cognition)),
                technical: parseNumber(getCellVal(row, layout.technical)),
                physical: parseNumber(getCellVal(row, layout.physical)),
                psychology: parseNumber(getCellVal(row, layout.psychology)),
                medical: parseNumber(getCellVal(row, layout.medical)),
                skillVideoUrl: "",
              },
            };

            allPlayers.push(player);
          });

          sheetsImported.push(`${sport} (${sheetName})`);
        });

        if (allPlayers.length === 0) {
          reject(new Error("No valid player data found in the file."));
          return;
        }

        const detectedColumns = [
          "fullNameAr", "fullNameEn", "sport", "country",
          "performance", "kpi.cognition", "kpi.technical",
          "kpi.physical", "kpi.psychology", "kpi.medical",
        ];

        resolve({ players: allPlayers, warnings, skipped, detectedColumns, sheetsImported });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsArrayBuffer(file);
  });
}
