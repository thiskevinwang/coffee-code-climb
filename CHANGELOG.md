# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.22.0] - 2020-12-08

This change introduces a bottom navigation component & drawer.

### Added

- SimpleBottomNavigation
- SwipeableTemporaryDrawer
  - this component is an Avatar that opens a drawer
  - this reads the avatar_url from apollo cache

### Changed

- layout2 uses SimpleBottomNavigation
- `notistack` snackbars positioned at top, for XS screens

## [v0.21.2] - 2020-12-08

### Added

- fun title-text gradient, on hover (copied from Github)

## [v0.21.1] - 2020-12-08

### Fixed

- Missing button margin-bottoms on /auth/signup & /auth/login

## [v0.21.0] - 2020-12-06

**NEW**: AvatarCropper (again)

In this tag, I went back and tried to refactor S3-avatar-uploading code that I completely forgot how to do.

🐛 I encountered a _pretty real_ bug with object versioning on an S3 bucket.

- I uploaded images on the same **key**: 🐳 -> 🐈 -> 🦜
  - The object gets created and displays on the frontend fine (🐳)
- I'd the second image (🐈)
  - The version ID & revision-date would get bumped correctly, but the actual object would still be the previous image, (🐳)
- Meanwhile in S3, the (🐈) would be _floating around, somewhere in the AWS ether, invisibly..._
- I'd upload a third image (🦜)
  - The more recent object **still** displayed (🐳)
  - The (🐈) image would suddenly appear in version history
  - The (🦜) would be next to _float around in the ether_

☝️ Solution? ... delete and recreate the bucket 🤷🏻‍♂️

- Needed to make it public
- And add [CORS json](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html#how-do-i-enable-cors)

### Added

- `<Modal.*>` component
- `<AvatarCropper>` component

### Changed

- NavBar2 uses MUI AppBar
  - hide NavBar2 on "xs down"
- override typography.js `img` margin on `/app` pages
- SubmitButton: removed `margin-bottom`
- Updated graphql-generated types
- unset `maxWidth` on layout.tsx & layout2.tsx
  - `Box`'s under /app should have
    ```ts
    px = "var(--geist-gap)"
    mx = "auto"
    maxWidth = "var(--geist-page-width-with-margin)"
    ```

### Removed

- momentjs
- `breakoutFromMaxWidth` - no more legacy layout headache to deal with

## [v0.20.3] - 2020-12-02

### Fixed

- temporary fix for incorrect SSR styles
  - see MUI / jss

## [v0.20.2] - 2020-12-02

### Changed

- Moved some logs behind `__DEV__`

## [v0.20.1] - 2020-12-02

### Added

- `notistack` + SnackbarProvider w/ styles
- Various skeleton UI elements for query loading

### Changed

- logout triggers snackbar message
- social login success triggers snackbar message
- one-time code success triggers snackbar message
- username success/error triggers snackbar message

### Fixed

- 'breakoutFromMaxWidth'.. again

## [v0.20.0] - 2020-12-01

### Added

- ✨ feature to update username!

### Changed

- added `graphql-codegen`
- added generated types
- refactored to use Dynamo backend
  - see https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.4.0...v0.5.0

## [v0.19.5] - 2020-11-30

### Added

- FacebookSDK.tsx (unimplemented)
- GoogleSDK.tsx (unimplemented)

## [v0.19.4] - 2020-11-30

### Changed

- SubmitButton style
- bumped `aws-sdk` ^2.778.0 to 2.799.0
  - removed `credentials` because I deleted an Identity Pool
- extracted Blob component

## [v0.19.3] - 2020-11-29

### Added

- Alert component; implemented in auth flow
  - /auth/login
  - /auth/signup
  - /auth/verify

### Changed

- facebook svg icon

### Fixed

- SvgTrail overflow problems
  - `#___gatsby` position relative
- 'breakoutFromMaxWidth' margin errors b0c6cae
  - TODO: figure out why it worked

## [v0.19.2] - 2020-11-27

### Fixed

- Added SEO component for missing title metadata on `/app/*`

## [v0.19.1] - 2020-11-26

### Added

- FieldSet component
  - see https://vercel.com/design/fieldset
- /app/profile fetches data; depends on:
  - https://github.com/thiskevinwang/rds-ts-node-server/pull/28
  - https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.3.1...v0.4.0
  - ![image](https://user-images.githubusercontent.com/26389321/100408368-d254b280-3038-11eb-8751-b57e0f59f2c9.png)
- /app/settings significant UI changes
  - ![image](https://user-images.githubusercontent.com/26389321/100408402-e4365580-3038-11eb-8f22-7cb017a65786.png)

### Removed

- /auth/forgot page
- /auth/reset page
- header links on /app pages

## [v0.19.0] - 2020-11-25

Google federated signin & Email magic codes

- see https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/ for TypeScript lambda triggers

## [v0.18.3] - 2020-11-22

The bulk of this version is styling the `/pages/app` component, to mimic Vercel.
Also added is a Vercel-like Menu

![](https://user-images.githubusercontent.com/26389321/99961241-0b9cd200-2d5c-11eb-9ae5-b8a668853ea9.png)
![](https://user-images.githubusercontent.com/26389321/99961369-4dc61380-2d5c-11eb-9530-97c882adf7f0.png)

### Added

- Vercel-like menu to NavBar2
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

- /pages/app.tsx - vercel mimic
- NavBar, Header, Layout (old) - improve types
- ThemeSlider style to use some Geist css vars
- `<a>` styles
- NavBar2
  - add dope Menu!!!
- Layout 1 & 2
  - maxWidth: `var(--geist-page-width-with-margin)`
  - paddingX: `var(--geist-gap)`

### Todos

- extract new menu out of NavBar2.tsx

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

[v0.22.0]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.21.2...v0.22.0
[v0.21.2]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.21.1...v0.21.2
[v0.21.1]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.21.0...v0.21.1
[v0.21.0]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.20.3...v0.21.0
[v0.20.3]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.20.2...v0.20.3
[v0.20.2]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.20.1...v0.20.2
[v0.20.1]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.20.0...v0.20.1
[v0.20.0]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.19.5...v0.20.0
[v0.19.5]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.19.4...v0.19.5
[v0.19.4]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.19.3...v0.19.4
[v0.19.3]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.19.2...v0.19.3
[v0.19.2]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.19.1...v0.19.2
[v0.19.1]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.19.0...v0.19.1
[v0.19.0]: https://github.com/thiskevinwang/coffee-code-climb/compare/v0.18.3...v0.19.0
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
