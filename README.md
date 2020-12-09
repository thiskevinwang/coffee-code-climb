[![Netlify Status](https://api.netlify.com/api/v1/badges/cc83e140-a946-4ba8-9e15-7d29f7a7075b/deploy-status)](https://app.netlify.com/sites/musing-pare-709e6b/deploys)
[![Maintainability](https://api.codeclimate.com/v1/badges/6b0371560091a51a5fd6/maintainability)](https://codeclimate.com/github/thiskevinwang/coffee-code-climb/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6b0371560091a51a5fd6/test_coverage)](https://codeclimate.com/github/thiskevinwang/coffee-code-climb/test_coverage)

<p align="center">
  <a href="https://www.coffeecodeclimb.com">
    <img alt="Gatsby" src="https://coffeecodeclimb.com/icons/icon-48x48.png?v=fcad086065169824e1bde1c949cb480c" width="60" />
  </a>
</p>
<h1 align="center">
  Coffee Code Climb
</h1>

Some blog posts about code, but mostly distrating animations.

### Medium's Claps

![](./content/blog/2020/06/07/new-claps.gif)

### Icon Trail

- [ ] Add gif

### Card Shuffling

- [ ] Add gif

So far I've written random things about...

- 🟦 TypeScript
- 🤦🏻‍♂️ Coding Questions
- 🦀 Rust
- 🐳 Docker
- ⚛️ React

## Testing on a mobile device

### Run `gatsby develop -H 0.0.0.0`

- ```
  You can now view coffee-code-climb in the browser.
  ⠀
    Local:            http://localhost:8000/
    On Your Network:  http://192.168.1.102:8000/
  ```

#### [Optional] Run the Apollo API on this host

```diff
- server.listen({ port: 4044 })
+ server.listen({ port: 4044, host: "192.168.1.102" })
  or
+ server.listen({ port: 4044, host: process.env.HOST })
```

#### [Optional] Make sure any S3 buckets have proper CORS Permissions json

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": [
      "http://192.168.1.102:8000",
      "http://localhost:8000",
      "https://coffeecodeclimb.com"
    ],
    "ExposeHeaders": []
  }
]
```

#### [Optional] `chrome://inspect` for mobile console logs

Open a tab to `chrome://inspect` — choose when to **start**/**stop** logging
Open another tab to `http://192.168.1.102:8000`
