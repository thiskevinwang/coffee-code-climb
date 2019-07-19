---
title: Undocumented props; Hooks in production - PART 1
date: "2019-07-18T21:01:38.126Z"
description: "Launch Darkly's React SDK docs were missing some crucial documentation, leaving my coworker super stressed. Did some detective work and made a contribution to their docs. Shipped Capsule's first Hooks to production later that day."
tags: [code, react, sdk, hooks, launchdarkly, docs, contributing]
image: launchdarkly.png
---

![launchdarkly](./launchdarkly.png)

## Tuesday, July 15th - Launch Darkly

One of my coworkers was given a ticket to enable Launch Darkly on our consumer web app. Naturally, he went to consult their [React SDK documentation](https://docs.launchdarkly.com/docs/react-sdk-reference). Their SDK provides a few things, two **higher order components (HOC)** - `withLDProvider` + `withLDConsumer` - and two **hooks** that replace the consumer HOC - `useFlags` + `useLDClient`. How to actually call the different client methods is (IMO) sloppily documented, in contrast with other amazingly well-documented libraries, like [Gatsby](https://www.gatsbyjs.org/docs/).

### `withLDConsumer` had an undocumented prop

My coworker got pretty stressed because it seemed like it was impossible to interface with the Launch Darkly client. Eventually, I was asked for help for the ticket at hand, and so I had to check the documentation as well. When looking up documentation for `withLDConsumer`, there was only mention of one injected `flags` props, and so I could understand his confusing and stress as to how we were supposed to interface with the client. I went on to read about the two hooks, that supposedly can be used in place of the HOC.

```javascript
import { withLDConsumer } from 'launchdarkly-react-client-sdk'

// withLDConsumer actually injects 2  props...
// ... but documentation only showed `flags`...

const Foo = withLDConsumer()({ flags }) => {
  // Do something with `flags`
  return <>blep</>
}

```

```javascript
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk"

const Bar = () => {
  // Ok, this is the hooks equivalent for the `flags` prop injected by the HOC
  const flags = useFlags()

  // Wait, if I apply the same thought process here...
  const ldClient = useLDClient()

  // ...Then shouldn't there be an `ldClient` props injected too?!?

  return <>bloop</>
}
```

### `console.log()`ing to victory

So given my hypothesis that the `useFlags` hook was the equivalent of the injected `flags` prop, the `useLDClient` must be the equivalent of a much needed and undocumented `ldClient` prop. This is what I did to find out:

```javascript
const Foo = withLDConsumer()({ flags, ...props }) => {

  // I wonder what gets logged...
  console.log("props", props)

  return <>blep</>
}

```

Low and behold, our `ldClient` was right there in our Chrome dev tools console. So, we carried on... relieved.

## Docs & Tweeting @LaunchDarkly

I immediately suggested some edits to Launch Darkly's React SDK docs, and [tweeted at them](https://twitter.com/thekevinwang/status/1150831349344952322). They [responded](https://twitter.com/LaunchDarkly/status/1150852264405266432) pretty fast. I showed my coworker, and he thought it was hilarious.

![launchdarklyresponse](./launchdarklyresponse.png)

## PART 2 - Hooks in production?

To be continued...
