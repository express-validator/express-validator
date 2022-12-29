// See https://docusaurus.io/docs/site-config.html for all the possible site configuration options.
const siteConfig = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./static/css/custom.css'),
        },
        docs: {
          path: '../docs/',
          sidebarPath: require.resolve('./sidebars.json'),
          editUrl: 'https://github.com/express-validator/express-validator/edit/master/docs/',
        },
      },
    ],
  ],

  // Metadata
  title: 'express-validator',
  tagline: 'express-validator docs',
  url: 'https://express-validator.github.io',
  baseUrl: '/',
  projectName: 'express-validator.github.io',
  organizationName: 'express-validator',

  // Website customization
  favicon: 'img/favicon.png',
  scripts: ['https://buttons.github.io/buttons.js'],
  themeConfig: {
    // algolia: {
    //   apiKey: 'd6d85148b3b81778cf952442d4292bea',
    //   indexName: 'express-validator',
    //   algoliaOptions: {
    //     facetFilters: ['type:lvl3', 'language:LANGUAGE', 'version:VERSION'],
    //   },
    // },
    navbar: {
      logo: {
        src: 'img/logo.svg',
      },
      items: [
        { type: 'doc', docId: 'index', label: 'Docs', position: 'left' },
        { type: 'doc', docId: 'check-api', label: 'API', position: 'left' },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/express-validator/express-validator',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        src: 'img/logo.svg',
      },
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs',
            },
            {
              label: 'API Reference',
              to: 'docs/check-api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'StackOverflow',
              href: 'http://stackoverflow.com/questions/tagged/express-validator',
            },
          ],
        },
        { title: 'More', items: [] },
      ],
      copyright: 'Copyright © ' + new Date().getFullYear() + ' express-validator',
    },
  },
};

module.exports = siteConfig;
