export type BinaryNode = {
  key: number
  left: BinaryNode | null
  right: BinaryNode | null
}

export type TraversalOrder = 'Inorder' | 'Preorder' | 'Postorder'

export function createNode(key: number): BinaryNode {
  return { key, left: null, right: null }
}

// Insert into the first available position, level by level.
export function insertNode(
  root: BinaryNode | null,
  key: number,
): BinaryNode {
  if (!root) return createNode(key)

  const queue: BinaryNode[] = [root]

  while (queue.length > 0) {
    const node = queue.shift()!

    if (!node.left) {
      node.left = createNode(key)
      return root
    }
    queue.push(node.left)

    if (!node.right) {
      node.right = createNode(key)
      return root
    }
    queue.push(node.right)
  }

  return root
}

export function searchNode(
  root: BinaryNode | null,
  key: number,
): boolean {
  if (!root) return false

  const queue: BinaryNode[] = [root]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (node.key === key) return true

    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }

  return false
}

// Delete the target by replacing it with the deepest,
// rightmost node, then removing that deepest node.
export function deleteNode(
  root: BinaryNode | null,
  key: number,
): BinaryNode | null {
  if (!root) return null

  const queue: Array<{
    node: BinaryNode
    parent: BinaryNode | null
  }> = [{ node: root, parent: null }]

  let target: BinaryNode | null = null
  let deepest: BinaryNode = root
  let deepestParent: BinaryNode | null = null

  while (queue.length > 0) {
    const current = queue.shift()!

    if (current.node.key === key) {
      target = current.node
    }

    deepest = current.node
    deepestParent = current.parent

    if (current.node.left) {
      queue.push({
        node: current.node.left,
        parent: current.node,
      })
    }

    if (current.node.right) {
      queue.push({
        node: current.node.right,
        parent: current.node,
      })
    }
  }

  if (!target) return root

  target.key = deepest.key

  if (!deepestParent) return null

  if (deepestParent.left === deepest) {
    deepestParent.left = null
  } else {
    deepestParent.right = null
  }

  return root
}

export function traverse(
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

export function findSearchPath(
  root: BinaryNode | null,
  key: number,
): number[] {
  const visited: number[] = []
  if (!root) return visited

  const queue: BinaryNode[] = [root]

  while (queue.length > 0) {
    const node = queue.shift()!
    visited.push(node.key)

    if (node.key === key) break

    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }

  return visited
}