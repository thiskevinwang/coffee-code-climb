---
title: React components, done 4 ways
date: "2019-07-28T15:16:41.084Z"
description: "I was bored, so I cooked up something..."
tags:
  [
    code,
    react,
    hooks,
    components,
    higher order components,
    render props,
    formik,
    downshift,
    redux,
    recompose,
  ]
image: fourways.png
---

![fourways](./fourways.png)

Here are a few ways to cook a potato... I mean, write a React component.

## 1. Class (React.Component)

I think class components are the first thing people learn when they learn React, at least that was what I learned. But lately, I haven't had the need to write any class components, and I've nearly forgotten all the extra boiler-plate as well as lifecycle methods... 🤷🏻‍♂️

```javascript
import * as React from "react"
import { render } from "react-dom"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.increment = this.increment.bind(this)
    this.state = {
      count: 0,
      greetings: null,
    }
  }
  increment() {
    this.setState({ count: this.state.count + 1 })
  }

  componentWillMount() {
    console.log("componentWillMount")
  }
  componentDidMount() {
    console.log("componentDidMount")
    setTimeout(() => {
      this.setState({ greetings: "hi" })
    }, 2000)
  }
  componentWillUpdate() {
    console.log("componentWillUpdate", this.state)
  }
  componentWillReceiveProps() {
    console.log("componentWillReceiveProps", this.state)
  }

  render() {
    return (
      <div onClick={this.increment}>
        {this.state.count}, {this.state.greetings || "..."}
      </div>
    )
  }
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
```

## 2. Function, with Hooks

These are my jam, and also where the future of React appears to be going. Hooks make components so clean and a pleasure to read.

```javascript
import React, { useState, useEffect } from "react"
import { render } from "react-dom"

const App = () => {
  const [count, setCount] = useState(0)
  const [greetings, setGreetings] = useState(null)

  const increment = () => {
    setCount(count => count + 1)
  }

  useEffect(() => {
    setTimeout(() => {
      setGreetings("hi")
    }, 2000)
  }, [])

  return (
    <div onClick={increment}>
      {count}, {greetings || "..."}
    </div>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
```

## 3. Render Props

I'm kind of indifferent about this and the next, and I didn't understand how to write them until a week ago.

The following is probably not the correct way to use render props, but I stumbled upon when I was trying to see what was possible.

```javascript
import React, { useState, useEffect } from "react"
import { render } from "react-dom"

const App = ({ render }) => {
  const [count, setCount] = useState(0)
  const [greetings, setGreetings] = useState(null)

  const increment = () => {
    setCount(count => count + 1)
  }

  useEffect(() => {
    setTimeout(() => {
      setGreetings("hi")
    }, 2000)
  }, [])

  return render(
    <div onClick={increment}>
      {count}, {greetings || "..."}
    </div>
  )
}

const rootElement = document.getElementById("root")
render(<App render={a => a} />, rootElement)
```

### 3a. Function as Children Prop

Here is a variation, passing a function as the children prop. From the component, the childen prop gets called with some arguments. Those arguments can then be accessed when you go to write the element tree, and they can be used anywhere along the tree.

Between render props, and a function as the `children` prop, I think the later is a lot nicer.

```javascript
import React, { useState, useEffect } from "react"
import { render } from "react-dom"

const App = ({ children }) => {
  const [count, setCount] = useState(0)
  const [greetings, setGreetings] = useState(null)

  const increment = () => {
    setCount(count => count + 1)
  };

  useEffect(() => {
    setTimeout(() => {
      setGreetings("hi")
    }, 2000);
  }, [])

  return children({ count, increment, greetings })
};

const rootElement = document.getElementById("root")
render(
  <App>
    {({ count, increment, greetings }) => (
      <div onClick={increment}>
        {count}, {greetings || "..."}
      </div>
    )}
  </App5>,
  rootElement
)
```

#### Children Function Examples

- [downshift](https://github.com/downshift-js/downshift#children-function)

## 4. Higher Order Component (aka "Enhanced")

These are everywhere. Sometimes they're cool and sometimes they're a bit much. They're cool because you can "stack" or `compose`-together many HOCs on top of a base component. But sometimes they inject a ton of props and it can be very confusing where some props are coming from.

The main use case I've worked with is using HOCs to inject props into a _dummy_ component. These props have typically been redux state values, action dispatchers, context consumers, etc.

Hooks can **mostly** handle these use cases from within the body of a function component itself, but sometimes it's not a 1-to-1 conversion.

```javascript
import React, { useState, useEffect } from "react"
import { render } from "react-dom"

const Dummy = ({ count, increment, greetings }) => {
  return (
    <div onClick={increment}>
      {count}, {greetings || "..."}
    </div>
  )
}
function withBrains(BaseComponent) {
  const Wrapper = ({ children }) => {
    const [count, setCount] = useState(0)
    const [greetings, setGreetings] = useState(null)

    useEffect(() => {
      setTimeout(() => {
        setGreetings("hi")
      }, 2000)
    }, [])

    const increment = () => {
      setCount(count => count + 1)
    }

    return children({ count, increment, greetings })
  }

  return parentProps => (
    <Wrapper>
      {({ count, increment, greetings }) /*...or wrapperProps*/ => {
        return (
          <BaseComponent
            {...parentProps}
            count={count}
            increment={increment}
            greetings={greetings}
            /*...and {...wrapperProps}*/
          />
        )
      }}
    </Wrapper>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
```

The above is a bit of a stretch. It's a HOC that wraps a base component with a function-as-children-prop component.

#### HOC Examples

- [recompose](https://github.com/acdlite/recompose)
- [@material-ui {withStyles}](https://material-ui.com/styles/basics/#higher-order-component-api)
- [react-redux {connect}](https://react-redux.js.org/api/connect)

## Suggestions?

Are there some interesting examples I should checkout?
