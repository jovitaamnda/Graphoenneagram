const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const pdfService = {
  /**
   * Menghasilkan laporan PDF untuk analisis tertentu dan langsung di-stream ke HTTP response.
   * @param {Object} analysis - Objek data analisis dari Mongoose
   * @param {Object} res - Express response stream
   */
  generateReport: async (analysis, res) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    doc.pipe(res);

    // --- LOGOS ---
    const logoLeft = path.join(__dirname, "../assets/images/grapholyze_logo.png");
    const logoRight = path.join(__dirname, "../assets/images/trisakti_logo.png");

    if (fs.existsSync(logoLeft)) {
      doc.image(logoLeft, 50, 40, { width: 150 });
    }
    if (fs.existsSync(logoRight)) {
      doc.image(logoRight, 470, 35, { width: 80, align: "right" });
    }

    // --- CENTERED HEADER ---
    doc.moveDown(5);
    doc.font("Helvetica").fontSize(10).text("A Research Collaboration Project", { align: "center" });

    // Line below "Project"
    const lineY = doc.y + 5;
    doc.moveTo(100, lineY).lineTo(495, lineY).lineWidth(0.5).stroke();

    // --- TITLE "LAPORAN HASIL ANALYSIS" ---
    doc.moveDown(3);
    doc.font("Helvetica-Bold").fontSize(12).text("LAPORAN HASIL ANALYSIS", { align: "left" });

    doc.moveDown(2);

    // --- DATA UTAMA (TIPE & SCORE) ---
    doc.font("Helvetica-Bold").fontSize(10).text("Tipe Kepribadian:");
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(11).text(
      `${analysis.enneagramType || "-"} (${analysis.personalityType || "-"})`
    );

    doc.moveDown(2);

    // AI Confidence Score
    doc.font("Helvetica-Bold").fontSize(10).text("AI Confidence Score:");
    doc.moveDown(0.3);
    const confPercent =
      analysis.confidence > 1
        ? analysis.confidence
        : (analysis.confidence * 100).toFixed(0);
    doc.font("Helvetica").fontSize(11).text(`${confPercent}%`);

    doc.moveDown(3);

    // --- TABLE: Analisis Fitur Grafologi ---
    doc.font("Helvetica-Bold").fontSize(10).text("Analisis Fitur Grafologi", { align: "center" });
    doc.moveDown(1);

    // Table Config
    const tableTop = doc.y;
    const tableWidth = 450;
    const tableLeft = (595 - tableWidth) / 2; // Centered table

    const colWidths = [120, 100, 230]; // Total 450
    const col1 = tableLeft;
    const col2 = col1 + colWidths[0];
    const col3 = col2 + colWidths[1];

    // Header Row
    const headerHeight = 25;
    doc.lineWidth(1);

    // Outer border top
    doc.moveTo(tableLeft, tableTop).lineTo(tableLeft + tableWidth, tableTop).stroke();

    // Vertical lines for Header
    doc.moveTo(col1, tableTop).lineTo(col1, tableTop + headerHeight).stroke();
    doc.moveTo(col2, tableTop).lineTo(col2, tableTop + headerHeight).stroke();
    doc.moveTo(col3, tableTop).lineTo(col3, tableTop + headerHeight).stroke();
    doc.moveTo(
      col3 + colWidths[2],
      tableTop
    ).lineTo(col3 + colWidths[2], tableTop + headerHeight).stroke();

    // Header Text
    doc.fontSize(9).font("Helvetica-Bold");
    const textY = tableTop + 8;
    doc.text("Responbilitas", col1 + 5, textY);
    doc.text("Analisis", col2 + 5, textY);
    doc.text("Kepribadian", col3 + 5, textY);

    // Header Bottom Line
    doc.moveTo(tableLeft, tableTop + headerHeight).lineTo(tableLeft + tableWidth, tableTop + headerHeight).stroke();

    // Rows
    let currentY = tableTop + headerHeight;
    const traits = analysis.traits || {};
    const traitKeys = Object.keys(traits);

    const labelMap = {
      slant: "Slant",
      size: "Size",
      pressure: "Pressure",
      baseline: "Baseline",
    };

    const drawRow = (c1, c2, c3) => {
      const rowHeight = 35; // Height for wrapping text

      // Vertical lines
      doc.moveTo(col1, currentY).lineTo(col1, currentY + rowHeight).stroke();
      doc.moveTo(col2, currentY).lineTo(col2, currentY + rowHeight).stroke();
      doc.moveTo(col3, currentY).lineTo(col3, currentY + rowHeight).stroke();
      doc.moveTo(
        col3 + colWidths[2],
        currentY
      ).lineTo(col3 + colWidths[2], currentY + rowHeight).stroke();

      // Content
      doc.font("Helvetica").fontSize(9);
      doc.text(c1, col1 + 5, currentY + 10, { width: colWidths[0] - 10, ellipsis: true });
      doc.text(c2, col2 + 5, currentY + 10, { width: colWidths[1] - 10, ellipsis: true });
      doc.text(c3, col3 + 5, currentY + 5, {
        width: colWidths[2] - 10,
        height: rowHeight - 10,
        ellipsis: true,
      });

      // Bottom line
      doc.moveTo(tableLeft, currentY + rowHeight).lineTo(tableLeft + tableWidth, currentY + rowHeight).stroke();

      currentY += rowHeight;
    };

    if (traitKeys.length > 0) {
      traitKeys.forEach((key) => {
        if (key === "$init" || typeof traits[key] !== "object") return;
        const t = traits[key];
        const label = labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
        drawRow(label, t.val || "-", t.meaning || "-");
      });
    } else {
      drawRow("-", "-", "-");
      drawRow("-", "-", "-");
      drawRow("-", "-", "-");
      drawRow("-", "-", "-");
    }

    doc.moveDown(3);

    // --- REKOMENDASI ---
    doc.y = currentY + 40;

    doc.font("Helvetica-Bold").fontSize(12).text("Rekomendasi Pengembangan Diri:");
    doc.moveDown(1);
    doc.font("Helvetica").fontSize(10);

    const recs = analysis.recommendations || [];
    if (recs.length > 0) {
      recs.forEach((r, i) => {
        doc.text(`${i + 1}. ${r}`);
        doc.moveDown(0.5);
      });
    } else {
      doc.text(analysis.description || "No specific recommendations.");
    }

    // --- FOOTER ---
    const footerY = 780;
    doc.fontSize(8).font("Helvetica").text(
      "Generated by Grapholyze Capstone AI Engine | 2026",
      50,
      footerY,
      { align: "center", width: 500 }
    );

    doc.end();
  },
};

module.exports = pdfService;
