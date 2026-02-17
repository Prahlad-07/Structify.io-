export function createNode(value) {
  return { value, left: null, right: null };
}

export function insertNode(root, value) {
  if (!root) return createNode(value);
  if (value < root.value) return { ...root, left: insertNode(root.left, value) };
  if (value > root.value) return { ...root, right: insertNode(root.right, value) };
  return root;
}

export function containsNode(root, value) {
  if (!root) return false;
  if (value === root.value) return true;
  if (value < root.value) return containsNode(root.left, value);
  return containsNode(root.right, value);
}

export function inorderValues(root, acc = []) {
  if (!root) return acc;
  inorderValues(root.left, acc);
  acc.push(root.value);
  inorderValues(root.right, acc);
  return acc;
}

