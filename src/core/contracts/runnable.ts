export interface Runnable<T> {
  run(): Promise<T>;
}
