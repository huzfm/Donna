import pdf from "pdf-parse";
import * as XLSX from "xlsx";

export async function extractText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const data = await pdf(buffer);
    return data.text;
  }

  if (file.type.includes("spreadsheet")) {
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_csv(sheet);
  }

  return buffer.toString();
}