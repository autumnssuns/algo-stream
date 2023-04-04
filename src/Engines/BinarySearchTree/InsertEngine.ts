import { Tracker } from '../../Models/Utils';
import { AlgorithmEngine, Extra, Pointers, Snapshot } from './../AlgorithmEngine';
import { BinarySearchTree, BinaryTreeNode } from '../../Models/DataStructures/BinarySearchTree';
import { Comparable } from '../../Models/DataTypes';

export class BinarySearchTreeInsertSnapshot implements Snapshot<Comparable> {
    constructor(
        public binarySearchTree: BinarySearchTree,
        public pointers: Pointers,
        public extra: Extra | null,
        public label: string,
        public algorithmLine: number
        ) { }
}

export class InsertEngine implements AlgorithmEngine {
    protected tracker: Tracker<BinarySearchTreeInsertSnapshot>;
    constructor(tracker: Tracker<BinarySearchTreeInsertSnapshot>) {
        this.tracker = tracker;
    }

    run(binarySearchTree: BinarySearchTree, value: Comparable): void {
        this.insert(value, binarySearchTree.root);
        // console.log(this.tracker);
    }

    private compare(a: Comparable, b: Comparable): number {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }

    private insert(value: Comparable, node: BinaryTreeNode | null): void {
        console.log(this.tracker);
        if (node === null) {
            // Create a new node
            node = new BinaryTreeNode(value);
            this.tracker.record(new BinarySearchTreeInsertSnapshot(
                new BinarySearchTree().fromNode(node.deepCopy()),
                { node: 0 },
                null,
                `Create a new node with value ${value}`,
                1
            ));
            return;
        }
        node.group = "visited";
        if (this.compare(value, node.value) < 0) {
            // Insert into left subtree
            this.insert(value, node.left);
            node.left = this.tracker.getSnapshot(this.tracker.size - 1).binarySearchTree.root;
            this.tracker.record(new BinarySearchTreeInsertSnapshot(
                new BinarySearchTree().fromNode(node.deepCopy()),
                { node: 0 },
                null,
                `Insert into left subtree`,
                2
            ));
        } else {
            // Insert into right subtree
            this.insert(value, node.right);
            node.right = this.tracker.getSnapshot(this.tracker.size - 1).binarySearchTree.root;
            this.tracker.record(new BinarySearchTreeInsertSnapshot(
                new BinarySearchTree().fromNode(node.deepCopy()),
                { node: 0 },
                null,
                `Insert into right subtree`,
                3
            ));
        }
    }

    get pseudocode(): string {
        return `function insert(value, node) 
    if node is null
        return new Node(value)
    if value < node.value
        node.left = insert(value, node.left)
    else
        node.right = insert(value, node.right)
    return node`;
    }
}