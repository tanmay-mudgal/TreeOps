export type AVLNode = {
    key: number
    height: number
    left: AVLNode | null
    right: AVLNode | null
}

export type AVLTraversalOrder =
    | 'Inorder'
    | 'Preorder'
    | 'Postorder'

export type AVLRotation =
    | 'LL'
    | 'RR'
    | 'LR'
    | 'RL'

export type AVLInsertResult = {
    root: AVLNode
    rotation: AVLRotation | null
}

function height(node: AVLNode | null): number {
    return node ? node.height : 0
}

function updateHeight(node: AVLNode): void {
    node.height =
        1 + Math.max(height(node.left), height(node.right))
}

export function getBalance(node: AVLNode | null): number {
    return node
        ? height(node.left) - height(node.right)
        : 0
}

function createNode(key: number): AVLNode {
    return {
        key,
        height: 1,
        left: null,
        right: null,
    }
}

function rotateRight(y: AVLNode): AVLNode {
    const x = y.left!

    y.left = x.right
    x.right = y

    updateHeight(y)
    updateHeight(x)

    return x
}

function rotateLeft(x: AVLNode): AVLNode {
    const y = x.right!

    x.right = y.left
    y.left = x

    updateHeight(x)
    updateHeight(y)

    return y
}

function rebalance(
    node: AVLNode,
): { root: AVLNode; rotation: AVLRotation | null } {
    updateHeight(node)

    const balance = getBalance(node)

    // Left-heavy subtree
    if (balance > 1) {
        if (getBalance(node.left) < 0) {
            // Left-Right case
            node.left = rotateLeft(node.left!)
            return {
                root: rotateRight(node),
                rotation: 'LR',
            }
        }

        // Left-Left case
        return {
            root: rotateRight(node),
            rotation: 'LL',
        }
    }

    // Right-heavy subtree
    if (balance < -1) {
        if (getBalance(node.right) > 0) {
            // Right-Left case
            node.right = rotateRight(node.right!)
            return {
                root: rotateLeft(node),
                rotation: 'RL',
            }
        }

        // Right-Right case
        return {
            root: rotateLeft(node),
            rotation: 'RR',
        }
    }

    return { root: node, rotation: null }
}

export function insertAVL(
    root: AVLNode | null,
    key: number,
): AVLInsertResult {
    if (!root) {
        return { root: createNode(key), rotation: null }
    }

    if (key === root.key) {
        return { root, rotation: null }
    }

    let childResult: AVLInsertResult

    if (key < root.key) {
        childResult = insertAVL(root.left, key)
        root.left = childResult.root
    } else {
        childResult = insertAVL(root.right, key)
        root.right = childResult.root
    }

    const balanced = rebalance(root)

    return {
        root: balanced.root,
        rotation: balanced.rotation ?? childResult.rotation,
    }
}

export function searchAVL(
    root: AVLNode | null,
    key: number,
): boolean {
    let current = root

    while (current) {
        if (key === current.key) return true

        current = key < current.key
            ? current.left
            : current.right
    }

    return false
}

export function findAVLPath(
    root: AVLNode | null,
    key: number,
): number[] {
    const path: number[] = []
    let current = root

    while (current) {
        path.push(current.key)

        if (key === current.key) break

        current = key < current.key
            ? current.left
            : current.right
    }

    return path
}

function minimumNode(node: AVLNode): AVLNode {
    let current = node

    while (current.left) {
        current = current.left
    }

    return current
}

export function deleteAVL(
    root: AVLNode | null,
    key: number,
): AVLNode | null {
    if (!root) return null

    if (key < root.key) {
        root.left = deleteAVL(root.left, key)
    } else if (key > root.key) {
        root.right = deleteAVL(root.right, key)
    } else {
        // No left child, or no children
        if (!root.left) return root.right
        if (!root.right) return root.left

        // Two children: replace with inorder successor
        const successor = minimumNode(root.right)
        root.key = successor.key
        root.right = deleteAVL(root.right, successor.key)
    }

    return rebalance(root).root
}

export function traverseAVL(
    root: AVLNode | null,
    order: AVLTraversalOrder,
): number[] {
    const result: number[] = []

    function visit(node: AVLNode | null): void {
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

export function avlValues(root: AVLNode | null): number[] {
    return traverseAVL(root, 'Inorder')
}

export function cloneAVL(
    node: AVLNode | null,
): AVLNode | null {
    if (!node) return null

    return {
        key: node.key,
        height: node.height,
        left: cloneAVL(node.left),
        right: cloneAVL(node.right),
    }
}