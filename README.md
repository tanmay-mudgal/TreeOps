# 🌳 TreeOps — Interactive Tree Data Structure Visualizer

**Learn. Visualize. Understand.**

TreeOps is an interactive, web-based visualization platform designed to make learning tree data structures easier and more intuitive. It allows users to build trees, perform operations, explore traversal techniques, and understand balancing algorithms through a visual interface.

Built using React and TypeScript, TreeOps bridges the gap between theoretical concepts and practical implementation.

---

## ✨ Features

* **Interactive Tree Visualization:** Watch tree structures update as operations are performed.
* **Five Tree Data Structures:** Explore Binary Trees, Binary Search Trees, AVL Trees, Red-Black Trees, and B-Trees.
* **Core Operations:** Perform insertion, searching, and deletion.
* **Tree Traversals:** Visualize Inorder, Preorder, Postorder, and Level Order traversals.
* **AVL Tree Rotations:** Understand LL, RR, LR, and RL balancing operations.
* **Red-Black Tree Balancing:** Explore node coloring, recoloring, and rotations.
* **B-Tree Configuration:** Configure the minimum degree and explore multiway search trees.
* **Pseudocode Guide:** Understand the algorithmic steps behind different operations.
* **Operation History:** Track operations performed during a session.
* **Theory & Concepts:** Explore properties, working principles, and practical applications of different tree structures.

---

## 🌲 Supported Data Structures

| Data Structure     | Key Concepts                           | Time Complexity (Search) |
| ------------------ | -------------------------------------- | ------------------------ |
| Binary Tree        | Nodes, height, depth, traversals       | O(n)                     |
| Binary Search Tree | Ordered insertion, searching, deletion | O(n)                     |
| AVL Tree           | Balance factors, four rotations        | O(log n)                 |
| Red-Black Tree     | Node coloring, recoloring, rotations   | O(log n)                 |
| B-Tree             | Multiway searching, splitting, merging | O(log n)                 |

### 1. Binary Tree

Explore hierarchical structures where each node has at most two children.

### 2. Binary Search Tree (BST)

Understand how ordering properties enable efficient searching, insertion, and deletion.

### 3. AVL Tree

Explore self-balancing binary search trees and understand the four rotation cases:

* Left-Left (LL)
* Right-Right (RR)
* Left-Right (LR)
* Right-Left (RL)

### 4. Red-Black Tree

Understand self-balancing search trees through node coloring, recoloring, and rotations.

### 5. B-Tree

Explore balanced multiway search trees, including:

* Multiple keys per node
* Configurable minimum degree
* Node splitting
* Key borrowing and merging

---

## ⏱️ Time Complexity

Let `n` represent the number of nodes or keys.

| Data Structure     | Search   | Insertion | Deletion |
| ------------------ | -------- | --------- | -------- |
| Binary Tree        | O(n)     | O(n)*     | O(n)*    |
| Binary Search Tree | O(n)     | O(n)      | O(n)     |
| AVL Tree           | O(log n) | O(log n)  | O(log n) |
| Red-Black Tree     | O(log n) | O(log n)  | O(log n) |
| B-Tree             | O(log n) | O(log n)  | O(log n) |

*Binary Tree insertion and deletion depend on the implementation strategy. An ordinary BST can become skewed, resulting in O(n) operations.*

### Traversal Complexity

All four standard traversal techniques visit every node once.

* Inorder: O(n)
* Preorder: O(n)
* Postorder: O(n)
* Level Order: O(n)

---

## 🛠️ Technology Stack

| Technology   | Purpose                              |
| ------------ | ------------------------------------ |
| React        | Component-based user interface       |
| TypeScript   | Type-safe application logic          |
| Vite         | Development server and build tooling |
| Tailwind CSS | Styling and responsive layouts       |
| Lucide React | Interface icons                      |
| JavaScript   | Supporting application logic         |

---

## 🚀 Getting Started

Follow these steps to run TreeOps locally.

### Prerequisites

* Node.js
* npm
* Git (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/tanmay-mudgal/TreeOps.git
```

### 2. Navigate to the Project Directory

```bash
cd TreeOps
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Browser

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

---

## 📖 How to Use TreeOps

1. Launch TreeOps in your browser.
2. Select a tree data structure.
3. For B-Trees, configure the minimum degree.
4. Choose an operation: Insert, Search, or Delete.
5. Enter the required key and execute the operation.
6. Observe the updated tree visualization.
7. Explore different traversal techniques.
8. Refer to the pseudocode guide and theory section to understand the algorithms.
9. Review operation history to track your work.

---

## 🎯 Learning Objectives

TreeOps aims to help students:

* Understand hierarchical data structures through visualization.
* Compare ordinary and self-balancing search trees.
* Understand insertion, searching, and deletion algorithms.
* Explore AVL rotations and Red-Black Tree balancing.
* Understand B-Tree operations and node management.
* Analyze algorithmic time complexity.
* Connect theoretical pseudocode with practical implementation.

---

## 🔮 Future Enhancements

Potential improvements include:

* Step-by-step animation of insertion and deletion.
* Side-by-side comparison of different tree structures.
* Randomized test-case generation.
* Exporting tree visualizations as images.
* Additional algorithm practice exercises and viva questions.

---

## 👨‍💻 Project Information

| Detail       | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| Project Name | TreeOps                                                      |
| Category     | Data Structures & Algorithms                                 |
| Project Type | Interactive Web Application                                  |
| Purpose      | Educational Tree Data Structure Visualization                |
| Repository   | [GitHub – TreeOps](https://github.com/tanmay-mudgal/TreeOps) |

---

## 📄 License

This project is intended for educational and academic purposes.

---

<p align="center">
  <b>TreeOps — Learn Trees by Building Them. 🌳</b>
  <br>
  Explore the logic. Visualize the structure. Master the algorithms.
</p>
