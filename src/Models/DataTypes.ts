/**
 * Interface for a comparable object.
 */
export interface IComparable {
  /**
   * Compares this object with the specified object for order. 
   * Returns -1, zero, or 1 as this object is less than, equal to, 
   * or greater than the specified object.
   * @param other 
   */
    compare(other: IComparable): number;
}

/**
 * Class for a comparable number.
 */
export class ComparableNumber implements IComparable {
  constructor(public value: number) { }

  compare(other: IComparable): number {
    if (other instanceof ComparableNumber) {
      if (this.value < other.value) {
        return -1;
      } else if (this.value > other.value) {
        return 1;
      } else {
        return 0;
      }
    }
    throw new Error("Cannot compare ComparableNumber with other type");
  }

  public toString(): string {
    return this.value.toString();
  }
}