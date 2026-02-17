import { containsNode, inorderValues, insertNode } from "../utils/bst";

export const INITIAL_VISUALIZER_STATE = {
  activeStructure: "stack",
  inputValue: "",
  stack: [],
  queue: [],
  linkedList: [],
  bstRoot: null,
  message: "Ready",
};

function parseValue(raw) {
  return raw.trim();
}

export function visualizerReducer(state, action) {
  switch (action.type) {
    case "SET_STRUCTURE":
      return { ...state, activeStructure: action.payload, message: "Ready" };
    case "SET_INPUT":
      return { ...state, inputValue: action.payload };
    case "STACK_PUSH": {
      const value = parseValue(state.inputValue);
      if (!value) return { ...state, message: "Enter a value first." };
      return {
        ...state,
        stack: [...state.stack, value],
        inputValue: "",
        message: `Pushed ${value} to stack.`,
      };
    }
    case "STACK_POP": {
      if (!state.stack.length) return { ...state, message: "Stack is empty." };
      const popped = state.stack[state.stack.length - 1];
      return {
        ...state,
        stack: state.stack.slice(0, -1),
        message: `Popped ${popped}.`,
      };
    }
    case "STACK_PEEK": {
      if (!state.stack.length) return { ...state, message: "Stack is empty." };
      return { ...state, message: `Top = ${state.stack[state.stack.length - 1]}` };
    }
    case "QUEUE_ENQUEUE": {
      const value = parseValue(state.inputValue);
      if (!value) return { ...state, message: "Enter a value first." };
      return {
        ...state,
        queue: [...state.queue, value],
        inputValue: "",
        message: `Enqueued ${value}.`,
      };
    }
    case "QUEUE_DEQUEUE": {
      if (!state.queue.length) return { ...state, message: "Queue is empty." };
      const [head, ...rest] = state.queue;
      return { ...state, queue: rest, message: `Dequeued ${head}.` };
    }
    case "QUEUE_PEEK": {
      if (!state.queue.length) return { ...state, message: "Queue is empty." };
      return { ...state, message: `Front = ${state.queue[0]}` };
    }
    case "LL_APPEND": {
      const value = parseValue(state.inputValue);
      if (!value) return { ...state, message: "Enter a value first." };
      return {
        ...state,
        linkedList: [...state.linkedList, value],
        inputValue: "",
        message: `Appended ${value}.`,
      };
    }
    case "LL_PREPEND": {
      const value = parseValue(state.inputValue);
      if (!value) return { ...state, message: "Enter a value first." };
      return {
        ...state,
        linkedList: [value, ...state.linkedList],
        inputValue: "",
        message: `Prepended ${value}.`,
      };
    }
    case "LL_DELETE": {
      const value = parseValue(state.inputValue);
      if (!value) return { ...state, message: "Enter a value first." };
      const idx = state.linkedList.findIndex((v) => v === value);
      if (idx === -1) return { ...state, message: `${value} not found.` };
      const next = [...state.linkedList];
      next.splice(idx, 1);
      return {
        ...state,
        linkedList: next,
        inputValue: "",
        message: `Deleted ${value}.`,
      };
    }
    case "LL_FIND": {
      const value = parseValue(state.inputValue);
      if (!value) return { ...state, message: "Enter a value first." };
      const idx = state.linkedList.findIndex((v) => v === value);
      return {
        ...state,
        message: idx === -1 ? `${value} not found.` : `${value} found at index ${idx}.`,
      };
    }
    case "BST_INSERT": {
      const value = Number(parseValue(state.inputValue));
      if (Number.isNaN(value)) return { ...state, message: "Enter a valid number." };
      if (containsNode(state.bstRoot, value)) {
        return { ...state, inputValue: "", message: `${value} already exists.` };
      }
      return {
        ...state,
        bstRoot: insertNode(state.bstRoot, value),
        inputValue: "",
        message: `Inserted ${value}.`,
      };
    }
    case "BST_SEARCH": {
      const value = Number(parseValue(state.inputValue));
      if (Number.isNaN(value)) return { ...state, message: "Enter a valid number." };
      return {
        ...state,
        message: containsNode(state.bstRoot, value) ? `${value} exists in tree.` : `${value} not found.`,
      };
    }
    case "BST_TRAVERSE":
      return { ...state, message: `Inorder: ${inorderValues(state.bstRoot).join(", ") || "empty"}` };
    case "CLEAR_ACTIVE":
      if (state.activeStructure === "stack") return { ...state, stack: [], message: "Stack cleared." };
      if (state.activeStructure === "queue") return { ...state, queue: [], message: "Queue cleared." };
      if (state.activeStructure === "linkedList")
        return { ...state, linkedList: [], message: "Linked list cleared." };
      return { ...state, bstRoot: null, message: "Tree cleared." };
    default:
      return state;
  }
}

