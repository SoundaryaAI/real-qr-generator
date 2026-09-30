import Papa from "papaparse";

export interface ParsedCsvResult {
  columns: string[];
  rows: Record<string, string>[];
  delimiter: string;
  detectedUrlColumn: string;
  detectedTitleColumn: string;
  totalRows: number;
  isSingleColumn: boolean;
  error?: string;
}

export interface BulkItem {
  id: string;
  title: string;
  url: string;
}

/**
 * Robustly parses CSV / TSV / Semicolon-delimited text data.
 * Supports:
 * - RFC 4180 quotes & multiline fields
 * - Auto-delimiters (, ; \t |)
 * - UTF-8 BOM stripping
 * - Single-column URLs or QR payloads (with or without headers)
 * - Multi-column spreadsheets with smart URL/Title candidate detection
 */
export function parseCsvData(rawText: string): ParsedCsvResult {
  const cleanedText = rawText.replace(/^\uFEFF/, "").trim();

  if (!cleanedText) {
    return {
      columns: [],
      rows: [],
      delimiter: ",",
      detectedUrlColumn: "",
      detectedTitleColumn: "",
      totalRows: 0,
      isSingleColumn: false,
      error: "CSV content is empty.",
    };
  }

  // Parse raw matrix first to safely inspect rows & headers
  const rawParse = Papa.parse<string[]>(cleanedText, {
    skipEmptyLines: "greedy",
    dynamicTyping: false,
  });

  if (rawParse.errors.length > 0 && (!rawParse.data || rawParse.data.length === 0)) {
    return {
      columns: [],
      rows: [],
      delimiter: ",",
      detectedUrlColumn: "",
      detectedTitleColumn: "",
      totalRows: 0,
      isSingleColumn: false,
      error: rawParse.errors[0]?.message || "Failed to parse CSV format.",
    };
  }

  const rawRows = rawParse.data;
  if (!rawRows || rawRows.length === 0) {
    return {
      columns: [],
      rows: [],
      delimiter: rawParse.meta?.delimiter || ",",
      detectedUrlColumn: "",
      detectedTitleColumn: "",
      totalRows: 0,
      isSingleColumn: false,
      error: "No data rows found.",
    };
  }

  const delimiter = rawParse.meta?.delimiter || ",";
  const numColumns = Math.max(...rawRows.map((r) => r.length));

  // Determine if first row is a header
  const firstRow = rawRows[0];
  const isSingleCol = numColumns === 1;

  // Check if first row looks like a header
  const urlRegex = /^(https?:\/\/|www\.)/i;
  const isFirstRowUrl = firstRow.some((val) => urlRegex.test(val?.trim() || ""));

  const headerKeywords = /^(title|name|url|link|website|web|destination|qr|label|item|product|id|sku|description|desc|target|data|code)$/i;
  const firstRowHasHeaderKeyword = firstRow.some((val) =>
    headerKeywords.test(val?.trim().toLowerCase() || "")
  );

  let hasHeader = false;
  if (!isFirstRowUrl && (firstRowHasHeaderKeyword || rawRows.length > 1)) {
    // If first row has keywords or does not look like data while second row does
    hasHeader = firstRowHasHeaderKeyword || !isFirstRowUrl;
  }

  let columnNames: string[] = [];
  let dataRows: string[][] = [];

  if (hasHeader) {
    columnNames = firstRow.map((col, idx) => col?.trim() || `Column ${idx + 1}`);
    dataRows = rawRows.slice(1);
  } else {
    columnNames = Array.from({ length: numColumns }, (_, idx) => `Column ${idx + 1}`);
    dataRows = rawRows;
  }

  // Deduplicate column names if needed
  const seenCols: Record<string, number> = {};
  columnNames = columnNames.map((name) => {
    if (seenCols[name]) {
      seenCols[name]++;
      return `${name}_${seenCols[name]}`;
    }
    seenCols[name] = 1;
    return name;
  });

  // Convert data rows into objects
  const records: Record<string, string>[] = [];
  for (const row of dataRows) {
    // Skip if row is completely empty
    if (!row || row.every((c) => !c || c.trim() === "")) continue;

    const record: Record<string, string> = {};
    for (let c = 0; c < columnNames.length; c++) {
      record[columnNames[c]] = (row[c] || "").trim();
    }
    records.push(record);
  }

  // Detect URL / Content column
  let detectedUrlCol = columnNames[0];
  let detectedTitleCol = columnNames.length > 1 ? columnNames[1] : columnNames[0];

  if (isSingleCol) {
    detectedUrlCol = columnNames[0];
    detectedTitleCol = columnNames[0];
  } else {
    // Find best URL column: score based on header name and data row values
    let bestUrlScore = -1;
    let bestUrlIdx = -1;

    for (let i = 0; i < columnNames.length; i++) {
      const col = columnNames[i];
      let score = 0;
      const lower = col.toLowerCase();

      if (/url|link|website|web|destination|qr|target|href/.test(lower)) score += 10;
      if (/data|content/.test(lower)) score += 5;

      // Check values in sample rows
      const sampleValues = records.slice(0, 10).map((r) => r[col] || "");
      const urlCount = sampleValues.filter((v) => urlRegex.test(v)).length;
      score += urlCount * 3;

      if (score > bestUrlScore) {
        bestUrlScore = score;
        bestUrlIdx = i;
      }
    }

    if (bestUrlIdx !== -1) {
      detectedUrlCol = columnNames[bestUrlIdx];
    }

    // Find best Title column (different from URL column)
    let bestTitleScore = -1;
    let bestTitleIdx = -1;

    for (let i = 0; i < columnNames.length; i++) {
      if (i === bestUrlIdx && columnNames.length > 1) continue;

      const col = columnNames[i];
      let score = 0;
      const lower = col.toLowerCase();

      if (/title|name|label|product|item/.test(lower)) score += 10;
      if (/id|sku|description|desc/.test(lower)) score += 5;

      if (score > bestTitleScore) {
        bestTitleScore = score;
        bestTitleIdx = i;
      }
    }

    if (bestTitleIdx !== -1) {
      detectedTitleCol = columnNames[bestTitleIdx];
    } else {
      // Default to first non-URL column
      const fallback = columnNames.find((c) => c !== detectedUrlCol);
      detectedTitleCol = fallback || detectedUrlCol;
    }
  }

  return {
    columns: columnNames,
    rows: records,
    delimiter,
    detectedUrlColumn: detectedUrlCol,
    detectedTitleColumn: detectedTitleCol,
    totalRows: records.length,
    isSingleColumn: isSingleCol,
  };
}

/**
 * Builds BulkItem objects from parsed rows and selected column mapping.
 */
export function generateBulkItems(
  parsed: ParsedCsvResult,
  urlColumn: string,
  titleColumn: string
): BulkItem[] {
  const items: BulkItem[] = [];

  for (let i = 0; i < parsed.rows.length; i++) {
    const row = parsed.rows[i];
    const rawUrl = (row[urlColumn] || "").trim();
    if (!rawUrl) continue;

    let title = (row[titleColumn] || "").trim();
    if (!title || titleColumn === urlColumn) {
      // Create clean human-readable title from URL or item index
      try {
        if (/^https?:\/\//i.test(rawUrl)) {
          const parsedUrl = new URL(rawUrl);
          title = `${parsedUrl.hostname}${parsedUrl.pathname !== "/" ? parsedUrl.pathname : ""}`;
        } else {
          title = `Item ${i + 1}`;
        }
      } catch {
        title = `Item ${i + 1}`;
      }
    }

    items.push({
      id: `bulk-${i + 1}`,
      title,
      url: rawUrl,
    });
  }

  return items;
}
