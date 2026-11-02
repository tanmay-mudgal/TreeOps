export type BTreeNode = {
  keys: number[];
  children: BTreeNode[];
  leaf: boolean;
};

export type BTreeTraversalOrder =
  | "Inorder"
  | "Preorder"
  | "Postorder"
  | "Level Order";

export const B_TREE_DEGREE = 2;

export function createBTreeNode(leaf = true): BTreeNode {
  return { keys: [], children: [], leaf };
}

export function cloneBTree(
  node: BTreeNode | null
): BTreeNode | null {
  if (!node) return null;

  return {
    keys: [...node.keys],
    leaf: node.leaf,
    children: node.children.map(
      (child) => cloneBTree(child)!
    ),
  };
}

function validateDegree(degree: number): void {
  if (!Number.isInteger(degree) || degree < 2) {
    throw new Error("B-Tree minimum degree must be an integer of at least 2.");
  }
}

export function searchBTree(
  root: BTreeNode | null,
  key: number
): BTreeNode | null {
  let current = root;

  while (current) {
    let i = 0;

    while (i < current.keys.length && key > current.keys[i]) {
      i++;
    }

    if (i < current.keys.length && current.keys[i] === key) {
      return current;
    }

    if (current.leaf) return null;
    current = current.children[i];
  }

  return null;
}

export function bTreeValues(
  root: BTreeNode | null
): number[] {
  if (!root) return [];

  const result: number[] = [];

  function visit(node: BTreeNode): void {
    for (let i = 0; i < node.keys.length; i++) {
      if (!node.leaf) visit(node.children[i]);
      result.push(node.keys[i]);
    }

    if (!node.leaf) {
      visit(node.children[node.keys.length]);
    }
  }

  visit(root);
  return result;
}

export function insertBTree(
  root: BTreeNode | null,
  key: number,
  degree = B_TREE_DEGREE
): BTreeNode {
  validateDegree(degree);

  if (searchBTree(root, key)) {
    return cloneBTree(root)!;
  }

  if (!root) {
    const newRoot = createBTreeNode(true);
    newRoot.keys.push(key);
    return newRoot;
  }

  const result = cloneBTree(root)!;

  if (result.keys.length === 2 * degree - 1) {
    const newRoot = createBTreeNode(false);
    newRoot.children.push(result);
    splitChild(newRoot, 0, degree);
    insertNonFull(newRoot, key, degree);
    return newRoot;
  }

  insertNonFull(result, key, degree);
  return result;
}

function splitChild(
  parent: BTreeNode,
  index: number,
  degree: number
): void {
  const fullChild = parent.children[index];
  const right = createBTreeNode(fullChild.leaf);
  const middleKey = fullChild.keys[degree - 1];

  right.keys = fullChild.keys.splice(degree);
  fullChild.keys.pop();

  if (!fullChild.leaf) {
    right.children = fullChild.children.splice(degree);
  }

  parent.children.splice(index + 1, 0, right);
  parent.keys.splice(index, 0, middleKey);
}

function insertNonFull(
  node: BTreeNode,
  key: number,
  degree: number
): void {
  let i = node.keys.length - 1;

  if (node.leaf) {
    node.keys.push(key);

    while (i >= 0 && key < node.keys[i]) {
      node.keys[i + 1] = node.keys[i];
      i--;
    }

    node.keys[i + 1] = key;
    return;
  }

  while (i >= 0 && key < node.keys[i]) i--;
  i++;

  if (node.children[i].keys.length === 2 * degree - 1) {
    splitChild(node, i, degree);
    if (key > node.keys[i]) i++;
  }

  insertNonFull(node.children[i], key, degree);
}

export function deleteBTree(
  root: BTreeNode | null,
  key: number,
  degree = B_TREE_DEGREE
): BTreeNode | null {
  validateDegree(degree);

  if (!root || !searchBTree(root, key)) {
    return cloneBTree(root);
  }

  const result = cloneBTree(root)!;
  deleteFromNode(result, key, degree);

  if (result.keys.length === 0) {
    if (result.leaf) return null;
    return result.children[0] ?? null;
  }

  return result;
}

function findKey(node: BTreeNode, key: number): number {
  let index = 0;

  while (index < node.keys.length && node.keys[index] < key) {
    index++;
  }

  return index;
}

function deleteFromNode(
  node: BTreeNode,
  key: number,
  degree: number
): void {
  const index = findKey(node, key);

  if (index < node.keys.length && node.keys[index] === key) {
    if (node.leaf) {
      node.keys.splice(index, 1);
    } else {
      deleteFromInternalNode(node, index, degree);
    }
    return;
  }

  if (node.leaf) return;

  let childIndex = index;

  if (node.children[childIndex].keys.length === degree - 1) {
    fillChild(node, childIndex, degree);

    if (childIndex > node.keys.length) childIndex--;
  }

  deleteFromNode(node.children[childIndex], key, degree);
}

function deleteFromInternalNode(
  node: BTreeNode,
  index: number,
  degree: number
): void {
  const key = node.keys[index];
  const left = node.children[index];
  const right = node.children[index + 1];

  if (left.keys.length >= degree) {
    const predecessor = getPredecessor(left);
    node.keys[index] = predecessor;
    deleteFromNode(left, predecessor, degree);
  } else if (right.keys.length >= degree) {
    const successor = getSuccessor(right);
    node.keys[index] = successor;
    deleteFromNode(right, successor, degree);
  } else {
    mergeChildren(node, index);
    deleteFromNode(left, key, degree);
  }
}

function getPredecessor(node: BTreeNode): number {
  let current = node;

  while (!current.leaf) {
    current = current.children[current.children.length - 1];
  }

  return current.keys[current.keys.length - 1];
}

function getSuccessor(node: BTreeNode): number {
  let current = node;

  while (!current.leaf) {
    current = current.children[0];
  }

  return current.keys[0];
}

function fillChild(
  parent: BTreeNode,
  index: number,
  degree: number
): void {
  if (
    index > 0 &&
    parent.children[index - 1].keys.length >= degree
  ) {
    borrowFromPrevious(parent, index);
  } else if (
    index < parent.keys.length &&
    parent.children[index + 1].keys.length >= degree
  ) {
    borrowFromNext(parent, index);
  } else if (index < parent.keys.length) {
    mergeChildren(parent, index);
  } else {
    mergeChildren(parent, index - 1);
  }
}

function borrowFromPrevious(
  parent: BTreeNode,
  index: number
): void {
  const child = parent.children[index];
  const sibling = parent.children[index - 1];

  child.keys.unshift(parent.keys[index - 1]);

  if (!child.leaf) {
    child.children.unshift(sibling.children.pop()!);
  }

  parent.keys[index - 1] = sibling.keys.pop()!;
}

function borrowFromNext(
  parent: BTreeNode,
  index: number
): void {
  const child = parent.children[index];
  const sibling = parent.children[index + 1];

  child.keys.push(parent.keys[index]);

  if (!child.leaf) {
    child.children.push(sibling.children.shift()!);
  }

  parent.keys[index] = sibling.keys.shift()!;
}

function mergeChildren(parent: BTreeNode, index: number): void {
  const left = parent.children[index];
  const right = parent.children[index + 1];

  left.keys.push(parent.keys[index], ...right.keys);

  if (!left.leaf) {
    left.children.push(...right.children);
  }

  parent.keys.splice(index, 1);
  parent.children.splice(index + 1, 1);
}

export function traverseBTree(
  root: BTreeNode | null,
  order: BTreeTraversalOrder
): number[] {
  if (!root) return [];

  const result: number[] = [];

  if (order === "Level Order") {
    const queue: BTreeNode[] = [root];

    while (queue.length) {
      const node = queue.shift()!;
      result.push(...node.keys);
      queue.push(...node.children);
    }

    return result;
  }

  function visit(node: BTreeNode): void {
    if (order === "Preorder") result.push(...node.keys);

    for (let i = 0; i < node.keys.length; i++) {
      if (!node.leaf) visit(node.children[i]);
      if (order === "Inorder") result.push(node.keys[i]);
    }

    if (!node.leaf) visit(node.children[node.keys.length]);
    if (order === "Postorder") result.push(...node.keys);
  }

  visit(root);
  return result;
}