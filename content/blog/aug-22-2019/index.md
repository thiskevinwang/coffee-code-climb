---
title: Day 116
date: "2019-08-23T21:50:29.335Z"
description: "Dear diary, I've survived 15 weeks! This is what I have to show for it."
tags:
  [
    "code",
    "engineering",
    "capsule",
    "zeit",
    "now",
    "graphql",
    "cypress",
    "hooks",
    "work",
    "life",
    "nyc",
  ]
# image: coffee.png
---

It's been 116 days (15 work weeks) since I started my first official engineering job, and it has been really great. I have an amazing manager who has granted me autonomy to work on a few challenging and fulfilling tasks. I just want to write a brief recapitulation of those tasks, as well some other things I've done & learned (personal stuff included), since day 1... mostly for my own sake, so that I don't forget 😅.

## Babel v6 to v7

The first big task that I got to tackle was upgrading our frontend code's **Babel** version from [v6 to v7](https://babeljs.io/docs/en/v7-migration). This would enable React's [fragment shorthand syntax](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html), and simply clean up some tech debt. The hardest part of this was ensuring that our app still compiled properly for Internet Explorer 11, and a good deal of this was working around the existing **webpack** implementation and all its plugins, minifiers, optimizers, etc... I had **0** webpack & babel knowledge prior to this, and can't say I retained _all that_ much because I was sort of on-my-own for this task, but I definitely learned a lot and if I needed to upgrade it again, I'd feel pretty confident in doing so.

#### takeaways

- use the [babel-upgrade](https://github.com/babel/babel-upgrade) tool
  - don't need all the auto-generated plugins
- in your webpack babel-loader options:
  ```js
  configFile: false
  compact: false
  ```
  - This was the key to compiling correctly for IE11

## Recompact to Hooks (in progress)

For this, I got to write my first tech spec! It sucked. It looked like a yelp review. But the decision to move forward with this was quick and swift! (Did I mention _'amazing manager'_?) A lot of components have been a very quick conversion from `withState` to `useState`, while for others I've really had to understand class lifecycles better in order to refactor the `lifecycle` HOC with `useEffect`. The hard part has been two things: 1. figuring out how to refactor Recompact HOC usage that is intertwined with other HOC's like [withFormik](https://jaredpalmer.com/formik/docs/api/withformik), and 2. refactoring other people's code.

#### takeaways

- refactoring composed HOCs is not fun
- Cypress integration testing is DOPE
- props & method naming is suprisingly tricky

## SCSS

I've learned a ton through referencing existing SCSS usage, and implementing our designers designs. Component-specific SCSS modules, classname nesting, global @mixins, using said mixins with `@include`, etc.

#### takeaways

- Not the biggest fan, but I appreciate it
- I want to see how a large project uses `styled-components`
- `react-spring`...

## Cypress

I've only scratched the surface of Cypress and integration testing, but I've been adding tests to my work for migrating to React Hooks. It has been very eye opening.

#### takeaways

- @aliases are limited to the scope of a particular `it` block
- use `data-cy` where possible

---

# Meanwhile, at home...

---

## Apollo GraphQL server + AWS DynamoDb, deployed with Zeit/Now

My manager told me, "you should get good at spinning up node servers", so I looked into... spinning up node servers. The last time I did anything server related was a GraphQL node server from following a tutorial using `Prisma`, and I essentially copy-pasted my way to something sort of nice. I remembered nothing. This time I decided to follow this very minimal [Apollo guide](https://www.apollographql.com/docs/apollo-server/getting-started/), keep the copy-pasting to a bare minimum, and see how to connect both `DynamoDB` and deployment with `Zeit/Now` myself. I eventually made a GraphQL node server that updates my DynamoDB. I'm still adding to it, and figuring out how to structure data on the DB level.

#### takeaways

- Building features myself is fun! But retaining the knowledge is difficult and extra crucial.
- Apollo's deploy-with-now docs are out of date
- GraphQL subscriptions don't seem to work on a Now v2 deployment
- You can add things like AWS/dynamodb/docClient to the `context` object of an ApolloServer
- `now secrets` are really finicky to set up

  ```bash
  now secrets add <secret-name> <secret-value>
  # for <secret-name>
  # `MY_SECRET` will become `my_secret`

  ```

  - setting the secrets in `now.json`
    - I'm not yet sure the difference between build.env and just env.

```json
{
  "build": {
    "env": {
      "MY_SECRET": "@my_secret"
    }
  },
  "env": {
    "MY_SECRET": "@my_secret"
  }
}
```

# What's next?

I want to continue GraphQL node server and DynamoDB stuff, and integrate it with this blog. Maybe learn more about the differences of running the server on a serverless environment like Zeit/Now vs. AWS/EC2 or Heroku. I'd like to figure out websockets & GraphQL subcriptions soon, and they don't seem to work on Zeit/Now.

I want to start getting familiar with Next.js and SSR react and whatever that entails.

That's all for now. See you again in a few days? Weeks?
