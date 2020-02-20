---
title: "Binary Tree Level Order Traversal"
date: "2020-02-20T04:58:20.430Z"
description: "5 minutes! Finished this one way way way faster than I expected."
tags:
  [
    "leetcode",
    "code",
    "algorithms",
    "binary tree",
    "practice",
    "level order traversal",
    "javascript",
    "rust",
  ]
# image: unival.png
---

After a pretty stressful day at work - getting assigned a _drop everything and shift gears to 'this'_ type of task - I went to Central Rock Climbing Gym to de-stress through climbing... but only to get more stressed. (I'm going to Hueco Tanks, TX in 2 weeks and I've basically neglected any sort of real preparation...)

On the 9:48PM LIRR ride back to Bayside, I went through my usual twitter browsing (99% developer stuff) and came across one post that seriously got my heart racing & anxiety sky rocketing...

## Did some coding

Got home. Beat 1 run of "The Binding of Isaac" and went straight to Leetcode. I clicked [one anonymous post](https://leetcode.com/discuss/interview-experience/511534/microsoft-sde-redmond-feb-2020), and went to the Round 1 Question that was posted

- [102. Binary Tree Level Order Traversal (Medium)](https://leetcode.com/problems/binary-tree-level-order-traversal).

Fast forward about 5 minutes. My code passed.

Wait.

What?

🥳🥳🥳 As someone who mostly derps around with web stuff, it was cool to see progress here.

## Thought process

### Recursive Helper

My initial thought was that a recursive helper function would get the job done (they usually do in binary tree problems).

### Push onto an array

If they wanted me to turn:

```
    3
   / \
  9  20
    /  \
   15   7
```

into:

```
[
  [3],
  [9,20],
  [15,7]
]
```

My thought was to push node values onto the various arrays at each depth.

I'd also have to check that if there isn't already an array at a given depth, initialize it to `[]`.

### Pass depth as state

I'd need to keep track of depth and I can do so by passing it down as 'state', or an extra argument to the recursive helper function.

## First run

(Don't worry about `var`, `let`, `const`.)

```js
var levelOrder = function(root) {
  let traversed = []
  var helper = (node, depth) => {
    if (!node) return

    if (typeof traversed[depth] !== "Array") {
      traversed[depth] = []
    }

    traversed[depth].push(node.val)
    helper(node.left, depth + 1)
    helper(node.right, depth + 1)
  }
  helper(root, 0)
}
```

### Result

| Wrong Answer |                         |
| :----------- | :---------------------- |
| Runtime      | 92 ms                   |
| Your input   | [3,9,20,null,null,15,7] |
| Output       | undefined               |
| Expected     | [\[3],[9,20],[15,7]]    |

I simply didn't return the `traversed` array value that I wanted to return.

## Second run

```javascript
var levelOrder = function(root) {
  let traversed = []
  var helper = (node, depth) => {
    if (!node) return

    if (typeof traversed[depth] !== "Array") {
      traversed[depth] = []
    }

    traversed[depth].push(node.val)
    helper(node.left, depth + 1)
    helper(node.right, depth + 1)
  }
  helper(root, 0)
  return traverse // <--- added this
}
```

### Result

| Wrong Answer |                         |
| :----------- | :---------------------- |
| Runtime      | 128 ms                  |
| Your input   | [3,9,20,null,null,15,7] |
| Output       | [\[3],[20],[7]]         |
| Expected     | [\[3],[9,20],[15,7]]    |

I knew I wasn't 100% sure on the expected value from `typeof` an array

```js
if (typeof traversed[depth] !== "Array")
```

So I had to consult [MDN `typeof` docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof).

```js
console.log(typeof ["blubber"])
// "object" 🤷🏻‍♂️
```

## Third run and solution

```js
var levelOrder = function(root) {
  let traversed = []
  var helper = (node, depth) => {
    if (!node) return

    // fixed this
    if (typeof traversed[depth] !== "object") {
      traversed[depth] = []
    }

    traversed[depth].push(node.val)
    helper(node.left, depth + 1)
    helper(node.right, depth + 1)
  }
  helper(root, 0)
  return traversed
}
```

### Result

| Accepted   |                         |
| :--------- | :---------------------- |
| Runtime    | 64 ms                   |
| Your input | [3,9,20,null,null,15,7] |
| Output     | [\[3],[9,20],[15,7]]    |
| Expected   | [\[3],[9,20],[15,7]]    |

### Time Complexity

We're traversing the tree, and visting each node **once**, so `O(n)` is the Time Complexity

### Space Complexity

🤦🏻‍♂️ I still don't know how to analyze this. [@ ME ON TWITTER](https://twitter.com/thekevinwang) and let me know how.

## Next Steps

- (High Priority) Redo this problem in **Rust**! Leetcode offers Rust as a language.
- (Med Priority) Analyze space complexity.
- ## (Med Priority) Do the other 3 questions from the original post
