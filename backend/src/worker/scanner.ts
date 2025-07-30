import fs from 'fs';
import FileMeta from '../models/FileMeta';

interface ScanJob {
  fileId: string;
  filePath: string;
  filename: string;
}

// Dangerous keywords and patterns to check for
const DANGEROUS_PATTERNS = [
  { pattern: 'rm -rf', severity: 'high' },
  { pattern: 'eval(', severity: 'high' },
  { pattern: 'exec(', severity: 'high' },
  { pattern: 'bitcoin', severity: 'medium' },
  { pattern: 'malware', severity: 'medium' },
  { pattern: 'virus', severity: 'medium' },
  { pattern: 'hack', severity: 'medium' },
  { pattern: 'exploit', severity: 'high' },
  { pattern: 'shell_exec', severity: 'high' },
  { pattern: 'system(', severity: 'high' },
  { pattern: 'passwd', severity: 'medium' },
  { pattern: 'ssh-key', severity: 'medium' }
];

export const scanFile = async (job: ScanJob) => {
  try {
    console.log(`Starting scan for: ${job.filename}`);
    
  
    // Simulate more realistic scanning process
    console.log(`Analyzing file content for ${job.filename}...`);
    
    // Simulate different scan times based on file size and complexity
    const baseDelay = 2000; // 2 seconds base
    const complexityDelay = Math.random() * 3000; // 0-3 seconds for complexity
    const totalDelay = baseDelay + complexityDelay;
    
    console.log(`Scanning ${job.filename} (estimated time: ${Math.round(totalDelay/1000)}s)...`);
    await new Promise(resolve => setTimeout(resolve, totalDelay));
    
    let fileContent = '';
    try {
      fileContent = fs.readFileSync(job.filePath, 'utf8').toLowerCase();
    } catch (error) {
      console.log(`Could not read file content for ${job.filename}, treating as clean`);
    }
    
    // Check for dangerous patterns
    const detectedThreats = DANGEROUS_PATTERNS.filter(pattern => 
      fileContent.includes(pattern.pattern.toLowerCase())
    );
    
    const isInfected = detectedThreats.length > 0;
    const result = isInfected ? 'infected' : 'clean';
    const scannedAt = new Date();
    
    
    await FileMeta.findByIdAndUpdate(job.fileId, {
      status: 'scanned',
      result,
      scannedAt
    });
    
    console.log(`Scan completed for ${job.filename}: ${result}`);
    
    
    if (isInfected) {
      console.log(`⚠️  INFECTED FILE DETECTED: ${job.filename}`);
      
      // Send security alert
      const { sendInfectedFileAlert } = await import('../services/notifications');
      const threatPatterns = detectedThreats.map(t => t.pattern);
      const severity = detectedThreats.some(t => t.severity === 'high') ? 'high' : 'medium';
      
      await sendInfectedFileAlert({
        filename: job.filename,
        fileId: job.fileId,
        detectedThreats: threatPatterns,
        timestamp: scannedAt.toISOString(),
        severity
      });
    }
    
  } catch (error) {
    console.error(`Error scanning file ${job.filename}:`, error);
    
    
    await FileMeta.findByIdAndUpdate(job.fileId, {
      status: 'scanned',
      result: 'error',
      scannedAt: new Date()
    });
  }
}; 