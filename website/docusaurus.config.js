const REPO_URL = 'https://github.com/express-validator/express-validator';

// https://docusaurus.io/docs/api/docusaurus-config
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
          editUrl: `${REPO_URL}/edit/master/docs/`,
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
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
          href: REPO_URL,
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
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/express-validator/express-validator',
            },
            {
              html: `<a
                  class="github-button footer__link-item" href=${REPO_URL}
                  data-icon="octicon-star"
                  data-count-href="/express-validator/express-validator/stargazers"
                  data-show-count={true}
                  data-count-aria-label="# stargazers on GitHub"
                  aria-label="Star this project on GitHub"
                >
                  Star
                </a>`,
            },
          ],
        },
      ],
      copyright: 'Copyright © ' + new Date().getFullYear() + ' express-validator',
    },
  },
};

module.exports = siteConfig;
