// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
import 'dotenv/config';

const redirectsList = require("./redirects.js").redirectLinks;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Biconomy",
  tagline: "Superpowers for your Web3 stack",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.biconomy.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  customFields: {
    // Put your custom environment here
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    PAYMASTER_TOKENS_GOOGLE_SHEET_ID: process.env.PAYMASTER_TOKENS_GOOGLE_SHEET_ID
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          lastVersion: "current",
          versions: {
            current: {
              label: "SDK V4 (latest)",
            },
            "3.0": {
              label: "SDK V3",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */

    ({
      // Replace with your project's social card

      // ...
      algolia: {
        // The application ID provided by Algolia
        appId: "HQDCKSUST1",

        // Public API key: it is safe to commit it
        apiKey: "0fcf92733adc72670126f29f681b0a62",

        indexName: "biconomy",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "search",

        //... other Algolia params
      },
      image: "img/thumbnail.png",
      metadata: [{ name: "twitter:card", content: "summary_large_image" }],
      navbar: {
        title: "Biconomy",
        logo: {
          alt: "My Site Logo",
          src: "img/docusaurus.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Docs",
          },
          { to: "https://www.biconomy.io/blog", label: "Blog", position: "left" },
          {
            to: "/partners",
            position: "left",
            label: "Add Ons",
            activeBaseRegex: `/partners/`,
          },
          {
            href: "https://dashboard.biconomy.io/",
            label: "Dashboard",
            position: "right",
          },
          {
            href: "https://github.com/bcnmy/docs",
            label: "GitHub",
            position: "right",
          },
          {
            type: "docsVersionDropdown",
          },
          { to: "https://github.com/orgs/bcnmy/discussions/categories/q-a", label: "Discussions", position: "left" },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Quick Start",
                to: "/quickstart",
              },
              {
                label: "Smart Accounts",
                to: "/account",
              },
              {
                label: "Paymaster",
                to: "/paymaster",
              },
              {
                label: "Bundler",
                to: "/bundler",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Github Discussion",
                href: "https://github.com/orgs/bcnmy/discussions/categories/q-a",
              },
              {
                label: "Discord",
                href: "https://discord.gg/biconomy",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/biconomy",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/bcnmy/docs",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Biconomy Built with Docusaurus.`,
      },
      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["solidity"],
      },
    }),

  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: redirectsList,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "partners",
        path: "partners",
        routeBasePath: "partners",
        sidebarPath: "./sidebarsPartners.js",
        // ... other options
      },
    ],
    [
      "@docusaurus/plugin-google-tag-manager",
      {
        containerId: 'GTM-58745M9M',
      },
    ],
  ],
};

module.exports = config;
