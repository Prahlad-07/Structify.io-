import React, { useMemo, useReducer } from "react";
import {
  INITIAL_VISUALIZER_STATE,
  visualizerReducer,
} from "../state/visualizerReducer";
import "../visualizer.css";

const STRUCTURES = [
  { key: "stack", label: "Stack" },
  { key: "queue", label: "Queue" },
  { key: "linkedList", label: "Linked List" },
  { key: "bst", label: "Binary Search Tree" },
];

function Controls({ state, dispatch }) {
  const isTree = state.activeStructure === "bst";
  const inputPlaceholder = isTree ? "Enter number (e.g. 42)" : "Enter value";

  const actionButtons = {
    stack: [
      ["Push", "STACK_PUSH"],
      ["Pop", "STACK_POP"],
      ["Peek", "STACK_PEEK"],
    ],
    queue: [
      ["Enqueue", "QUEUE_ENQUEUE"],
      ["Dequeue", "QUEUE_DEQUEUE"],
      ["Peek", "QUEUE_PEEK"],
    ],
    linkedList: [
      ["Append", "LL_APPEND"],
      ["Prepend", "LL_PREPEND"],
      ["Delete", "LL_DELETE"],
      ["Find", "LL_FIND"],
    ],
    bst: [
      ["Insert", "BST_INSERT"],
      ["Search", "BST_SEARCH"],
      ["Inorder", "BST_TRAVERSE"],
    ],
  }[state.activeStructure];

  return (
    <div className="viz-controls card">
      <label htmlFor="viz-input">Value</label>
      <input
        id="viz-input"
        value={state.inputValue}
        placeholder={inputPlaceholder}
        onChange={(e) => dispatch({ type: "SET_INPUT", payload: e.target.value })}
      />
      <div className="btn-grid">
        {actionButtons.map(([label, action]) => (
          <button key={action} onClick={() => dispatch({ type: action })}>
            {label}
          </button>
        ))}
        <button className="danger" onClick={() => dispatch({ type: "CLEAR_ACTIVE" })}>
          Clear
        </button>
      </div>
      <div className="status">{state.message}</div>
    </div>
  );
}

function StackView({ values }) {
  return (
    <div className="card viz-stage">
      <h3>Top</h3>
      <div className="stack-wrap">
        {[...values].reverse().map((value, idx) => (
          <div className="stack-item" key={`${value}-${idx}`}>
            {value}
          </div>
        ))}
        {!values.length && <div className="empty-state">Stack is empty</div>}
      </div>
      <h3>Bottom</h3>
    </div>
  );
}

function QueueView({ values }) {
  return (
    <div className="card viz-stage">
      <div className="queue-meta">
        <span>Front</span>
        <span>Rear</span>
      </div>
      <div className="queue-wrap">
        {values.map((value, idx) => (
          <div className="queue-item" key={`${value}-${idx}`}>
            {value}
          </div>
        ))}
        {!values.length && <div className="empty-state">Queue is empty</div>}
      </div>
    </div>
  );
}

function LinkedListView({ values }) {
  return (
    <div className="card viz-stage">
      <div className="ll-wrap">
        {values.map((value, idx) => (
          <React.Fragment key={`${value}-${idx}`}>
            <div className="ll-node">{value}</div>
            {idx < values.length - 1 && <div className="ll-arrow">→</div>}
          </React.Fragment>
        ))}
        {!values.length && <div className="empty-state">Linked list is empty</div>}
      </div>
    </div>
  );
}

function buildTreeNodes(root, width = 860) {
  const nodes = [];
  const edges = [];

  function walk(node, x, y, gap) {
    if (!node) return;
    nodes.push({ x, y, value: node.value });
    if (node.left) {
      const lx = x - gap;
      const ly = y + 80;
      edges.push({ x1: x, y1: y, x2: lx, y2: ly });
      walk(node.left, lx, ly, Math.max(42, gap * 0.58));
    }
    if (node.right) {
      const rx = x + gap;
      const ry = y + 80;
      edges.push({ x1: x, y1: y, x2: rx, y2: ry });
      walk(node.right, rx, ry, Math.max(42, gap * 0.58));
    }
  }

  walk(root, width / 2, 44, width / 5);
  return { nodes, edges };
}

function BstView({ root }) {
  const { nodes, edges } = useMemo(() => buildTreeNodes(root), [root]);

  return (
    <div className="card viz-stage tree">
      {!root ? (
        <div className="empty-state">Tree is empty</div>
      ) : (
        <svg viewBox="0 0 860 420" className="tree-svg" role="img" aria-label="BST visualization">
          {edges.map((edge, idx) => (
            <line
              key={`e-${idx}`}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="#8ea0ba"
              strokeWidth="2"
            />
          ))}
          {nodes.map((node, idx) => (
            <g key={`n-${idx}`} transform={`translate(${node.x}, ${node.y})`}>
              <circle r="20" fill="#1f3c88" />
              <text textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="12">
                {node.value}
              </text>
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

export default function VisualizerWorkspace() {
  const [state, dispatch] = useReducer(visualizerReducer, INITIAL_VISUALIZER_STATE);

  return (
    <main className="viz-page">
      <section className="viz-hero">
        <h1>Data Structure Visualizer</h1>
        <p>Interactive playground with clear operations and clean visuals.</p>
      </section>

      <section className="viz-tabs card">
        {STRUCTURES.map((item) => (
          <button
            key={item.key}
            className={state.activeStructure === item.key ? "active" : ""}
            onClick={() => dispatch({ type: "SET_STRUCTURE", payload: item.key })}
          >
            {item.label}
          </button>
        ))}
      </section>

      <section className="viz-layout">
        <Controls state={state} dispatch={dispatch} />
        {state.activeStructure === "stack" && <StackView values={state.stack} />}
        {state.activeStructure === "queue" && <QueueView values={state.queue} />}
        {state.activeStructure === "linkedList" && <LinkedListView values={state.linkedList} />}
        {state.activeStructure === "bst" && <BstView root={state.bstRoot} />}
      </section>
    </main>
  );
}

