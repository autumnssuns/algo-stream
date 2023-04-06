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
        this.tracker.isComplete = false;
        this.tracker.record(new BinarySearchTreeInsertSnapshot(
            new BinarySearchTree().fromNode(binarySearchTree.root === null ? null : binarySearchTree.root.deepCopy(["visited", "current"])),
            { node: 0 },
            null,
            `Try to insert ${value}`,
            0
        ));
        this.insert(value, binarySearchTree.root);
        this.tracker.isComplete = true;
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

    private findRoot(node: BinaryTreeNode | null): BinaryTreeNode | null {
        if (node === null) {
            return null;
        }
        if (node.parent === null) {
            return node;
        }
        return this.findRoot(node.parent);
    }

    private insert(value: Comparable, node: BinaryTreeNode | null): void {
        const root = this.findRoot(node);
        if (node !== null) {
            node.group = "visited"
        }
        if (node === null) {
            // Create a new node
            this.tracker.record(new BinarySearchTreeInsertSnapshot(
                root === null ? new BinarySearchTree().fromNode(node) : new BinarySearchTree().fromNode(root.deepCopy(["visited", "current"])),
                { node: 0 },
                null,
                `Empty node found.`,
                2
            ));
            node = new BinaryTreeNode(value);
            this.tracker.record(new BinarySearchTreeInsertSnapshot(
                root === null ? new BinarySearchTree().fromNode(node) : new BinarySearchTree().fromNode(root.deepCopy(["visited", "current"])),
                { node: 0 },
                null,
                `Inserted new node`,
                3
            ));
            return;
        }
        if (this.compare(value, node.value) < 0) {
            if (node.left === null){
                // Create a new node
                this.tracker.record(new BinarySearchTreeInsertSnapshot(
                    new BinarySearchTree().fromNode(root!.deepCopy()),
                    { node: 0 },
                    null,
                    `Try to insert into left node`,
                    1
                ));
                node.left = new BinaryTreeNode(value);
                this.tracker.record(new BinarySearchTreeInsertSnapshot(
                    new BinarySearchTree().fromNode(root!.deepCopy()),
                    { node: 0 },
                    null,
                    `Inserted into left node`,
                    3
                ));
            } else {
                node.left.group = "current";
                this.tracker.record(new BinarySearchTreeInsertSnapshot(
                    new BinarySearchTree().fromNode(root!.deepCopy()),
                    { node: 0 },
                    null,
                    `Cannot insert, move down to left subtree`,
                    3
                ));
                this.insert(value, node.left);
            }
        } else {
            if (node.right === null){
                // Create a new node
                this.tracker.record(new BinarySearchTreeInsertSnapshot(
                    new BinarySearchTree().fromNode(root!.deepCopy()),
                    { node: 0 },
                    null,
                    `Try to insert into right node`,
                    1
                ));
                node.right = new BinaryTreeNode(value);
                this.tracker.record(new BinarySearchTreeInsertSnapshot(
                    new BinarySearchTree().fromNode(root!.deepCopy()),
                    { node: 0 },
                    null,
                    `Inserted into right node`,
                    3
                ));
            } else {
                node.right.group = "current";
                this.tracker.record(new BinarySearchTreeInsertSnapshot(
                    new BinarySearchTree().fromNode(root!.deepCopy()),
                    { node: 0 },
                    null,
                    `Cannot insert, move down to right subtree`,
                    3
                ));
                this.insert(value, node.right);
            }
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