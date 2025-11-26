---
title: Greedy: Minimum Spanning Tree (Kruskal/Prim)
description: Visualize MST with Kruskal and Prim, supporting start selection, edge disabling, node dragging and random graph generation.
---

## Problem
In a connected weighted undirected graph, find a spanning tree connecting all vertices with minimum total weight and no cycles.

## Algorithms
- Kruskal:
  - Sort edges by weight; try adding in order;
  - Use union-find to avoid cycles; add if no cycle;
- Prim:
  - Start from any node; each step take the minimum cut edge between visited and unvisited sets.

## Interactions
- Switch `Kruskal/Prim`;
- Prim start node selection via dropdown;
- Disable edges by clicking (grays out and skipped by Prim);
- Drag nodes to change layout; edges and weight labels follow;
- Random graph generator builds a connected skeleton plus random extra edges.

## Complexity
- Kruskal: `O(E log E)` sorting + union-find near `O(E α(V))`.
- Prim: plain search `O(E)` per step; priority queue yields `O(E log V)`.

## Extensions
- Edit edge weights, save layouts, compare results;
- Visualize cut property and safe edges intuition.
