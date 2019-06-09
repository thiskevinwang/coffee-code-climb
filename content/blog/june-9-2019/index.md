---
title: Press 's' to slow-mo
date: "2019-06-09T09:04:24.756Z"
description: "TL;DR: Press `tab` to highlight the title, then press `s` to slow-mo..."
tags:
  [
    code,
    react,
    gatsby,
    redux,
    recompact,
    hooks,
    react-redux,
    compose,
    learning,
    babel,
    react-spring,
    styled-components,
  ]
image: chenglou.png
---

#### TL;DR: Press `tab` to highlight the title, then press `s` to slow-mo...

<figure style="text-align: center">
  <img src="./chenglou.png"/ alt="cheng lou">
  <small style="color: grey">"Cheng Lou - The State of Animation in React at react-europe 2015"</small>
</figure>

It's Sunday, June 9th, 2019. 2 engineering sprints down, 4 work weeks passed, 160 hours of work-programming logged. It's alot and it's great. I learn so much new stuff that it's nearly impossible to stick to one topic when I try to write these blog posts. Also, I don't think I even like writing, but I'm adhering to my brother's initial suggestion to blog about my learning process.

I initially wanted to write about [**react-spring**](https://www.react-spring.io/docs/hooks/api), but I realized that I should probably recap on my belated undestanding of [**redux**](https://redux.js.org/).

---

## My REDUX understanding:

### one store

You have one, and only one `store` that holds your application's state.

### reducers listen for actions

That store has `reducers`, which are functions that listen for `actions`, and "do something" based on the action, such as updating the global state.

### dispatch actions to store; update store

You need to `dispatch` actions to the store, from your components. How?

#### 'react-redux' for connecting components

The `react-redux` library has a `connect()` higher order function that connects your components to the store, in 2 major ways:

1. It allows you to create dispatch handlers, available as props. These handlers have access to the store's `dispatch()` method.
2. The connect() function also allows your components to read from the store, and map the state to their own props.

That's pretty much the circle-of-life for redux. Then there's also more cool stuff with [**redux-persist**](https://github.com/rt2zz/redux-persist) for persistent local storage. I also need to learn about the [**thunk middleware**](https://redux.js.org/advanced/middleware) for asynchronous stuff. I need to nail down asynchronous programming in general actually.

---

## Onto the slow-mo thing

Though I don't get to use react-spring for work, I try to squeeze in time on weekends, or even between weekdays to learn it, as well as other cool libraries. So I remember this [video](https://www.youtube.com/watch?v=1tavDv5hXpo) by Cheng Lou, which I watched during my previous internship. When he hit the audience with the slow-mo, my mind exploded. But ever since, I never tried to figure out how he managed to do that, nor thought that I would ever have a use case where I needed to do that... until last night.

Last night, I decided to refactor some of my blog. I decided to try to figure out react-spring's `useTrail()`, which lead me to adding a trail of cute logo SVGs, from my [other website](https://thekevinwang.com).

### Random code chunks/notes

Later SVGs move slower

```typescript
// SVG animation trail configs
const zero = { mass: 2, tension: 500, friction: 30 }
const one = { mass: 3, tension: 400, friction: 32 }
const two = { mass: 4, tension: 300, friction: 34 }
const three = { mass: 5, tension: 200, friction: 36 }
const four = { mass: 6, tension: 100, friction: 38 }

const configs = [zero, one, two, three, four]
```

useTrail() declaration

```typescript
/**
 * useTrail() 👉 https://www.react-spring.io/docs/hooks/use-trail
 * @param {number} count The number of animated "things"
 * @param {func} getProps
 *
 * @return {array} [trail, set, stop?]
 *
 * @usage trail.map(props => <animated.div style={props} />)
 */
const [trail, setTrail] = useTrail(5, () => ({
  xy: [0, 0],
  // (property) config?: SpringConfig | ((key: string) => SpringConfig)
  config: i => configs[i],
}))
```

Styling my SVGs

```typescript
/**
 * An array of SVGs to be rendered by `trail.map((e,i) => {})`
 */
const SVGS = [SVG.REACT, SVG.APOLLO, SVG.PRISMA, SVG.GRAPHQL, SVG.NODE]

const StyledSVG = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border: 1px dotted white;
  border-radius: 100%;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14),
    0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  padding: ${props => props.index && props.index * 5 + "px"};
  pointer-events: none;
  position: absolute;
`
const AnimatedSVG = animated(StyledSVG)
```

an "interpolate" handler

```typescript
// you can add _.random() in here for some weird behavior. (no rerenders!)
const translate2d = (x, y) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`
```

the slowMo state hook...

```typescript
const [slowMo, setSlowMo] = useState(false)
```

Implementation. Currently, the `onKeyPress` behavior only works correctly when the correct element has focus.  
Example: press `tab` so that the title ("Coffee Code Climb")has focus, then `s`.

```typescript
return (
  <div
    onMouseMove={e =>
      setTrail({ xy: [e.pageX, e.pageY], config: slowMo && config.molasses })
    }
    onKeyPress={e => {
      console.log(e.key)
      e.key === 's' && setSlowMo(state => !state)
    }}
  >
    {trail.map((props, index) => (
      <AnimatedSVG
        key={index}
        index={index + 1}
        style={{
          transform: props.xy.interpolate(translate2d),
        }}
      >
        {SVGS[index]}
      </AnimatedSVG>
    ))}
// etc.
```

#### Neo

> What are you trying to tell me? That I can dodge bullets?

#### Morpheus

> No, Neo. I'm trying to tell you that when you're ready, you won't have to.

#### Me

> Going to make some pancakes. Bye 👋
