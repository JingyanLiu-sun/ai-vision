---
title: N-Queens Problem (Placeholder)
description: A simple placeholder page indicating the N-Queens visualization is under construction.
keywords: N-Queens, backtracking, algorithm visualization
---

## Overview

The N-Queens problem asks to place N queens on an N×N chessboard such that no two queens attack each other. A queen attacks along row, column, and both diagonals.

## Algorithm

We use backtracking with constraint checks:

- Keep sets for used `columns`, `diag1 = r - c`, and `diag2 = r + c`.
- For each row r, try columns c from left to right.
- If `(c not in columns) and (r-c not in diag1) and (r+c not in diag2)`, place the queen; otherwise, continue.
- If a row cannot place any queen, backtrack (remove previous queen and try next column).

## Visualization Controls

- Board size: 4–12
- Auto play / Pause / Step / Reset
- Show conflicts: highlight cells attacked by current partial placement
- Find all solutions: continue search after one solution found
- Speed: adjust autoplay rate
- Search trace: shows Try / Place / Backtrack events

## Complexity

Exponential in N, but pruning via constraints makes it tractable for moderate sizes.
