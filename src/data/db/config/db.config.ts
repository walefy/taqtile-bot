import { Configure } from '@core/configure';
import { dbClient } from './db.client';

export class ConfigDatabase implements Configure {
  async configure(): Promise<void> {
    await dbClient.$connect();
  }
}
