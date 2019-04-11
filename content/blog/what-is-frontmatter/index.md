---
title: Understanding GatsbyJS frontmatter
date: "2019-04-11T13:09:36.236Z"
description:
tags:
  [
    code,
    frontmatter,
    blog,
    gatsby,
    yaml,
    gray-matter,
    remark,
    javascript,
    airbnb,
  ]
---

It's 9:00am, and I'm listening to [Justin Brown's NYEUSI](https://www.youtube.com/watch?v=dXkSle0-OSI), while writing this blogpost in Atom, and googling around for what exactly `frontmatter` is.

## What is this chunk?

```yaml
---
title: Understanding GatsbyJS frontmatter
date: "2019-04-11T13:09:36.236Z"
description:
tags: [code, frontmatter, blog, gatsby, yaml]
---

```

Currently, all my blogposts, which are `.md` files, begin with the above code chunk. I have a vague understanding that it is `frontmatter`, but, _"what is that exactly?"_, is my question.

### First stop, Jekyll

I googled "frontmatter", and the first result was the [Jekyll](https://jekyllrb.com/docs/front-matter/) docs. There was this description:

> Any file that contains a [YAML](https://yaml.org/) front matter block will be processed by Jekyll as a special file. The front matter must be the first thing in the file and must take the form of **valid YAML set between triple-dashed lines**...

...followed by an example, pretty much identical to the block above. So it's some YAML, at the top of a file.

### Cool, but what is [YAML](https://yaml.org/)?

> YAML: YAML Ain't Markup Language
>
> What It Is: YAML is a human friendly data serialization standard for all programming languages.

I guess I'll just leave it at that.

### Does Gatsby use Jekyll?

Jekyll is a Ruby gem and Gatsby is a JavaScript framework, so **No, Gatsby doesn't not use Jekyll**.

### How does Gatsby handle frontmatter?

At this point, I'm in the Gatsby docs for [gatsby-transform-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/), which is their plugin for parsing Markdown files.

Here are my key takeaways:

- Gatsby uses [Remark](https://remark.js.org/) for parsing markdown
- Gatsby uses [gray-matter](https://github.com/jonschlinkert/gray-matter) for parsing markdown frontmatter
- All frontmatter fields are converted into GraphQL fields.

I'm not sure what other questions I have yet, so I'll take a break here.

I did just discover that you can pass an entire HTML element (ex. `<img/>`) as the value for a frontmatter field, and it gets rendered properly in whatever component that sends a graphql query for that frontmatter data. Need to look into this more...

## What's next?

I want to be able to mimic [airbnb.io](https://airbnb.io)'s `RecentBlogPostsSection.jsx` layout. All their blog content is hosted on Medium, but there's a CDN for the medium-images that are displayed on airbnb.io.
