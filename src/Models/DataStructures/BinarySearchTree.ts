import { Comparable } from '../DataTypes';
import { Graph, GraphNode } from './Graph';
export enum TraverseOrder {
    PreOrder,
    InOrder,
    PostOrder
}

export class BinarySearchTree extends Graph<Comparable>{
    public root: (BinaryTreeNode | null);

    constructor(){
        super();
        this.root = null;
    }

    public get nodes(): BinaryTreeNode[] {
        const nodes: BinaryTreeNode[] = [];
        /**
         * Traverses the tree including the imaginary nodes
         * @param node The node to traverse
         */
        const imaginaryTraversal = (node: BinaryTreeNode | null) => {
            if (node !== null){
                node.id = nodes.length;
                nodes.push(node);
                imaginaryTraversal(node.neighbors[0]);
                imaginaryTraversal(node.neighbors[1]);
            }
        };
        imaginaryTraversal(this.root);
        return nodes;
    }

    /**
     * Creates the binary search tree from an array
     * @param array The array to insert into the tree
     */
    public fromArray(array: Comparable[]): void{
        for (let i = 0; i < array.length; i++){
            this.insert(array[i], this.root);
        }
    }

    /**
     * Checks if the tree contains a value
     * @param value The value to check for
     * @param root The current root of the tree to check
     * @returns true if the tree contains the value, false otherwise
     */
    public contains(value: Comparable, root: BinaryTreeNode | null): boolean {
        if (root !== null){
            if (root.value === value){
                return true;
            }
            else {
                if (this.compare(root.value, value) < 0){
                    return this.contains(value, root.right);
                }
                else {
                    return this.contains(value, root.left);
                }
            }
        }
        else {
            return false;
        }
    }

    /**
     * Inserts a value into the tree
     * @param value The value to insert
     * @param root The current root of the tree to insert into
     */
    public insert(value: Comparable, root: BinaryTreeNode | null): void{
        if (root == null){
            const newNode = new BinaryTreeNode(value);
            if (this.root === null){
                this.root = newNode;
            }
            root = newNode;
        }
        else {
            if (this.compare(root.value, value) > 0){
                if (root.left === null){
                    root.left = new BinaryTreeNode(value);
                } else {
                    this.insert(value, root.left);
                }
            }
            else {
                if (root.right === null){
                    root.right = new BinaryTreeNode(value);
                } else {
                    this.insert(value, root.right);
                }
            }
        }
    }

    /**
     * Deletes a value from the tree
     * @param value The value to delete
     * @param root The current root of the tree to delete from
     */
    public delete(value: Comparable, root: BinaryTreeNode | null){
        let current: BinaryTreeNode | null = root;
        let parent: BinaryTreeNode | null = null;
        // Find the node to delete
        while (current !== null && current.value !== value){
            parent = current;
            if (this.compare(current.value, value) > 0){
                current = current.left;
            }
            else {
                current = current.right;
            }
        }
        // If the node was found
        if (current !== null){
            parent = parent as BinaryTreeNode;
            // If the node has two children
            if (current.left !== null && current.right !== null){
                // Find the rightmost node in the left subtree
                if (current.left.right === null) {
                    // Special case: the the right subtree of the left child is empty
                    current.value = current.left.value;
                    current.left = current.left.left;
                }
                else {
                    let p = current.left;
                    let pp = current;
                    while (p.right !== null){
                        pp = p;
                        p = p.right;
                    }
                    current.value = p.value;
                    pp.right = p.left;
                }
            }
            // If the node has no or one child
            else {
                let child: BinaryTreeNode | null;
                // Find the non-empty child
                if (current.left !== null){
                    child = current.left;
                } else {
                    child = current.right;
                }
                // Replace the node with the child
                if (current === root){
                    root = child;
                }
                else {
                    if (current === parent.left){
                        parent.left = child;
                    } else {
                        parent.right = child;
                    }
                }
            }
        }
    }

    /**
     * Converts the tree to an array
     * @param type The order to traverse the tree in
     * @returns The array representation of the tree
     */
    public toArray(type: TraverseOrder = TraverseOrder.InOrder): Comparable[]{
        let result: Comparable[] = [];
        this.traverse(this.root, type, (node) => {
            result.push(node.value);
        });
        return result;
    }

    /**
     * Traverses the tree, calling the action function on each node
     * @param root The current root of the tree to traverse
     * @param type The order to traverse the tree in
     * @param action The function to call on each node
     */
    private traverse(root: BinaryTreeNode | null, type: TraverseOrder = TraverseOrder.InOrder, 
        action: (node: BinaryTreeNode) => void,
        nullAction?: () => void
        ): void{
        if (root !== null){
            switch (type){
                case TraverseOrder.InOrder:
                    this.traverse(root.left, type, action, nullAction);
                    action(root);
                    this.traverse(root.right, type, action, nullAction);
                    break;
                case TraverseOrder.PreOrder:
                    action(root);
                    this.traverse(root.left, type, action, nullAction);
                    this.traverse(root.right, type, action, nullAction);
                    break;
                case TraverseOrder.PostOrder:
                    this.traverse(root.left, type, action, nullAction);
                    this.traverse(root.right, type, action, nullAction);
                    action(root);
                    break;
            }
        }
    }

    /**
     * Creates a copy of the tree
     * @returns A copy of the tree
     */
    public copy(): BinarySearchTree{
        let result = new BinarySearchTree();
        result.fromArray(this.toArray(TraverseOrder.PreOrder));
        return result;
    }

    private compare(a: Comparable, b: Comparable): number{
        if (a < b){
            return -1;
        }
        else if (a > b){
            return 1;
        }
        else{
            return 0;
        }
    }
}

export class BinaryTreeNode implements GraphNode<Comparable>{
    public value: Comparable;
    private _neighbors: (BinaryTreeNode | null)[] = [];
    public id: number = -1;
    public dummyLeft: BinaryTreeNode | null = null;
    public dummyRight: BinaryTreeNode | null = null;

    get label(): string{
        return this.value.toString();
    }

    get group(): string{
        return this.value.toString() === "" ? "invisible" : "node";
    }

    get neighbors(): (BinaryTreeNode | null)[]{
        if (this._neighbors[0] === null && this._neighbors[1] !== null){
            if (this.dummyLeft === null){
                this.dummyLeft = new BinaryTreeNode("");
            }
            return [this.dummyLeft, this._neighbors[1]];
        } else if (this._neighbors[0] !== null && this._neighbors[1] === null){
            if (this.dummyRight === null){
                this.dummyRight = new BinaryTreeNode("");
            }
            return [this._neighbors[0], this.dummyRight];
        } else {
            return this._neighbors;
        }
    }

    constructor(value: Comparable) { 
        this.value = value;
        this._neighbors = [null, null];
    }

    set left(value: BinaryTreeNode | null){
        this._neighbors[0] = value;
    }

    get left(): BinaryTreeNode | null{
        return this._neighbors[0];
    }

    set right(value: BinaryTreeNode | null){
        this._neighbors[1] = value;
    }

    get right(): BinaryTreeNode | null{
        return this._neighbors[1];
    }
}