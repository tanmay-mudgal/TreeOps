import { useState } from 'react'

import {
  type RBNode,
  type RBTraversalOrder,
  insertRB,
  searchRB,
  findRBPath,
  deleteRB,
  traverseRB,
  rbValues,
  cloneRB,
} from './rb'

import {
  type AVLNode,
  type AVLTraversalOrder,
  insertAVL,
  searchAVL,
  findAVLPath,
  deleteAVL,
  traverseAVL,
  avlValues,
  cloneAVL,
} from './avl'

import {
  insertBST,
  searchBST,
  findBSTPath,
  deleteBST,
  traverseBST,
  bstValues,
} from './bst'

import {
  type BinaryNode,
  type TraversalOrder,
  insertNode,
  searchNode,
  deleteNode,
  traverse,
  findSearchPath,
} from './binaryTree'

import {
  type BTreeNode,
  type BTreeTraversalOrder,
  insertBTree,
  searchBTree,
  deleteBTree,
  traverseBTree,
  bTreeValues,
  cloneBTree,
} from './btree'

type TreeName =
  | 'Binary Tree'
  | 'Binary Search Tree'
  | 'AVL Tree'
  | 'Red-Black Tree'
  | 'B-Tree'

type Operation = 'Insert' | 'Search' | 'Delete' | 'Traversal'

type TraversalName =
  | 'Inorder'
  | 'Preorder'
  | 'Postorder'
  | 'Level Order'

type VisualNode = {
  key: number
  left: VisualNode | null
  right: VisualNode | null
  color?: 'RED' | 'BLACK'
}

const treeNames: TreeName[] = [
  'Binary Tree',
  'Binary Search Tree',
  'AVL Tree',
  'Red-Black Tree',
  'B-Tree',
]

const treeInfo: Record<
  TreeName,
  {
    abbreviation: string
    introduction: string
    properties: string[]
  }
> = {
  'Binary Tree': {
    abbreviation: 'BT',
    introduction:
      'A binary tree is a hierarchical data structure in which each node has at most two children: a left child and a right child.',
    properties: [
      'Each node has at most two children.',
      'Nodes are connected by parent-child relationships.',
      'Common traversals are preorder, inorder and postorder.',
    ],
  },
  'Binary Search Tree': {
    abbreviation: 'BST',
    introduction:
      'A Binary Search Tree maintains an ordering rule: keys smaller than a node belong in its left subtree, and larger keys belong in its right subtree.',
    properties: [
      'Searching follows the ordering property.',
      'Inorder traversal produces sorted keys.',
      'An unbalanced BST can have linear height.',
    ],
  },
  'AVL Tree': {
    abbreviation: 'AVL',
    introduction:
      'An AVL tree is a self-balancing Binary Search Tree that uses rotations to keep subtree heights balanced.',
    properties: [
      'Balance factor = height(left) − height(right).',
      'Each node has a balance factor of −1, 0 or +1.',
      'Rotations restore balance after updates.',
    ],
  },
  'Red-Black Tree': {
    abbreviation: 'RBT',
    introduction:
      'A Red-Black Tree is a self-balancing Binary Search Tree whose nodes are coloured red or black.',
    properties: [
      'Every node is red or black.',
      'The root and NIL leaves are black.',
      'A red node cannot have a red child.',
      'Every path to a descendant NIL leaf has the same black height.',
    ],
  },
  'B-Tree': {
    abbreviation: 'B',
    introduction:
      'A B-Tree is a balanced multiway search tree. A node can contain multiple keys and have multiple children.',
    properties: [
      'Keys within a node are sorted.',
      'Child subtrees represent different key ranges.',
      'Splitting, merging and redistribution maintain the tree.',
      'All leaves occur at the same depth.',
    ],
  },
}

const operations: {
  name: Operation
  symbol: string
  description: string
}[] = [
  { name: 'Insert', symbol: '+', description: 'Add a key to the tree.' },
  { name: 'Search', symbol: '⌕', description: 'Find a key and trace the search.' },
  { name: 'Delete', symbol: '−', description: 'Remove a key from the tree.' },
  { name: 'Traversal', symbol: '↔', description: 'Visit nodes in a chosen order.' },
]

const pseudocode: Record<Operation, string[]> = {
  Insert: [
    'INSERT(root, key)',
    '1. Find the insertion position.',
    '2. Insert the key.',
    '3. Restore tree properties if required.',
    '4. Return the updated root.',
  ],
  Search: [
    'SEARCH(root, key)',
    '1. Start at the root.',
    '2. Compare the current key.',
    '3. Choose the appropriate child.',
    '4. Report whether the key was found.',
  ],
  Delete: [
    'DELETE(root, key)',
    '1. Locate the target key.',
    '2. Handle its children.',
    '3. Remove or replace the key.',
    '4. Restore tree properties if required.',
  ],
  Traversal: [
    'TRAVERSE(node)',
    '1. Visit nodes in the selected order.',
    '2. Recursively visit the subtrees.',
    '3. Display the traversal sequence.',
  ],
}

const startingMessage =
  'Your workspace is empty. Choose an operation to begin.'

function cloneBinaryTree(
  node: BinaryNode | null,
): BinaryNode | null {
  if (!node) return null

  return {
    key: node.key,
    left: cloneBinaryTree(node.left),
    right: cloneBinaryTree(node.right),
  }
}

function binaryTreeValues(root: BinaryNode | null): number[] {
  if (!root) return []

  const result: number[] = []
  const queue: BinaryNode[] = [root]

  while (queue.length > 0) {
    const node = queue.shift()!
    result.push(node.key)

    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }

  return result
}

function BinaryTreeView({
  root,
  highlighted = [],
}: {
  root: VisualNode | null
  highlighted?: number[]
}) {
  if (!root) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center text-center">
        <span className="text-4xl text-[#176B65]">◇</span>
        <h3 className="mt-3 font-extrabold">Your tree is empty</h3>
        <p className="mt-2 text-sm text-slate-500">
          Insert a key to create your first node.
        </p>
      </div>
    )
  }

  type PositionedNode = {
    node: VisualNode
    x: number
    y: number
  }

  const nodes: PositionedNode[] = []
  const edges: {
    x1: number
    y1: number
    x2: number
    y2: number
  }[] = []

  let nextX = 0
  const horizontalGap = 76
  const levelGap = 90
  const margin = 45

  function layout(node: VisualNode | null, depth: number): number {
    if (!node) return -1

    const leftX = layout(node.left, depth + 1)
    const currentX = nextX
    nextX += 1
    const rightX = layout(node.right, depth + 1)

    const positioned = {
      node,
      x: margin + currentX * horizontalGap,
      y: margin + depth * levelGap,
    }

    nodes.push(positioned)

    if (node.left && leftX >= 0) {
      edges.push({
        x1: positioned.x,
        y1: positioned.y,
        x2: margin + leftX * horizontalGap,
        y2: margin + (depth + 1) * levelGap,
      })
    }

    if (node.right && rightX >= 0) {
      edges.push({
        x1: positioned.x,
        y1: positioned.y,
        x2: margin + rightX * horizontalGap,
        y2: margin + (depth + 1) * levelGap,
      })
    }

    return currentX
  }

  layout(root, 0)

  const maxX = Math.max(...nodes.map((item) => item.x))
  const maxY = Math.max(...nodes.map((item) => item.y))
  const width = Math.max(300, maxX + margin)
  const height = maxY + margin + 25

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Tree diagram"
        className="mx-auto"
      >
        {edges.map((edge, index) => (
          <line
            key={index}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="#94B8AE"
            strokeWidth="2.5"
          />
        ))}

        {nodes.map(({ node, x, y }) => {
          const active = highlighted.includes(node.key)

          const fill = active
            ? '#E5B65B'
            : node.color === 'RED'
              ? '#DC2626'
              : node.color === 'BLACK'
                ? '#172033'
                : '#176B65'

          return (
            <g key={`${node.key}-${x}-${y}`}>
              <circle
                cx={x}
                cy={y}
                r="22"
                fill={fill}
                stroke={active ? '#B7791F' : '#FFFFFF'}
                strokeWidth="2"
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill={active ? '#173D3A' : '#FFFFFF'}
              >
                {node.key}
              </text>
            </g>
          )
        })}
      </svg>

      {nodes.some(({ node }) => node.color) && (
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-600" />
            Red node
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#172033]" />
            Black node
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#E5B65B]" />
            Highlighted node
          </span>
        </div>
      )}
    </div>
  )
}

/* Dedicated multi-key B-Tree visualization */
function BTreeView({
  root,
  highlighted = [],
}: {
  root: BTreeNode | null
  highlighted?: number[]
}) {
  if (!root) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center text-center">
        <span className="text-4xl text-[#176B65]">◇</span>
        <h3 className="mt-3 font-extrabold">Your B-Tree is empty</h3>
        <p className="mt-2 text-sm text-slate-500">
          Insert a key to create your first node.
        </p>
      </div>
    )
  }

  type LayoutNode = {
    node: BTreeNode
    x: number
    y: number
    width: number
  }

  const nodes: LayoutNode[] = []
  const edges: {
    x1: number
    y1: number
    x2: number
    y2: number
  }[] = []

  const nodeHeight = 42
  const levelGap = 94
  const sideMargin = 35
  const siblingGap = 22

  function nodeWidth(node: BTreeNode): number {
    return Math.max(54, node.keys.length * 38 + 16)
  }

  function subtreeWidth(node: BTreeNode): number {
    const ownWidth = nodeWidth(node)

    if (node.leaf || node.children.length === 0) {
      return ownWidth
    }

    const childrenWidth = node.children.reduce(
      (total, child) => total + subtreeWidth(child),
      0,
    )

    const gaps = siblingGap * (node.children.length - 1)

    return Math.max(ownWidth, childrenWidth + gaps)
  }

  function layout(
    node: BTreeNode,
    left: number,
    depth: number,
  ): LayoutNode {
    const width = subtreeWidth(node)
    const ownWidth = nodeWidth(node)
    const centerX = left + width / 2
    const y = 30 + depth * levelGap

    const positioned: LayoutNode = {
      node,
      x: centerX,
      y,
      width: ownWidth,
    }

    nodes.push(positioned)

    if (!node.leaf && node.children.length > 0) {
      const childWidths = node.children.map(subtreeWidth)
      const totalChildrenWidth =
        childWidths.reduce((total, value) => total + value, 0) +
        siblingGap * (childWidths.length - 1)

      let childLeft = left + (width - totalChildrenWidth) / 2

      node.children.forEach((child, index) => {
        const childWidth = childWidths[index]
        const childPosition = layout(child, childLeft, depth + 1)

        edges.push({
          x1: centerX,
          y1: y + nodeHeight / 2,
          x2: childPosition.x,
          y2: childPosition.y - nodeHeight / 2,
        })

        childLeft += childWidth + siblingGap
      })
    }

    return positioned
  }

  const totalWidth = Math.max(320, subtreeWidth(root) + sideMargin * 2)
  const deepestY = 30 + getBTreeHeight(root) * levelGap
  const totalHeight = deepestY + nodeHeight + 35

  layout(root, sideMargin, 0)

  return (
    <div className="w-full overflow-auto">
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        role="img"
        aria-label="B-Tree diagram with multiple keys per node"
        className="mx-auto"
      >
        {edges.map((edge, index) => (
          <line
            key={index}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="#94B8AE"
            strokeWidth="2.5"
          />
        ))}

        {nodes.map(({ node, x, y, width }, index) => {
          const active = node.keys.some((key) =>
            highlighted.includes(key),
          )

          const cellWidth = width / Math.max(node.keys.length, 1)

          return (
            <g key={`${node.keys.join('-')}-${index}`}>
              <rect
                x={x - width / 2}
                y={y - nodeHeight / 2}
                width={width}
                height={nodeHeight}
                rx="8"
                fill={active ? '#F4D48C' : '#176B65'}
                stroke={active ? '#B7791F' : '#FFFFFF'}
                strokeWidth="2"
              />

              {node.keys.map((key, keyIndex) => (
                <g key={key}>
                  {keyIndex > 0 && (
                    <line
                      x1={x - width / 2 + keyIndex * cellWidth}
                      y1={y - nodeHeight / 2 + 5}
                      x2={x - width / 2 + keyIndex * cellWidth}
                      y2={y + nodeHeight / 2 - 5}
                      stroke={active ? '#B7791F' : '#A7D8C9'}
                      strokeWidth="1.5"
                    />
                  )}

                  <text
                    x={
                      x -
                      width / 2 +
                      keyIndex * cellWidth +
                      cellWidth / 2
                    }
                    y={y + 5}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill={active ? '#173D3A' : '#FFFFFF'}
                  >
                    {key}
                  </text>
                </g>
              ))}
            </g>
          )
        })}
      </svg>

      <p className="mt-3 text-center text-xs text-slate-500">
        Each rectangle represents one B-Tree node. Multiple keys can
        occupy the same node.
      </p>
    </div>
  )
}

function getBTreeHeight(node: BTreeNode): number {
  if (node.leaf || node.children.length === 0) return 0
  return 1 + getBTreeHeight(node.children[0])
}

function BTreeDegreeSetup({
  degreeDraft,
  setDegreeDraft,
  onCreate,
}: {
  degreeDraft: string
  setDegreeDraft: (value: string) => void
  onCreate: () => void
}) {
  const degree = Number(degreeDraft)
  const valid = Number.isInteger(degree) && degree >= 2 && degree <= 5

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <span className="rounded-full bg-[#E5F3EE] px-3 py-1 text-xs font-extrabold text-[#176B65]">
        B-TREE CONFIGURATION
      </span>

      <h2 className="mt-4 text-2xl font-black">
        Choose your B-Tree degree
      </h2>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        The minimum degree determines how many keys and children
        each node can hold. Choose a degree before creating your tree.
      </p>

      <label
        htmlFor="btree-degree"
        className="mt-6 block text-sm font-bold"
      >
        Minimum degree (t)
      </label>

      <select
        id="btree-degree"
        value={degreeDraft}
        onChange={(event) => setDegreeDraft(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
      >
        <option value="2">Degree 2 — maximum 3 keys per node</option>
        <option value="3">Degree 3 — maximum 5 keys per node</option>
        <option value="4">Degree 4 — maximum 7 keys per node</option>
        <option value="5">Degree 5 — maximum 9 keys per node</option>
      </select>

      <div className="mt-5 rounded-xl bg-[#F4F8F7] p-4 text-sm leading-7">
        <p>Minimum keys in a non-root node: {valid ? degree - 1 : '—'}</p>
        <p>Maximum keys per node: {valid ? 2 * degree - 1 : '—'}</p>
        <p>Maximum children per internal node: {valid ? 2 * degree : '—'}</p>
      </div>

      <button
        onClick={onCreate}
        disabled={!valid}
        className="mt-6 w-full rounded-xl bg-[#176B65] px-5 py-3 font-extrabold text-white hover:bg-[#125650] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Create B-Tree →
      </button>
    </section>
  )
}

export default function App() {
  const [selectedTree, setSelectedTree] = useState<TreeName | null>(null)
  const [operation, setOperation] = useState<Operation | null>(null)

  const [binaryRoot, setBinaryRoot] = useState<BinaryNode | null>(null)
  const [bstRoot, setBstRoot] = useState<BinaryNode | null>(null)
  const [avlRoot, setAvlRoot] = useState<AVLNode | null>(null)
  const [rbRoot, setRbRoot] = useState<RBNode | null>(null)
  const [bRoot, setBRoot] = useState<BTreeNode | null>(null)

  const [bDegree, setBDegree] = useState(2)
  const [degreeDraft, setDegreeDraft] = useState('2')
  const [bDegreeChosen, setBDegreeChosen] = useState(false)

  const [highlighted, setHighlighted] = useState<number[]>([])
  const [input, setInput] = useState('')
  const [traversalType, setTraversalType] =
    useState<TraversalName>('Inorder')
  const [message, setMessage] = useState(startingMessage)
  const [history, setHistory] = useState<string[]>([])

  const implemented =
    selectedTree === 'Binary Tree' ||
    selectedTree === 'Binary Search Tree' ||
    selectedTree === 'AVL Tree' ||
    selectedTree === 'Red-Black Tree' ||
    (selectedTree === 'B-Tree' && bDegreeChosen)

  const activeRoot: VisualNode | null =
    selectedTree === 'Binary Search Tree'
      ? bstRoot
      : selectedTree === 'AVL Tree'
        ? avlRoot
        : selectedTree === 'Red-Black Tree'
          ? rbRoot
          : binaryRoot

  const currentInfo = selectedTree ? treeInfo[selectedTree] : null

  const currentKeyCount =
    selectedTree === 'Binary Search Tree'
      ? bstValues(bstRoot).length
      : selectedTree === 'AVL Tree'
        ? avlValues(avlRoot).length
        : selectedTree === 'Red-Black Tree'
          ? rbValues(rbRoot).length
          : selectedTree === 'B-Tree'
            ? bTreeValues(bRoot).length
            : binaryTreeValues(binaryRoot).length

  function chooseTree(name: TreeName) {
    setSelectedTree(name)
    setOperation(null)
    setBinaryRoot(null)
    setBstRoot(null)
    setAvlRoot(null)
    setRbRoot(null)
    setBRoot(null)
    setHighlighted([])
    setInput('')
    setHistory([])
    setBDegreeChosen(false)
    setDegreeDraft('2')
    setBDegree(2)
    setMessage(`Welcome to the ${name} workspace. Choose an operation.`)
  }

  function chooseOperation(name: Operation) {
    setOperation(name)
    setInput('')
    setHighlighted([])
    setMessage(
      name === 'Traversal'
        ? 'Choose a traversal order, then run the traversal.'
        : `${name} selected. Enter a key when you are ready.`,
    )
  }

  function recordAction(text: string) {
    setHistory((previous) => [text, ...previous].slice(0, 8))
  }

  function runOperation() {
    if (!selectedTree || !operation) return

    if (!implemented) {
      setMessage('Create your B-Tree first by selecting its minimum degree.')
      return
    }

    const isBST = selectedTree === 'Binary Search Tree'
    const isAVL = selectedTree === 'AVL Tree'
    const isRB = selectedTree === 'Red-Black Tree'
    const isBTree = selectedTree === 'B-Tree'

    // TRAVERSAL
    if (operation === 'Traversal') {
      let result: number[]

      if (isBTree) {
        result = traverseBTree(bRoot, traversalType as BTreeTraversalOrder)
      } else if (isRB) {
        result = traverseRB(rbRoot, traversalType as RBTraversalOrder)
      } else if (isAVL) {
        result = traverseAVL(avlRoot, traversalType as AVLTraversalOrder)
      } else if (isBST) {
        result = traverseBST(bstRoot, traversalType as TraversalOrder)
      } else {
        result = traverse(binaryRoot, traversalType as TraversalOrder)
      }

      if (result.length === 0) {
        setMessage('The tree is empty. Insert a key before traversing.')
        setHighlighted([])
        return
      }

      setHighlighted([])
      const text = `${traversalType}: ${result.join(' → ')}`
      setMessage(text)
      recordAction(`${selectedTree} ${text}`)
      return
    }

    // VALIDATE KEY INPUT
    if (
      input.trim() === '' ||
      !Number.isSafeInteger(Number(input))
    ) {
      setMessage('Enter a valid whole-number key.')
      return
    }

    const key = Number(input)

    // B-TREE OPERATIONS
    if (isBTree) {
      const draft = cloneBTree(bRoot)

      if (operation === 'Insert') {
        if (searchBTree(draft, key)) {
          setMessage(`${key} is already present in this B-Tree.`)
          setInput('')
          return
        }

        setBRoot(insertBTree(draft, key, bDegree))
        setHighlighted([key])
        setMessage(
          `Inserted ${key} into the B-Tree with minimum degree ${bDegree}.`,
        )
        recordAction(`B-Tree (t=${bDegree}) insert ${key}`)
      }

      if (operation === 'Search') {
        const path: number[] = []
        let current: BTreeNode | null = draft
        let found = false

        while (current) {
          let i = 0

          while (i < current.keys.length && key > current.keys[i]) {
            i++
          }

          path.push(...current.keys)

          if (i < current.keys.length && current.keys[i] === key) {
            found = true
            break
          }

          if (current.leaf) break
          current = current.children[i]
        }

        setHighlighted(found ? [key] : [])
        setMessage(
          found
            ? `Found ${key} in the degree-${bDegree} B-Tree. Visited keys: ${path.join(' → ')}`
            : `Key ${key} was not found in the degree-${bDegree} B-Tree. Visited keys: ${path.join(' → ') || 'none'}`,
        )
        recordAction(`B-Tree search ${key}: ${found ? 'found' : 'not found'}`)
      }

      if (operation === 'Delete') {
        if (!searchBTree(draft, key)) {
          setMessage(`Key ${key} does not exist in this B-Tree.`)
          setInput('')
          return
        }

        setBRoot(deleteBTree(draft, key, bDegree))
        setHighlighted([])
        setMessage(
          `Deleted ${key} from the degree-${bDegree} B-Tree. Its properties have been restored.`,
        )
        recordAction(`B-Tree (t=${bDegree}) delete ${key}`)
      }

      setInput('')
      return
    }

    // RED-BLACK TREE OPERATIONS
    if (isRB) {
      const draft = cloneRB(rbRoot)

      if (operation === 'Insert') {
        if (searchRB(draft, key)) {
          setMessage(`${key} is already present in this Red-Black Tree.`)
          setInput('')
          return
        }

        const result = insertRB(draft, key)
        setRbRoot(result.root)
        setHighlighted([key])

        setMessage(
          result.rotation
            ? `Inserted ${key}. Rebalancing: ${result.rotation}.`
            : `Inserted ${key} into the Red-Black Tree.`,
        )
        recordAction(
          result.rotation
            ? `RBT insert ${key} — ${result.rotation}`
            : `RBT insert ${key}`,
        )
      }

      if (operation === 'Search') {
        const path = findRBPath(draft, key)
        const found = searchRB(draft, key)

        setHighlighted(path)
        setMessage(
          found
            ? `Found ${key}. Search path: ${path.join(' → ')}`
            : `Key ${key} was not found. Search path: ${path.join(' → ') || 'empty tree'}`,
        )
        recordAction(`RBT search ${key}: ${found ? 'found' : 'not found'}`)
      }

      if (operation === 'Delete') {
        if (!searchRB(draft, key)) {
          setMessage(`Key ${key} does not exist in the Red-Black Tree.`)
          setInput('')
          return
        }

        setRbRoot(deleteRB(draft, key))
        setHighlighted([])
        setMessage(
          `Deleted ${key}. The Red-Black Tree has been rebalanced where necessary.`,
        )
        recordAction(`RBT delete ${key}`)
      }

      setInput('')
      return
    }

    // AVL TREE OPERATIONS
    if (isAVL) {
      const draft = cloneAVL(avlRoot)

      if (operation === 'Insert') {
        if (searchAVL(draft, key)) {
          setMessage(`${key} is already present in this AVL tree.`)
          setInput('')
          return
        }

        const result = insertAVL(draft, key)

        setAvlRoot(result.root)
        setHighlighted([key])

        if (result.rotation) {
          setMessage(
            `Inserted ${key}. AVL rebalancing performed a ${result.rotation} rotation.`,
          )
          recordAction(`AVL insert ${key} — ${result.rotation} rotation`)
        } else {
          setMessage(
            `Inserted ${key}. The AVL balance property is maintained.`,
          )
          recordAction(`AVL insert ${key}`)
        }
      }

      if (operation === 'Search') {
        const path = findAVLPath(draft, key)
        const found = searchAVL(draft, key)

        setHighlighted(path)
        setMessage(
          found
            ? `Found ${key}. Search path: ${path.join(' → ')}`
            : `Key ${key} was not found. Search path: ${path.join(' → ') || 'empty tree'}`,
        )
        recordAction(`AVL search ${key}: ${found ? 'found' : 'not found'}`)
      }

      if (operation === 'Delete') {
        if (!searchAVL(draft, key)) {
          setMessage(`Key ${key} does not exist in the AVL tree.`)
          setInput('')
          return
        }

        setAvlRoot(deleteAVL(draft, key))
        setHighlighted([])
        setMessage(
          `Deleted ${key}. The AVL tree has been rebalanced where necessary.`,
        )
        recordAction(`AVL delete ${key}`)
      }

      setInput('')
      return
    }

    // BINARY SEARCH TREE OPERATIONS
    if (isBST) {
      const draft = cloneBinaryTree(bstRoot)

      if (operation === 'Insert') {
        if (searchBST(draft, key)) {
          setMessage(`${key} is already present in this BST.`)
          setInput('')
          return
        }

        setBstRoot(insertBST(draft, key))
        setHighlighted([key])
        setMessage(`Inserted ${key} according to the BST ordering rule.`)
        recordAction(`BST insert ${key}`)
      }

      if (operation === 'Search') {
        const path = findBSTPath(draft, key)
        const found = searchBST(draft, key)

        setHighlighted(path)
        setMessage(
          found
            ? `Found ${key}. Search path: ${path.join(' → ')}`
            : `Key ${key} was not found. Search path: ${path.join(' → ') || 'empty tree'}`,
        )
        recordAction(`BST search ${key}: ${found ? 'found' : 'not found'}`)
      }

      if (operation === 'Delete') {
        if (!searchBST(draft, key)) {
          setMessage(`Key ${key} does not exist in the BST.`)
          setInput('')
          return
        }

        setBstRoot(deleteBST(draft, key))
        setHighlighted([])
        setMessage(`Deleted ${key} while preserving BST ordering.`)
        recordAction(`BST delete ${key}`)
      }

      setInput('')
      return
    }

    // ORDINARY BINARY TREE OPERATIONS
    const draft = cloneBinaryTree(binaryRoot)

    if (operation === 'Insert') {
      if (searchNode(draft, key)) {
        setMessage(`${key} is already present in this tree.`)
        setInput('')
        return
      }

      setBinaryRoot(insertNode(draft, key))
      setHighlighted([key])
      setMessage(`Inserted ${key} using level-order insertion.`)
      recordAction(`Binary Tree insert ${key}`)
    }

    if (operation === 'Search') {
      const path = findSearchPath(draft, key)
      const found = searchNode(draft, key)

      setHighlighted(path)
      setMessage(
        found
          ? `Found ${key}. Visited nodes: ${path.join(' → ')}`
          : `Key ${key} was not found. Visited nodes: ${path.join(' → ') || 'none'}`,
      )
      recordAction(`Binary Tree search ${key}: ${found ? 'found' : 'not found'}`)
    }

    if (operation === 'Delete') {
      if (!searchNode(draft, key)) {
        setMessage(`Key ${key} does not exist in the tree.`)
        setInput('')
        return
      }

      setBinaryRoot(deleteNode(draft, key))
      setHighlighted([])
      setMessage(
        `Deleted ${key} by replacing it with the deepest, rightmost node when needed.`,
      )
      recordAction(`Binary Tree delete ${key}`)
    }

    setInput('')
  }

  function createBTree() {
    const degree = Number(degreeDraft)

    if (!Number.isInteger(degree) || degree < 2 || degree > 5) {
      setMessage('Choose a degree between 2 and 5.')
      return
    }

    setBDegree(degree)
    setBRoot(null)
    setBDegreeChosen(true)
    setOperation(null)
    setHighlighted([])
    setHistory([])
    setMessage(`Created an empty B-Tree with minimum degree ${degree}.`)
  }

  function resetWorkspace() {
    if (selectedTree === 'B-Tree' && bDegreeChosen) {
      setBRoot(null)
      setHighlighted([])
      setInput('')
      setHistory([])
      setOperation(null)
      setMessage(`Cleared the degree-${bDegree} B-Tree workspace.`)
      return
    }

    setBinaryRoot(null)
    setBstRoot(null)
    setAvlRoot(null)
    setRbRoot(null)
    setBRoot(null)
    setHighlighted([])
    setInput('')
    setHistory([])
    setOperation(null)
    setMessage(startingMessage)
  }

  function goHome() {
    setSelectedTree(null)
    setOperation(null)
    setBinaryRoot(null)
    setBstRoot(null)
    setAvlRoot(null)
    setRbRoot(null)
    setBRoot(null)
    setHighlighted([])
    setInput('')
    setHistory([])
    setBDegreeChosen(false)
    setBDegree(2)
    setDegreeDraft('2')
    setMessage(startingMessage)
  }

  return (
    <div className="min-h-screen bg-[#F4F8F7] text-[#183D39] md:flex">
      <aside className="flex w-full shrink-0 flex-col border-b border-emerald-100 bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <button
          onClick={goHome}
          className="flex items-center gap-3 border-b border-slate-100 p-5 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#176B65] text-2xl text-white">
            🌳
          </span>
          <span>
            <span className="block text-xl font-black">TreeOps</span>
          </span>
        </button>

        <nav className="p-4">
          <p className="mb-2 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            Navigation
          </p>

          <button
            onClick={goHome}
            className={`mb-4 w-full rounded-xl px-3 py-3 text-left text-sm font-bold ${
              selectedTree === null
                ? 'bg-[#E5F3EE] text-[#176B65]'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            ◈ &nbsp; Introduction
          </button>

          <p className="mb-2 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            Tree structures
          </p>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {treeNames.map((name) => (
              <button
                key={name}
                onClick={() => chooseTree(name)}
                className={`rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  selectedTree === name
                    ? 'bg-[#176B65] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#E5F3EE] hover:text-[#176B65]'
                }`}
              >
                <span className="mr-2">{treeInfo[name].abbreviation}</span>
                {name}
              </button>
            ))}
          </div>
        </nav>

      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#176B65]">
              {selectedTree ? 'Tree workspace' : 'Welcome to TreeOps'}
            </p>
            <h1 className="mt-1 text-xl font-black sm:text-2xl">
              {selectedTree ?? 'Introduction to Trees'}
            </h1>
          </div>

          {selectedTree && (
            <button
              onClick={resetWorkspace}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Clear workspace
            </button>
          )}
        </header>

        <div className="mx-auto max-w-6xl space-y-6 p-5 sm:p-8">
          {!selectedTree ? (
            <>
              <section className="overflow-hidden rounded-2xl bg-[#173D3A] p-6 text-white sm:p-9">
                <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">
                  Learn · Visualize · Practice
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
                  Discover how trees organize data.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/80">
                  Trees are non-linear data structures that represent
                  hierarchical relationships. Explore five important tree
                  structures, learn their properties and experiment with
                  operations in an empty workspace.
                </p>
                <button
                  onClick={() => chooseTree('Binary Search Tree')}
                  className="mt-6 rounded-xl bg-[#E5B65B] px-5 py-3 text-sm font-extrabold text-[#173D3A] hover:bg-amber-300"
                >
                  Explore the BST →
                </button>
              </section>

              <section>
                <h2 className="text-xl font-black">Tree fundamentals</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A tree consists of nodes connected by edges. The root is the
                  topmost node, and nodes without children are leaves.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ['Node', 'A unit that stores a key or other data.'],
                    ['Root', 'The topmost node of a non-empty tree.'],
                    ['Edge', 'A connection between a parent and a child.'],
                    ['Leaf', 'A node that has no children.'],
                    ['Height', 'The longest downward path, measured in edges.'],
                    ['Subtree', 'A node together with all its descendants.'],
                  ].map(([title, description]) => (
                    <article
                      key={title}
                      className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <h3 className="font-extrabold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="text-xl font-black">
                  Explore the tree structures
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  A Binary Tree allows at most two children. A BST adds an
                  ordering rule. AVL and Red-Black Trees maintain balance,
                  while B-Trees store multiple keys per node and are useful in
                  databases and file systems.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {treeNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => chooseTree(name)}
                      className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#176B65] hover:bg-[#F4FAF7]"
                    >
                      <span className="text-xs font-black uppercase tracking-wider text-[#176B65]">
                        {treeInfo[name].abbreviation}
                      </span>
                      <h3 className="mt-1 font-extrabold">{name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {treeInfo[name].introduction}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <span className="rounded-full bg-[#E5F3EE] px-3 py-1 text-xs font-extrabold text-[#176B65]">
                  {currentInfo!.abbreviation}
                </span>
                <h2 className="mt-4 text-xl font-black">
                  Introduction to {selectedTree}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {currentInfo!.introduction}
                </p>
                <ul className="mt-4 space-y-2">
                  {currentInfo!.properties.map((property) => (
                    <li
                      key={property}
                      className="flex gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="font-black text-[#176B65]">✓</span>
                      {property}
                    </li>
                  ))}
                </ul>
              </section>

              {selectedTree === 'B-Tree' && !bDegreeChosen ? (
                <BTreeDegreeSetup
                  degreeDraft={degreeDraft}
                  setDegreeDraft={setDegreeDraft}
                  onCreate={createBTree}
                />
              ) : (
                <>
                  {selectedTree === 'B-Tree' && (
                    <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-[#E5F3EE] p-4">
                      <div>
                        <p className="font-extrabold">
                          B-Tree minimum degree: {bDegree}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Maximum {2 * bDegree - 1} keys and {2 * bDegree}{' '}
                          children per node.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setBDegreeChosen(false)
                          setDegreeDraft(String(bDegree))
                          setBRoot(null)
                          setOperation(null)
                          setHighlighted([])
                          setHistory([])
                          setMessage('Choose a degree to create a new B-Tree.')
                        }}
                        className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-bold hover:bg-emerald-50"
                      >
                        Change degree
                      </button>
                    </section>
                  )}

                  <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-black">
                          Operation workspace
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Choose what you want to do with this tree.
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        {currentKeyCount} keys
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {operations.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => chooseOperation(item.name)}
                          className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                            operation === item.name
                              ? 'border-[#176B65] bg-[#E5F3EE] ring-2 ring-emerald-100'
                              : 'border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176B65] text-xl font-bold text-white">
                            {item.symbol}
                          </span>
                          <h3 className="mt-3 font-extrabold">{item.name}</h3>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {item.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </section>

                  {operation ? (
                    <section className="grid items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="text-lg font-black">
                            {operation} · {selectedTree}
                          </h2>
                          <button
                            onClick={() => {
                              setOperation(null)
                              setInput('')
                              setMessage(startingMessage)
                            }}
                            className="text-sm font-semibold text-slate-500 hover:text-[#176B65]"
                          >
                            Change operation
                          </button>
                        </div>

                        <div className="mt-5 min-h-56 rounded-xl border border-dashed border-emerald-200 bg-[#F7FBF9] p-4">
                          {implemented ? (
                            selectedTree === 'B-Tree' ? (
                              <BTreeView
                                root={bRoot}
                                highlighted={highlighted}
                              />
                            ) : (
                              <BinaryTreeView
                                root={activeRoot}
                                highlighted={highlighted}
                              />
                            )
                          ) : (
                            <div className="flex min-h-56 flex-col items-center justify-center text-center">
                              <span className="text-4xl">🌳</span>
                              <h3 className="mt-3 font-extrabold">
                                Algorithm implementation coming next
                              </h3>
                            </div>
                          )}
                        </div>

                        {operation === 'Traversal' ? (
                          <div className="mt-5">
                            <label className="mb-2 block text-sm font-bold">
                              Traversal order
                            </label>
                            <select
                              value={traversalType}
                              onChange={(event) =>
                                setTraversalType(
                                  event.target.value as TraversalName,
                                )
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                            >
                              <option>Inorder</option>
                              <option>Preorder</option>
                              <option>Postorder</option>
                              <option>Level Order</option>
                            </select>
                          </div>
                        ) : (
                          <div className="mt-5">
                            <label
                              htmlFor="tree-key"
                              className="mb-2 block text-sm font-bold"
                            >
                              Key value
                            </label>
                            <input
                              id="tree-key"
                              type="number"
                              value={input}
                              onChange={(event) => setInput(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') runOperation()
                              }}
                              placeholder="Enter a whole number"
                              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#176B65] focus:ring-2 focus:ring-emerald-100"
                            />
                          </div>
                        )}

                        <button
                          onClick={runOperation}
                          className="mt-4 w-full rounded-xl bg-[#176B65] px-5 py-3 font-extrabold text-white transition hover:bg-[#125650]"
                        >
                          Run {operation}
                        </button>

                        <div
                          aria-live="polite"
                          className="mt-4 rounded-xl bg-[#E5F3EE] p-4 text-sm leading-6"
                        >
                          {message}
                        </div>
                      </div>

                      <aside className="space-y-5">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5">
                          <h3 className="font-extrabold">Pseudocode guide</h3>
                          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#173D3A] p-4 text-xs leading-7 text-emerald-50">
                            {selectedTree === 'B-Tree'
                              ? [
                                  `${operation.toUpperCase()}_BTREE(root, key)`,
                                  operation === 'Insert'
                                    ? '1. Find the appropriate leaf.'
                                    : operation === 'Search'
                                      ? '1. Compare the key with keys in each node.'
                                      : operation === 'Delete'
                                        ? '1. Locate the key and prepare the child if needed.'
                                        : '1. Visit keys and child subtrees in order.',
                                  operation === 'Insert'
                                    ? '2. Split full nodes before descending.'
                                    : operation === 'Search'
                                      ? '2. Follow the child for the key range.'
                                      : operation === 'Delete'
                                        ? '2. Replace, borrow or merge as required.'
                                        : '2. Follow the selected traversal order.',
                                  operation === 'Insert'
                                    ? '3. Insert into a non-full node.'
                                    : operation === 'Search'
                                      ? '3. Report whether the key was found.'
                                      : operation === 'Delete'
                                        ? '3. Restore B-Tree occupancy properties.'
                                        : '3. Display the traversal sequence.',
                                  `Minimum degree t = ${bDegree}`,
                                ].join('\n')
                              : pseudocode[operation].join('\n')}
                          </pre>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5">
                          <h3 className="font-extrabold">Session history</h3>
                          {history.length === 0 ? (
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                              Completed operations will appear here.
                            </p>
                          ) : (
                            <ul className="mt-3 space-y-2">
                              {history.map((item, index) => (
                                <li
                                  key={`${item}-${index}`}
                                  className="rounded-lg bg-slate-50 px-3 py-2 text-sm"
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </section>
                      </aside>
                    </section>
                  ) : (
                    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                      <div className="text-3xl">⌘</div>
                      <h2 className="mt-3 font-extrabold">
                        What would you like to do?
                      </h2>
                      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                        Select Insert, Search, Delete or Traversal above. No
                        values are preloaded.
                      </p>
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}