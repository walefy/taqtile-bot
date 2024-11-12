import { Readable } from 'node:stream';
import { parse } from 'papaparse';
import { Service } from 'typedi';

@Service()
export class CsvService {
  async toObject(fileStream: Readable): Promise<unknown[]> {
    return new Promise((resolve, reject) => {
      let data = '';

      fileStream.on('data', (chunk) => {
        data += chunk;
      });

      fileStream.on('end', () => {
        parse(data.trim(), {
          header: true,
          complete: (results) => resolve(results.data),
          error: (error: unknown) => reject(error),
        });
      });

      fileStream.on('error', (error) => reject(error));
    });
  }
}
