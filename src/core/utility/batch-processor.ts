export class BatchProcessor {
  static async processInBatches<T, R>(array: T[], batchSize: number, callback: (item: T) => Promise<R>): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < array.length; i += batchSize) {
      const batch = array.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(callback));
      results.push(...batchResults);
    }

    return results;
  }
}
