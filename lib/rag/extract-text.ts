export const runtime = "nodejs";

export async function extractText(file: File, buffer: Buffer): Promise<string> {
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".pdf")) {
            const pdfParse = require("@cyber2024/pdf-parse-fixed");
            const data = await pdfParse(buffer);
            return data.text as string;
      }

      if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
            const mammoth = require("mammoth");
            const result = await mammoth.extractRawText({ buffer });
            return result.value as string;
      }

      if (fileName.endsWith(".txt")) {
            return buffer.toString("utf-8");
      }

      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".csv")) {
            const XLSX = require("xlsx");
            const workbook = XLSX.read(buffer, { type: "buffer" });
            let allText = "";
            for (const sheetName of workbook.SheetNames) {
                  const sheet = workbook.Sheets[sheetName];
                  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (
                        | string
                        | number
                        | boolean
                        | null
                        | undefined
                  )[][];
                  allText += `Sheet: ${sheetName}\n`;
                  for (const row of rows) {
                        const cleaned = row.filter(
                              (cell) => cell !== null && cell !== undefined && cell !== ""
                        );
                        if (cleaned.length > 0) allText += cleaned.join(" | ") + "\n";
                  }
                  allText += "\n";
            }
            return allText;
      }

      throw new Error("Unsupported file type");
}
