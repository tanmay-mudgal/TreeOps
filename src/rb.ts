export type RBColor = 'RED' | 'BLACK'

export type RBNode = {
    key: number
    color: RBColor
    left: RBNode | null
    right: RBNode | null
    parent: RBNode | null
}

export type RBTraversalOrder =
    | 'Inorder'
    | 'Preorder'
    | 'Postorder'

export type RBInsertResult = {
    root: RBNode
    rotation: string | null
}

function createNode(key: number): RBNode {
    return {
        key,
        color: 'RED',
        left: null,
        right: null,
        parent: null,
    }
}

function colorOf(node: RBNode | null): RBColor {
    return node?.color ?? 'BLACK'
}

function setColor(
    node: RBNode | null,
    color: RBColor,
): void {
    if (node) node.color = color
}

function rotateLeft(
    root: RBNode,
    x: RBNode,
): RBNode {
    const y = x.right
    if (!y) return root

    x.right = y.left

    if (y.left) y.left.parent = x

    y.parent = x.parent

    if (!x.parent) {
        root = y
    } else if (x === x.parent.left) {
        x.parent.left = y
    } else {
        x.parent.right = y
    }

    y.left = x
    x.parent = y

    return root
}

function rotateRight(
    root: RBNode,
    y: RBNode,
): RBNode {
    const x = y.left
    if (!x) return root

    y.left = x.right

    if (x.right) x.right.parent = y

    x.parent = y.parent

    if (!y.parent) {
        root = x
    } else if (y === y.parent.left) {
        y.parent.left = x
    } else {
        y.parent.right = x
    }

    x.right = y
    y.parent = x

    return root
}

export function searchRB(
    root: RBNode | null,
    key: number,
): boolean {
    let current = root

    while (current) {
        if (key === current.key) return true

        current =
            key < current.key
                ? current.left
                : current.right
    }

    return false
}

export function findRBPath(
    root: RBNode | null,
    key: number,
): number[] {
    const path: number[] = []
    let current = root

    while (current) {
        path.push(current.key)

        if (key === current.key) break

        current =
            key < current.key
                ? current.left
                : current.right
    }

    return path
}

export function insertRB(
    originalRoot: RBNode | null,
    key: number,
): RBInsertResult {
    if (!originalRoot) {
        const root = createNode(key)
        root.color = 'BLACK'
        return { root, rotation: null }
    }

    let parent: RBNode | null = null
    let current: RBNode | null = originalRoot

    while (current) {
        parent = current

        if (key === current.key) {
            return {
                root: originalRoot,
                rotation: null,
            }
        }

        current =
            key < current.key
                ? current.left
                : current.right
    }

    const node = createNode(key)
    node.parent = parent

    if (key < parent!.key) {
        parent!.left = node
    } else {
        parent!.right = node
    }

    let root = originalRoot
    let rotation: string | null = null
    let z: RBNode = node

    while (
        z.parent &&
        z.parent.color === 'RED'
    ) {
        const parentNode = z.parent
        const grandparent = parentNode.parent!

        if (parentNode === grandparent.left) {
            const uncle = grandparent.right

            if (colorOf(uncle) === 'RED') {
                parentNode.color = 'BLACK'
                setColor(uncle, 'BLACK')
                grandparent.color = 'RED'
                z = grandparent
            } else {
                if (z === parentNode.right) {
                    z = parentNode
                    root = rotateLeft(root, z)
                    rotation = 'Left rotation'
                }

                z.parent!.color = 'BLACK'
                z.parent!.parent!.color = 'RED'
                root = rotateRight(root, z.parent!.parent!)
                rotation = rotation
                    ? `${rotation} + Right rotation`
                    : 'Right rotation'
            }
        } else {
            const uncle = grandparent.left

            if (colorOf(uncle) === 'RED') {
                parentNode.color = 'BLACK'
                setColor(uncle, 'BLACK')
                grandparent.color = 'RED'
                z = grandparent
            } else {
                if (z === parentNode.left) {
                    z = parentNode
                    root = rotateRight(root, z)
                    rotation = 'Right rotation'
                }

                z.parent!.color = 'BLACK'
                z.parent!.parent!.color = 'RED'
                root = rotateLeft(root, z.parent!.parent!)
                rotation = rotation
                    ? `${rotation} + Left rotation`
                    : 'Left rotation'
            }
        }
    }

    root.color = 'BLACK'
    root.parent = null

    return { root, rotation }
}

function minimumNode(node: RBNode): RBNode {
    let current = node

    while (current.left) {
        current = current.left
    }

    return current
}

function transplant(
    root: RBNode | null,
    oldNode: RBNode,
    newNode: RBNode | null,
): RBNode | null {
    if (!oldNode.parent) {
        root = newNode
    } else if (oldNode === oldNode.parent.left) {
        oldNode.parent.left = newNode
    } else {
        oldNode.parent.right = newNode
    }

    if (newNode) {
        newNode.parent = oldNode.parent
    }

    return root
}

function fixDelete(
    initialRoot: RBNode | null,
    initialX: RBNode | null,
    initialParent: RBNode | null,
    initialIsLeft: boolean,
): RBNode | null {
    let root = initialRoot
    let x = initialX
    let parent = initialParent
    let isLeft = initialIsLeft

    while (
        x !== root &&
        colorOf(x) === 'BLACK'
    ) {
        if (!parent) break

        const onLeft = x
            ? x === parent.left
            : isLeft

        if (onLeft) {
            let sibling = parent.right

            if (colorOf(sibling) === 'RED') {
                setColor(sibling, 'BLACK')
                parent.color = 'RED'
                root = rotateLeft(root!, parent)
                sibling = parent.right
            }

            if (
                colorOf(sibling?.left ?? null) === 'BLACK' &&
                colorOf(sibling?.right ?? null) === 'BLACK'
            ) {
                setColor(sibling, 'RED')
                x = parent
                parent = x.parent
                isLeft = parent ? x === parent.left : false
            } else {
                if (
                    colorOf(sibling?.right ?? null) === 'BLACK'
                ) {
                    setColor(sibling?.left ?? null, 'BLACK')
                    setColor(sibling, 'RED')

                    if (sibling) {
                        root = rotateRight(root!, sibling)
                    }

                    sibling = parent.right
                }

                setColor(sibling, parent.color)
                parent.color = 'BLACK'
                setColor(sibling?.right ?? null, 'BLACK')
                root = rotateLeft(root!, parent)
                x = root
                parent = null
            }
        } else {
            let sibling = parent.left

            if (colorOf(sibling) === 'RED') {
                setColor(sibling, 'BLACK')
                parent.color = 'RED'
                root = rotateRight(root!, parent)
                sibling = parent.left
            }

            if (
                colorOf(sibling?.right ?? null) === 'BLACK' &&
                colorOf(sibling?.left ?? null) === 'BLACK'
            ) {
                setColor(sibling, 'RED')
                x = parent
                parent = x.parent
                isLeft = parent ? x === parent.left : false
            } else {
                if (
                    colorOf(sibling?.left ?? null) === 'BLACK'
                ) {
                    setColor(sibling?.right ?? null, 'BLACK')
                    setColor(sibling, 'RED')

                    if (sibling) {
                        root = rotateLeft(root!, sibling)
                    }

                    sibling = parent.left
                }

                setColor(sibling, parent.color)
                parent.color = 'BLACK'
                setColor(sibling?.left ?? null, 'BLACK')
                root = rotateRight(root!, parent)
                x = root
                parent = null
            }
        }
    }

    setColor(x, 'BLACK')

    if (root) {
        root.color = 'BLACK'
        root.parent = null
    }

    return root
}

export function deleteRB(
    originalRoot: RBNode | null,
    key: number,
): RBNode | null {
    if (!originalRoot) return null

    let target: RBNode | null = originalRoot

    while (target && target.key !== key) {
        target =
            key < target.key
                ? target.left
                : target.right
    }

    if (!target) return originalRoot

    let movedNode: RBNode = target
    let originalColor: RBColor = movedNode.color
    let x: RBNode | null
    let xParent: RBNode | null
    let xWasLeft = false
    let root: RBNode | null = originalRoot

    if (!target.left) {
        x = target.right
        xParent = target.parent
        xWasLeft = xParent ? target === xParent.left : false

        root = transplant(root, target, target.right)

        if (x) {
            xParent = x.parent
            xWasLeft = xParent ? x === xParent.left : false
        }
    } else if (!target.right) {
        x = target.left
        xParent = target.parent
        xWasLeft = xParent ? target === xParent.left : false

        root = transplant(root, target, target.left)

        if (x) {
            xParent = x.parent
            xWasLeft = xParent ? x === xParent.left : false
        }
    } else {
        movedNode = minimumNode(target.right)
        originalColor = movedNode.color
        x = movedNode.right

        if (movedNode.parent === target) {
            xParent = movedNode

            if (x) {
                x.parent = movedNode
                xWasLeft = false
            } else {
                xWasLeft = false
            }
        } else {
            xParent = movedNode.parent
            xWasLeft = xParent
                ? movedNode === xParent.left
                : false

            root = transplant(root, movedNode, movedNode.right)

            movedNode.right = target.right
            movedNode.right.parent = movedNode
        }

        root = transplant(root, target, movedNode)

        movedNode.left = target.left
        movedNode.left.parent = movedNode
        movedNode.color = target.color

        if (x && x.parent) {
            xParent = x.parent
            xWasLeft = x === xParent.left
        }
    }

    if (originalColor === 'BLACK') {
        root = fixDelete(root, x, xParent, xWasLeft)
    }

    if (root) {
        root.color = 'BLACK'
        root.parent = null
    }

    return root
}

export function traverseRB(
    root: RBNode | null,
    order: RBTraversalOrder,
): number[] {
    const result: number[] = []

    function visit(node: RBNode | null): void {
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

export function rbValues(root: RBNode | null): number[] {
    return traverseRB(root, 'Inorder')
}

export function cloneRB(node: RBNode | null): RBNode | null {
    if (!node) return null

    const copy: RBNode = {
        key: node.key,
        color: node.color,
        left: null,
        right: null,
        parent: null,
    }

    copy.left = cloneRB(node.left)
    copy.right = cloneRB(node.right)

    if (copy.left) copy.left.parent = copy
    if (copy.right) copy.right.parent = copy

    return copy
}