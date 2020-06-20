require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Coffee Code Climb`,
    author: `Kevin Wang`,
    description: `A blog about all things coffee, coding, and rock climbing.`,
    siteUrl: `https://coffeecodeclimb.com`,
    social: {
      twitter: `thekevinwang`,
    },
  },
  plugins: [
    `gatsby-plugin-typescript`,
    {
      resolve: "gatsby-plugin-tslint",
      options: {
        test: /\.ts$|\.tsx$/,
        exclude: /(node_modules|cache|public)/,
      },
    },
    /**
     * https://www.gatsbyjs.org/packages/gatsby-plugin-styled-components/
     */
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        // plugins: ["babel-plugin-styled-components"],
      },
    },
    {
      resolve: `gatsby-plugin-amazon-onetag`,
      options: {
        // Grab this from https://affiliate-program.amazon.com/home/tools/onetag
        adInstanceId: process.env.GATSBY_AD_INSTANCE_ID,

        // Include Amazon oneTag in development.
        // Defaults to false meaning Amazon oneTag will only be loaded in production.
        includeInDevelopment: true,

        // Default marketplace is US
        marketplace: "US",
      },
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `5e3yg0s79tcq`,
        // Learn about environment variables: https://gatsby.dev/env-vars
        accessToken: process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN,
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "*": "src/*",
          src: "src",
          apollo: "src/apollo",
          entities: "src/entities",
          components: "src/components",
          consts: "src/consts",
          css: "src/css",
          fonts: "src/fonts",
          globalStyles: "src/globalStyles",
          hooks: "src/hooks",
          pages: "src/pages",
          _reduxState: "src/_reduxState",
          svg: "src/svg",
          templates: "src/templates",
          utils: "src/utils",
        },
        extensions: [],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        tableOfContents: {
          // heading: true,
          // maxDepth: 6,
        },
        // CommonMark mode (default: true)
        commonmark: true,
        // Footnotes mode (default: true)
        footnotes: true,
        // Pedantic mode (default: true)
        pedantic: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Plugins configs
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1180,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 800,
              height: 400,
            },
          },
          /**
           * @warning
           * gatsby-remark-autolink-headers needs to be placed BEFORE
           * gatsby-remark-prismjs
           */
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: `100`,
              // icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
              // className: `custom-class`,
              // maintainCase: true,
              // removeAccents: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: "language-",
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: null,
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {},
              // This toggles the display of line numbers globally alongside the code.
              // To use it, add the following line in src/layouts/index.js
              // right after importing the prism color scheme:
              //  `require("prismjs/plugins/line-numbers/prism-line-numbers.css");`
              // Defaults to false.
              // If you wish to only show line numbers on certain code blocks,
              // leave false and use the {numberLines: true} syntax below
              showLineNumbers: true,
              // If setting this to true, the parser won't handle and highlight inline
              // code used in markdown i.e. single backtick code like `this`.
              noInlineHighlight: false,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `${process.env.GATSBY_TRACKING_ID}`,
      },
    },
    {
      resolve: `@isamrish/gatsby-plugin-google-adsense`,
      options: {
        googleAdClientId: `${process.env.GATSBY_GOOGLE_AD_CLIENT}`,
        head: true,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Coffee Code Climb`,
        short_name: `Coffee Code Climb`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
