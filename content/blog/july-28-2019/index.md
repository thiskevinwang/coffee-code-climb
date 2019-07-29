---
title: React components, cooked 4 ways
date: "2019-07-28T15:16:41.084Z"
description: ""
tags: [code, react, hooks, components]
image: _FIXME_.png
---

## React components, cooked 4 ways.

### 1. Class (React.Component)

Lately, I haven't had the need to write any class components, and I've nearly forgotten all the extra boiler-plate as well as lifecycle methods... 🤷🏻‍♂️

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

### 2. Function, with Hooks

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

### 3. Render Props

I'm kind of indifferent about these, and I didn't understand how to write them until a week ago.

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

#### 3a. Function as Children Prop

Between render props, and declaring a function as the `children` prop, I think the later looks a lot nicer.

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

### 4. Higher Order Component (aka "Enhanced")

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
      {({ count, increment, greetings }) => {
        return (
          <BaseComponent
            {...parentProps}
            count={count}
            increment={increment}
            greetings={greetings}
          />
        )
      }}
    </Wrapper>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
```
