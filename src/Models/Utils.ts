export class Tracker<T> {
  getSnapshot(index: number) {
    return this._log[index];
  }
  private _log: T[] = [];
  public cursor: number = 0;
  public isComplete: boolean = false;

  public get size(): number {
    return this._log.length;
  }

  public get log(): T[] {
    return this._log;
  }

  public record(snapshot: T) {
    this._log.push(snapshot);
    this.cursor++;
  }
}