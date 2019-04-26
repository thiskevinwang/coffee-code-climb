---
title: Sort blog posts with Lodash
date: "2019-04-26T07:46:47.072Z"
description: I missed a case where a newer Markdown post would be displayed after an older Contentful post
tags:
  ["contentful", "markdown", "lodash", "code", "coffee", "sortby", "graphql"]
image: coffeedesk.jpg
---

<figure style="text-align: center">
  <img src="./coffeedesk.jpg"/ alt="desk">
  <small style="color: grey">Messy desk, not so good coffee, sad Kevin</small>
</figure>

Sometime last week, I successfully implemented Contentful, and wrote my first [post](/first-contentful-post). When I tried to write a [second post](/setting-goals-for-2019), I noticed some text-formatting limitations and shortcomings. Things like

```
multi-line code blocks
```

and ~~strikethrough~~ text, which are quite easy to implement in Markdown, are not yet supported by Contentful's Rich Text. Instantaneous previewing is not yet possible either, and this was a huge deal to me because I care less about what I'm actually writing, and more about what it looks like.

This made me want to write another post in Markdown. Then I thought back to the code I wrote to add Contentful posts alongside markdown posts and wondered about how all the posts were actually being sorted and displayed. Turns out there was an issue with newer markdown posts being displayed after older Contentful posts.

## `_.union()`

I was using lodash's `union` method to join an array of markdown posts, and an array of Contentful posts. Each of these arrays were already sorted in descending order, thanks to the graphql query:

```graphql
query {
  allMarkdownRemark(sort: {
    fields: [frontmatter___date],
    order: DESC
  }) {
    # ...fields, etc.
  }
}
```

but they were not sorted in relation to each other.

At the time, all Contentful posts' dates were newer than any markdown post, so just by passing the `contentfulPosts` as the first argument to `_.union()`, everything conveniently happened to be the correct chronological order.

```ts
/**
 * Create blog posts pages.
 */
const markdownPosts = result.data.allMarkdownRemark.edges
const contentfulPosts = result.data.allContentfulBlogPost.edges

/**
 * Combine Markdown & Contentful posts. Sort by newest Date.
 */
const posts = _.union(contentfulPosts, markdownPosts)
```

But when when it came time to go back to adding a newer markdown post, like **this** one, it ended up being displayed _after_ the oldest Contentful post. Picture this:

```showLineNumbers
[...contentfulPosts, ...markdownPosts]
[...2, 3,            ...1, 4, 5, 6, 7]
[ 2, 3, 1, 4, 5, 6, 7 ]
```

The two arrays are individually sorted, but the combined array is no longer sorted. The third line is what my `posts` looked like.

## `sort()` → `_.sortBy()`

My next step was to sort my array of joined blog posts, by date. At first I used the built-in javascript [Array​.prototype​.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

```ts
/**
 * Array​.prototype​.sort()
 */
const posts = _.union(contentfulPosts, markdownPosts).sort(
  ({ node: nodeA }, { node: nodeB }) => {
    let dateA = new Date(
      nodeA.internal.type === `MarkdownRemark`
        ? nodeA.frontmatter.date
        : nodeA.date
    )
    let dateB = new Date(
      nodeB.internal.type === `MarkdownRemark`
        ? nodeB.frontmatter.date
        : nodeB.date
    )
    return dateB - dateA
  }
)
```

but after some more Lodash shopping, I figured I could clean it up with [\_.sortBy()](https://lodash.com/docs/4.17.11#sortBy)

```ts
/**
 * _.sortBy()
 */
const posts = sortBy(union(contentfulPosts, markdownPosts), ({ node }) => {
  let date = new Date(
    node.internal.type === `MarkdownRemark`
      ? node.frontmatter.date
      : node.date
  )
  return -date
})
```

## Update `next` & `previous` pointers

I applied the same changes in my `gatsby-node.js` file so that the `previous` and `next` nodes point to the correct posts when the pages get created by Gatsby.

## Voila!

See my PR here:
https://github.com/thiskevinwang/coffee-code-climb/pull/54
