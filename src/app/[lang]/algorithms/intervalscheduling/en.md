---
title: Greedy: Interval Scheduling Guide
description: Select maximum non-overlapping intervals via earliest-finish greedy, with manual mode, drag/resize and strategy comparison.
---

## Problem
Given a set of intervals `[start, end]`, choose a largest subset with pairwise non-overlapping constraint (`prev.end <= next.start`).

## Optimal Greedy
- Sort by earliest finish time;
- Iteratively pick the earliest finishing interval compatible with the chosen set;
- Exchange argument proves optimality.

## Interactions
- Greedy mode: compare strategies (earliest finish/start, shortest duration), step/auto/run-all;
- Manual mode:
  - Click to select intervals; conflicting choices show an explanatory alert;
  - Drag bars horizontally or resize via left/right handles; conflict border highlights;
  - Random/add buttons generate new distributions;
- Right side shows “selected count / optimal count” to compare manual vs greedy.

## Complexity
- Sorting `O(n log n)` + linear selection `O(n)` → `O(n log n)`.

## Extensions
- Weighted intervals for maximizing total weight (DP or validated greedy);
- Batch operations and sharing configurations.
