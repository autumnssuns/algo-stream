import vis from 'vis-network';

export interface VisData {
    nodes: vis.Node[];
    edges: vis.Edge[];
    options?: vis.Options;
    style?: React.CSSProperties;
}

export class Graph<T> {
    private _nodes: GraphNode<T>[] = [];
    
    get nodes(): GraphNode<T>[] {
        return this._nodes;
    }

    get edges(): GraphEdge<T>[] {
        const edges: GraphEdge<T>[] = [];
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.nodes[i].neighbors.length; j++) {
                if (this.nodes[i].neighbors[j] !== null) {
                    edges.push(new GraphEdge<T>(this.nodes[i], this.nodes[i].neighbors[j]!));
                }
            }
        }
        return edges;
    }

    get visData(): VisData {
        const nodes: vis.Node[] = [];
        const edges: vis.Edge[] = [];

        for (let i = 0; i < this.nodes.length; i++) {
            nodes.push(
                { 
                    id: i, 
                    label: this.nodes[i].label,
                    group: this.nodes[i].group
                });
            for (let j = 0; j < this.nodes[i].neighbors.length; j++) {
                if (this.nodes[i].neighbors[j] !== null) {
                    edges.push({ 
                        from: i, 
                        to: this.nodes[i].neighbors[j]!.id,
                        color: {
                            opacity: this.nodes[i].neighbors[j]!.group === "invisible" ? 0 : 1
                        }
                    });
                }
            }
        }
        return { nodes, edges };
    }
}

export interface GraphNode<T>{
    get neighbors(): (GraphNode<T> | null)[];
    id: number;
    get label(): string;
    get group(): string;
}

export class GraphEdge<T>{
    constructor(
        public start: GraphNode<T>,
        public end: GraphNode<T>
    ) { }
}