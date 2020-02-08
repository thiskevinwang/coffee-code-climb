---
title: "Recursion in React?"
date: "2020-02-08T13:59:56.109Z"
description: "Ironically, right after doing some binary tree leetcode questions, I found a case where I could apply recursion in React."
tags: ["code", "recursion", "gatsby", "react"]
image: unival.png
---

<figure style="text-align: center">
  <img src="./unival.png"/ alt="yuck">
  <small style="color: grey">yuck</small>
</figure>

Last night, in the mildewy smelling basemeent of some KBBQ restaurant near Flushing (NY), a few friends and I were talking about snowboarding, and how it took one of us 5 years to get comfortable with it. Why so long? _"Well I only go once a year!"_, was the response. And that makes total sense.

A quick pivot to this morning - I'm staring at a **leetcode** question, **[Univalued Binary Tree](https://leetcode.com/problems/univalued-binary-tree/)**, scanning the past year for anything useful I've learned, and wondering why I still feel so dumbfounded, like a deer in headlights. My response to myself? _"Well I only practice once every few months. (And I don't even like it!)"_

## Reminders to myself...

### What's the movtivation behind practing coding questions?

[You suck, try harder](https://www.kyracondie.com/press/2018/8/10/interview-with-mountain-hardwear) - _Ok!_

How do you expect to pass the next job interview? - _Luck?_

Is not knowing common algorithm patterns / problem solving stunting my growth as a "budding" software engineer? - _Yes_

### Don't be lazy

I'm not going to magically understand how to solve coding questions. I just have to do it more.

_Ugh..._

### Use any helpful tools

Haters will probably hate, but I find Joma & TechLead's coding website immensely useful, given the limited amount of free time that I have in a day. (Commuting, working, staying late after work, climbing, doing life chores...)

## The question

Link: https://leetcode.com/problems/univalued-binary-tree/

> A binary tree is univalued if every node in the tree has the same value.
>
> Return true if and only if the given tree is univalued.

### My answer

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isUnivalTree(self, root: TreeNode) -> bool:
        def helper(node: TreeNode, unival) -> bool:
            if not node:
                return True
            if node.val != unival:
                return False
            if not helper(node.left, unival):
                return False
            if not helper(node.right, unival):
                return False
            return True

        if not root:
            return True
        return helper(root, root.val)
```

### Approach

Recursion is an easy way to traverse a tree. I took this approach from Joma and TechLead's answer to this other [binary tree question](https://www.techseries.dev/products/coderpro/categories/1831147/posts/6231427), and modified it to take a `unival` param.

```python
def helper(node: TreeNode, unival) -> bool:
# ...
```

Each recursive call will be given the `unival` for a node's key/val to be checked against.

...But since `unival` will be a constant, starting from the root node, maybe this can be a global value rather passed down as "state" in each recursive `helper` call, right?...

- TODO: read this [stackoverflow thread](https://stackoverflow.com/questions/10057443/explain-the-concept-of-a-stack-frame-in-a-nutshell) for better fundamental understanding of how the _"callstack"_ works.

### Time Complexity

1. Visit the root node - aka call `helper` on the root node
2. Traverse the left subtree - aka, the internal `helper` call on `node.left`
3. Traverse the right subtree - aka, the internal `helper` call on `node.right`

Each node will be visited once, so: **`O(n)`**, where **`n`** is the total number of nodes.

### Space Complexity

This is something I still don't fully understand.

- TODO: read this [stackoverflow thread](https://stackoverflow.com/questions/43298938/space-complexity-of-recursive-function) to understand space complexity of recursive functions.

Space complexity depends on how fast the callstack grows. The callstack grows with each recursive call, and recursive calls stop when a "leaf node" or base-cases are reached.

Space complexity will be **`O(h)`**, where **`h`** is the greatest depth of a subtree.
(This needs confirmation. Someone save me.)

## Next Steps

- [ ] Take a break.
- [ ] Learn some more RESTful api basics, as well as Express.
- [ ] Take a break from Apollo + GraphQL, as amazing as they are.
- [ ] Do some more database stuff - learn some SQL. I revived my RDS instance, so I should probably make use of that \$20+/month that I'm paying.
