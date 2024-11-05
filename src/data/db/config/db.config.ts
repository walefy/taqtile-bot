import { Configure } from '@core/contracts/configure';
import { dbClient } from './db.client';

export class ConfigDatabase implements Configure {
  async configure(): Promise<void> {
    await dbClient.$connect();
  }
}
