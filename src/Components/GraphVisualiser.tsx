import { useEffect, useRef } from "react";
import { BinarySearchTree } from "../Models/DataStructures/BinarySearchTree"
import useVisNetwork from "../Hooks/useVisNetwork";
import { Comparable } from "../Models/DataTypes";

interface GraphVisualiserProps {
    tree: BinarySearchTree;
}

export const GraphVisualiser: React.FC<GraphVisualiserProps> = ({tree}) =>  {
    const data = tree.visData;
    const options = {
        nodes: {
          shape: 'circle',
          font: {
            size: 32,
          },
          borderWidth: 2,
        },
        edges: {
          width: 2
        },
        layout: {
            randomSeed: undefined,
            improvedLayout:true,
            clusterThreshold: 150,
            hierarchical: {
              enabled:true,
              levelSeparation: 100,
              nodeSpacing: 200,
              treeSpacing: 100,
              blockShifting: true,
              edgeMinimization: false,
              parentCentralization: true,
              direction: 'UD',        // UD, DU, LR, RL
              sortMethod: 'directed',  // hubsize, directed
              shakeTowards: 'roots'  // roots, leaves
            }
        },
        groups: {
          invisible: {
            opacity: 0,
          }
        }
      };
    const style = {
        width: '100%',
        height: '400px',
        border: '1px solid lightgray'
    };
    const nodes = data.nodes;
    const edges = data.edges;
    
    const { ref, network } = useVisNetwork({options, edges, nodes});

    useEffect(() => {
      if (network) {
            network.setData(tree.visData);
        }
    }, [tree])

    return (
        <div ref={ref} style={style}>
        </div>
    )
}