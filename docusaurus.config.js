// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Biconomy',
  tagline: 'Superpowers for your Web3 stack',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          lastVersion: 'current',
          versions: {
            current: {
              label: 'SDK V2',
            },
            "1.0": {
              label: 'SDK V1'
            }
          }
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Biconomy',
        logo: {
          alt: 'My Site Logo',
          src: 'img/docusaurus.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/bcnmy/docs',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'docsVersionDropdown',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Quick Start',
                to: '/docs/quickstart',
              },
              {
                label: 'Smart Accounts',
                to: '/docs/category/smart-accounts',
              },
              {
                label: 'Paymaster',
                to: '/docs/category/paymaster',
              },
              {
                label: 'Bundler',
                to: '/docs/category/bundler',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Forums',
                href: 'https://forum.biconomy.io/',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/biconomy',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/biconomy',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/bcnmy/docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Biconomy Built with Docusaurus.`,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

    plugins:[
      [
        '@docusaurus/plugin-client-redirects',
        {
          redirects: [
            // /docs/oldDoc -> /docs/newDoc
            {
              to: '/docs/category/smart-accounts',
              from: '/sdk-reference/smart-account-methods',
            },
            // Redirect from multiple old paths to the new path
            // {
            //   to: '/docs/newDoc2',
            //   from: ['/docs/oldDocFrom2019', '/docs/legacyDocFrom2016'],
            // },
          ],
        },
      ],
    ],
};

module.exports = config;