import FileMeta from "../models/FileMeta";

import { ScanJob } from "../types";
// Dangerous keywords and patterns to check for
const DANGEROUS_PATTERNS = [
  { pattern: "rm -rf", severity: "high" },
  { pattern: "eval(", severity: "high" },
  { pattern: "exec(", severity: "high" },
  { pattern: "bitcoin", severity: "medium" },
  { pattern: "malware", severity: "medium" },
  { pattern: "virus", severity: "medium" },
  { pattern: "hack", severity: "medium" },
  { pattern: "exploit", severity: "high" },
  { pattern: "shell_exec", severity: "high" },
  { pattern: "system(", severity: "high" },
  { pattern: "passwd", severity: "medium" },
  { pattern: "ssh-key", severity: "medium" },
];

export const scanFile = async (job: ScanJob) => {
  try {
    console.log(`🔍 Starting scan for: ${job.filename}`);

    // Simulate scan delay
    const delay = 2000 + Math.random() * 3000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // ✅ Fetch file from Cloudinary
    let fileContent = "";
    try {
      const response = await fetch(job.fileUrl);
      const buffer = await response.arrayBuffer();
      fileContent = Buffer.from(buffer).toString("utf8").toLowerCase();
    } catch (err) {
      console.log(`⚠️ Could not fetch file for ${job.filename}, treating as clean`);
    }

    // ✅ Check for dangerous patterns
    const detectedThreats = DANGEROUS_PATTERNS.filter((p) =>
      fileContent.includes(p.pattern.toLowerCase())
    );

    const result = detectedThreats.length > 0 ? "infected" : "clean";
    const scannedAt = new Date();

    await FileMeta.findByIdAndUpdate(job.fileId, {
      status: "scanned",
      result,
      scannedAt,
    });

    console.log(`✅ Scan completed for ${job.filename}: ${result}`);

    // ✅ If infected, trigger alert
    if (detectedThreats.length > 0) {
      const { sendInfectedFileAlert } = await import("../services/notifications");
      await sendInfectedFileAlert({
        filename: job.filename,
        fileId: job.fileId,
        detectedThreats: detectedThreats.map((t) => t.pattern),
        timestamp: scannedAt.toISOString(),
        severity: detectedThreats.some((t) => t.severity === "high")
          ? "high"
          : "medium",
      });
    }
  } catch (error) {
    console.error(`❌ Error scanning ${job.filename}:`, error);
    await FileMeta.findByIdAndUpdate(job.fileId, {
      status: "scanned",
      result: "error",
      scannedAt: new Date(),
    });
  }
};
