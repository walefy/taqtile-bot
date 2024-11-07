import { Readable } from 'node:stream';

export interface FileModel {
  filename: string;
  mimetype: string;
  encoding: string;
  readStream: Readable;
}
