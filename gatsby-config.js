require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Coffee ☕️ Code 💻 Climb 🧗🏻‍♂️`,
    author: `Kevin Wang`,
    description: `A blog about all things coffee, coding, and rock climbing.`,
    siteUrl: `https://coffeecodeclimb.com`,
    social: {
      twitter: `thekevinwang`,
    },
  },
  plugins: [
    `gatsby-plugin-typescript`,
    "gatsby-plugin-tslint",
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
        alias: { "@src": "src" },
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
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
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
          `gatsby-remark-prismjs`,
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
      resolve: `gatsby-plugin-google-adsense`,
      options: {
        publisherId: `${process.env.GATSBY_GOOGLE_AD_CLIENT}`,
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
