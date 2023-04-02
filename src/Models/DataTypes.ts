export type Comparable = string | number | boolean | IComparable;

export interface IComparable {
    compareTo(other: IComparable): number;
    toString(): string;
}