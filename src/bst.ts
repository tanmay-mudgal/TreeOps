import type { BinaryNode, TraversalOrder } from './binaryTree'

export function insertBST(
  root: BinaryNode | null,
  key: number,
): BinaryNode {
  if (!root) {
    return { key, left: null, right: null }
  }

  if (key < root.key) {
    root.left = insertBST(root.left, key)
  } else if (key > root.key) {
    root.right = insertBST(root.right, key)
  }

  return root
}

export function searchBST(
  root: BinaryNode | null,
  key: number,
): boolean {
  let current = root

  while (current) {
    if (key === current.key) return true
    current = key < current.key ? current.left : current.right
  }

  return false
}

export function findBSTPath(
  root: BinaryNode | null,
  key: number,
): number[] {
  const path: number[] = []
  let current = root

  while (current) {
    path.push(current.key)

    if (key === current.key) break

    current = key < current.key ? current.left : current.right
  }

  return path
}

function minimumNode(node: BinaryNode): BinaryNode {
  let current = node

  while (current.left) {
    current = current.left
  }

  return current
}

export function deleteBST(
  root: BinaryNode | null,
  key: number,
): BinaryNode | null {
  if (!root) return null

  if (key < root.key) {
    root.left = deleteBST(root.left, key)
  } else if (key > root.key) {
    root.right = deleteBST(root.right, key)
  } else {
    // Case 1: no left child.
    if (!root.left) return root.right

    // Case 2: no right child.
    if (!root.right) return root.left

    // Case 3: two children.
    // Replace with the inorder successor.
    const successor = minimumNode(root.right)
    root.key = successor.key
    root.right = deleteBST(root.right, successor.key)
  }

  return root
}

export function traverseBST(
  root: BinaryNode | null,
  order: TraversalOrder,
): number[] {
  const result: number[] = []

  function visit(node: BinaryNode | null) {
    if (!node) return

    if (order === 'Preorder') result.push(node.key)
    visit(node.left)
    if (order === 'Inorder') result.push(node.key)
    visit(node.right)
    if (order === 'Postorder') result.push(node.key)
  }

  visit(root)
  return result
}

export function bstValues(root: BinaryNode | null): number[] {
  const result: number[] = []
  const queue: BinaryNode[] = []

  if (root) queue.push(root)

  while (queue.length) {
    const node = queue.shift()!
    result.push(node.key)

    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }

  return result
}