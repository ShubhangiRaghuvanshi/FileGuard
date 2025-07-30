interface ScanJob {
  fileId: string;
  filePath: string;
  filename: string;
}

class InMemoryQueue {
  private queue: ScanJob[] = [];
  private processing = false;

  enqueue(job: ScanJob) {
    this.queue.push(job);
    console.log(`Job enqueued for file: ${job.filename}`);
    this.processNext();
  }

  private async processNext() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const job = this.queue.shift();
    
    if (job) {
      try {
        await this.processJob(job);
      } catch (error) {
        console.error('Error processing job:', error);
      }
    }

    this.processing = false;
    
    // Process next job if available
    if (this.queue.length > 0) {
      this.processNext();
    }
  }

  private async processJob(job: ScanJob) {
    console.log(`Processing scan job for: ${job.filename}`);
    
    // Import scanner here to avoid circular dependencies
    const { scanFile } = await import('../worker/scanner');
    await scanFile(job);
  }
}

export const scanQueue = new InMemoryQueue(); 