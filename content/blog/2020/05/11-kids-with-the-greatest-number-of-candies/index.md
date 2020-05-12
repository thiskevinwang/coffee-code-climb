---
title: "Kids With The Greatest Number of Candies (Rust)"
date: "2020-05-12T00:15:35Z"
description: "Back to Rust, and coding questions. Two of my low hanging fruits."
tags: ["code", "rust", "interview question", "leet code", "algorithm"]
# image: toc.gif
---

After some time of focusing on other things (work, learning DynamoDB, building a Slack Clone), I'm back to Rust... and coding questions. Two of my low hanging fruits. 🍒

My homework: pick a random, **easy** problem on Leetcode to solve in Rust.

- [1431. Kids With the Greatest Number of Candies](https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/)

## Thought process

### How do I solve this in Type/JavaScript?

```ts
const kidsWithCandies = (candies: number[], extraCandies: number) => {
  const max = Math.max(...candies)
  const result = candies.map(e => {
    return e + extraCandies >= max
  })
  return result
}
```

### Time complexity?

**O(n)** - I'm going to stupidly assume that `destructure`ing has a time complexity of **O(n)**, so that's one iteration over my collection. (I should look this up [later...](https://stackoverflow.com/questions/31091772/javascript-es6-computational-time-complexity-of-collections)). Then `.map()` also has a time complexity of **O(n)**...

**O(n)** + **O(n)** = **O(2n)**

... but _constants drop out of complexity_ ([link](https://stackoverflow.com/questions/37765752/what-is-the-complexity-of-running-a-loop-twice-of-the-same-input-array)), so...

**O(n)** is the answer.

## Solution in Rust

```rust
impl Solution {
    pub fn kids_with_candies(candies: Vec<i32>, extra_candies: i32) -> Vec<bool> {
        let max: &i32 = candies.iter().max().unwrap();

        let mut result: Vec<bool> = Vec::new();

        for &i in &candies {
            if i + extra_candies >= *max {
                result.push(true);
            } else {
                result.push(false);
            }
        }

        result
    }
}
```

### Things I needed to google

What is a [greedy algorithm](https://en.wikipedia.org/wiki/Greedy_algorithm)?. Fundamentally, I don't really know what this entails, and I know I should.

[How do I find the max value in a Vec<f64>?](https://www.reddit.com/r/rust/comments/3fg0xr/how_do_i_find_the_max_value_in_a_vecf64/).

Wtf is [Borrowing](https://stackoverflow.com/questions/28800121/what-do-i-have-to-do-to-solve-a-use-of-moved-value-error) in rust?

### Things I definitely still don't really understand.

`&` - passing by [references] in Rust.

When and why to use [unwrap()](https://stackoverflow.com/questions/36362020/what-is-unwrap-in-rust-and-what-is-it-used-for).

Differences between [Arrays, Vectors, and Slices](https://www.cs.brandeis.edu/~cs146a/rust/doc-02-21-2015/book/arrays-vectors-and-slices.html)

## Next steps

Maybe I'm selling myself short by picking questions that are too easy, but it is a super nice transition specifically for the goal of learing Rust. But maybe I should find the historically _classic_ algorithms and understand those from a theoretical level instead, _then_ come back and learn Rust. I dunno. In the end, there's just too much to learn.

Just gotta keep at it.
