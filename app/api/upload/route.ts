export const runtime = "nodejs";

import { chunkText } from "@/lib/chunk";
import { embed } from "@/lib/embed";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();

    let text = "";

    // ==============================
    // 📄 PDF
    // ==============================
    if (fileName.endsWith(".pdf")) {
      const pdfParse = require("@cyber2024/pdf-parse-fixed");
      const data = await pdfParse(buffer);
      text = data.text;
    }

    // ==============================
    // 📄 WORD
    // ==============================
    else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    // ==============================
    // 📄 TXT
    // ==============================
    else if (fileName.endsWith(".txt")) {
      text = buffer.toString("utf-8");
    }

    // ==============================
    // 📊 EXCEL / CSV
    // ==============================
    else if (
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls") ||
      fileName.endsWith(".csv")
    ) {
      const XLSX = require("xlsx");
      const workbook = XLSX.read(buffer, { type: "buffer" });

      let allText = "";

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }) as (string | number | boolean | null | undefined)[][];

        allText += `Sheet: ${sheetName}\n`;

        for (const row of rows) {
          const cleaned = row.filter(
            (cell) => cell !== null && cell !== undefined && cell !== ""
          );

          if (cleaned.length > 0) {
            allText += cleaned.join(" | ") + "\n";
          }
        }

        allText += "\n";
      }

      text = allText;
    }

    // ==============================
    // ❌ Unsupported
    // ==============================
    else {
      return Response.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // ==============================
    // ⚠️ Clean text
    // ==============================
    text = text.replace(/\s+/g, " ").trim();

    if (!text) {
      return Response.json(
        { error: "Could not extract text" },
        { status: 400 }
      );
    }

    // ==============================
    // 🔥 RAG PIPELINE
    // ==============================

    // limit size (avoid API crash)
    if (text.length > 50000) {
      text = text.slice(0, 50000);
    }

    const chunks = chunkText(text);

    console.log("TEXT LENGTH:", text.length);
    console.log("CHUNKS:", chunks.length);

    // embeddings
    const embeddings = await embed(chunks);

    if (!embeddings || embeddings.length === 0) {
      throw new Error("Embeddings failed");
    }

    // prepare rows
    const rows = chunks.map((chunk, i) => ({
      content: chunk,
      embedding: embeddings[i],
      file_name: file.name,
      chunk_index: i,
    }));

    // insert into supabase
    const { error } = await supabase.from("documents").insert(rows);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      throw new Error(error.message);
    }

    return Response.json({
      success: true,
      chunks: chunks.length,
    });

  } catch (e: any) {
    console.error("UPLOAD ERROR:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}