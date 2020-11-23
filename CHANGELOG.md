# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.18.3] - 2020-11-22

### Added

- disabled button style on Login page
- geist-styles.css
  - import in gatsby-browser & gatsby-ssr
- `gatsby-plugin-material-ui`
  - fix SSR css issues like with `<Box mr={1} mb={1} display={"inline-block"}>`
- `Geist.tsx`
  - a styled-components global stylesheet copy of Vercel's css vars

### Removed

- 'a' transition css
- unused `MobileMenu` component

### Refactored

- NavBar, Header, Layout (old) - improve types
- ThemeSlider style to use some Geist css vars
- `<a>` styles
- NavBar2
  - add dope Menu!!!
- Layout 1 & 2
  - maxWidth: `var(--geist-page-width-with-margin)`
  - paddingX: `var(--geist-gap)`

## [v0.18.2] - 2020-11-20

### Removed

- `disqus` & Discussion component

## [v0.18.1] - 2020-11-19

### Clean Up

- comment out footer links 4230c71
- drastic type improvements for tags.tsx 08d2131
- Improve SEO types 7b998a3
- tags.tsx improve types 1c3f0eb
- remove `apollo-boost`, `apollo-link-context`, `apollo-link-ws` 930237d
- delete ButtonAndDrawer b93252a
- refix invariant ApolloClient error on SSR 7f9f28f
- move prismjs css imports to browser.js ba902c7

## [v0.18.0] - 2020-11-19

### Notes

To make the Facebook <> Cognito login _smooth_, I needed **2 lambda triggers**, and to **catch Cognito errors, client side** ( see `src/pages/redirect_uri.tsx` ).

**Pre Sign Up**

- If the request is from **Facebook**
  - auto create **Native** user
    - auto verify email = TRUE
    - auto confirm user = TRUE
  - link the pending **Facebook** user
  - return the **Facebook** event to Cognito
  - expect Cognito to return an error: `Already found an entry for username ___`
  - 👍 catch the error client side, and attempt to login with **Facebook** again
    - 👍 when the user authenticates with **Facebook**, tokens for the **Native** user will be returned
    - ❌ and the **Native** user's "email verified" will be auto set to FALSE
      - as a result, password reset codes won't be emailed. Fix below

**Pre Token Generation**

- If the request is from **Facebook**
  - `adminUpdateUserAttributes`
    - ```ts
      params = {
        // ...
        UserAttributes: [
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
      }
      ```
  - This re-enables password reset codes to be sent for the **Native** user

### Added

- `/app/` client-only route
  - `/app/profile`
  - `/app/
  - Followed: https://www.gatsbyjs.com/docs/client-only-routes-and-user-authentication/
- LoadingPage component

### Changed

- LoadingIndicator style
- numerous type annotation fix and improvements
- return extra fields from `useVerifyTokenSet`
- Simplified link/`<a>` styles

### Todos

- Add GOOGLE federated login w/ Cognito
- Use new FS Route API
  - https://www.gatsbyjs.com/blog/fs-route-api/

## [v0.17.1] - 2020-11-15

### Added

- `/privacy` page
- `/terms` page

### Changed

- Bio component
- Footer component now has links to /privacy and /terms

## [v0.17.0] - 2020-11-15

### Added

- `/app/*` client-only routes
- `/redirect_uri` page
- isBrowser util
- FacebookIcon
- `useVerifyTokenSet` util/hook
  - This has confusing logic; Needs clean up
- env var
  - GATSBY_FACEBOOK_LOGIN_LINK

### Refactored

- apollo react-hooks -> client
- update Field with Formik.ErrorMessage

## [v0.16.1] - TODO

### TODO

## [v0.16.0] - TODO

### TODO

## [v0.15.21] - TODO

### TODO

## [v0.15.20] - TODO

### TODO

## [v0.15.19] - TODO

### TODO

## [v0.15.18] - 2020-08-01

### TODO

## [v0.15.17] - 2020-07-30

### TODO

## [v0.15.16] - 2020-07-26

### Added

- Rework UI for `<Posts.V2>`
- Fix Lodash security issue
- Add keypress listeners to change **Post** version
  - Attached via `<NavBar2>`
  - <kbd>Ctrl</kbd> + <kbd>1</kbd> selects V1
  - <kbd>Ctrl</kbd> + <kbd>2</kbd> selects V2
- Add `/src/icons` directory
  - Add `QuestionCircle` (https://vercel.com/design/icons)

### Changed

Old:
![image](https://user-images.githubusercontent.com/26389321/88480118-0fd9ef80-cf22-11ea-9a18-3004ac2df095.png)

New:
![image](https://user-images.githubusercontent.com/26389321/88480049-a528b400-cf21-11ea-9ca0-f0b351902e95.png)

## [v0.15.15] - TODO

## [v0.15.14] - TODO

## [v0.15.13] - TODO

## [v0.15.12] - TODO

## [v0.15.11] - TODO

## [v0.15.10] - TODO

## [v0.15.9] - TODO

## [v0.15.8] - TODO

## [v0.15.7] - TODO

## [v0.15.6] - TODO

## [v0.15.5] - TODO

## [v0.15.4] - TODO

## [v0.15.3] - TODO

## [v0.15.2] -

### Added

[v0.18.3]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.18.2...v0.18.3
[v0.18.2]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.18.1...v0.18.2
[v0.18.1]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.18.0...v0.18.1
[v0.18.0]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.17.1...v0.18.0
[v0.17.1]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.17.0...v0.17.1
[v0.17.0]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.16.1...v0.17.0
[v0.16.1]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.16.0...v0.16.1
[v0.16.0]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.21...v0.16.0
[v0.15.21]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.20...v0.15.21
[v0.15.20]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.19...v0.15.20
[v0.15.19]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.18...v0.15.19
[v0.15.18]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.17...v0.15.18
[v0.15.17]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.16...v0.15.17
[v0.15.16]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.15...v0.15.16
[v0.15.15]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.14...v0.15.15
[v0.15.14]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.13...v0.15.14
[v0.15.13]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.12...v0.15.13
[v0.15.12]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.11...v0.15.12
[v0.15.11]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.10...v0.15.11
[v0.15.10]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.9...v0.15.10
[v0.15.9]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.8...v0.15.9
[v0.15.8]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.7...v0.15.8
[v0.15.7]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.6...v0.15.7
[v0.15.6]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.5...v0.15.6
[v0.15.5]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.4...v0.15.5
[v0.15.4]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.3...v0.15.4
[v0.15.3]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.2...v0.15.3
[v0.15.2]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.15.1...v0.15.2

###### TODO: Make tag links for these.

edc9f30 (tag: v0.15.1) extract 'useOptimisticClaps' (#141)
09fd42e (tag: v0.15.0) Merge pull request #138 from thiskevinwang/claps
72e5863 (tag: v0.14.11) ads.txt (#136)
4e0efe7 (tag: v0.14.10) Housekeeping (#134)
a950079 (tag: v0.14.9) Merge pull request #125 from thiskevinwang/Jan-5-blog-post-postgres-docker
f94f259 (tag: v0.14.8) Merge pull request #124 from thiskevinwang/exif
9181386 (tag: v0.14.7) Merge pull request #122 from thiskevinwang/Colors
010d2b2 (tag: v0.14.6) 0.14.6
7d1a8ef (tag: v0.14.5) 0.14.5
dcad28a (tag: 0.14.4) Merge pull request #119 from thiskevinwang/signup
8f5da92 (tag: v0.14.4, origin/signup) 0.14.4
84466a2 (tag: v0.14.3) 0.14.3
e9533eb (tag: v0.7.5) 0.7.5
545c86f (tag: 0.14.3) Comment box (#118)
fbcbd89 (tag: 0.14.2) Merge pull request #117 from thiskevinwang/continue-ssr-data-animations
f45fd12 (tag: 0.14.1) Merge pull request #116 from thiskevinwang/RDS-stuff
5108d39 (tag: 0.14.0) Supercool Animated "Grid" (#114)
49566b5 (tag: 0.13.0) Merge pull request #110 from thiskevinwang/modal-fixes
8ddd67b (tag: 0.12.0) Merge pull request #99 from thiskevinwang/optional-chaining
bc2724e (tag: 0.11.1) Merge pull request #97 from thiskevinwang/docker-blog
c4a9278 (tag: v0.8.0) v0.8.0
e518f8f (tag: 0.11.0) Merge pull request #94 from thiskevinwang/apollo-route-update
60908cd (tag: 0.10.4) Merge pull request #91 from thiskevinwang/3d
f51801d (tag: 0.10.3) Merge pull request #90 from thiskevinwang/quick-updates
42f0f5a (tag: 0.10.2) Merge pull request #88 from thiskevinwang/use-gesture
ceb3ae3 (tag: 0.10.1) Merge pull request #87 from thiskevinwang/project-cleanup
1b8b40d (tag: 0.10.0) Merge pull request #86 from thiskevinwang/intersection-observer-stuff
0c4f905 (tag: 0.9.2) Merge pull request #85 from thiskevinwang/ssr-styled-components
391774e (tag: 0.9.1) Merge pull request #84 from thiskevinwang/refactor
67773c0 (tag: 0.9.0) Merge pull request #79 from thiskevinwang/ios-like-styling
cf1061f (tag: 0.8.2) Merge pull request #77 from thiskevinwang/misc
55668d0 (tag: 0.8.1) Merge pull request #76 from thiskevinwang/misc
3875783 (tag: 0.8.0) Merge pull request #71 from thiskevinwang/buttonAndDrawer
fe796af (tag: 0.7.5) Merge pull request #73 from thiskevinwang/re-add-disqus
5d00626 (tag: 0.7.4) 0.7.4
74d10c1 (tag: 0.7.3) v0.7.3
f9e7aaf (tag: 0.7.2) Merge pull request #63 from thiskevinwang/attack-animation-simulator
3e2edb0 (tag: 0.7.1) Merge pull request #62 from thiskevinwang/prevent-rerenders
1ddfe78 (tag: 0.7.0) Merge pull request #60 from thiskevinwang/update-styles
61a7c32 (tag: 0.6.1) Merge pull request #59 from thiskevinwang/remove-disqus-comments
ea74ca1 (tag: 0.6.0) Merge pull request #58 from thiskevinwang/update-mobile-drawer
a5d896d (tag: 0.5.1) Merge pull request #56 from thiskevinwang/fix-console-errors
6b8286b (tag: 0.5.0) Merge pull request #50 from thiskevinwang/codeclimate-errors
24e5bbb (tag: 0.4.1) Merge pull request #47 from thiskevinwang/convert-everything-to-typescript
585ccfa (tag: 0.4.0) Merge pull request #45 from thiskevinwang/convert-everything-to-typescript
d94f947 (tag: 0.3.2) Merge pull request #44 from thiskevinwang/first-letter-tags
5dcde1f (tag: 0.3.1) Merge pull request #39 from thiskevinwang/emojis-and-padding
4d9e643 (tag: 0.3.0) Merge pull request #36 from thiskevinwang/featured-post-ui
1c6c433 (tag: 0.2.0) Merge pull request #35 from thiskevinwang/post-images
fa981f5 (tag: 0.1.0, tag: 0.0.1) Merge pull request #32 from thiskevinwang/climbing-season-begins
