// @ts-check

const REPO_URL = 'https://github.com/express-validator/express-validator';

/** @type {import('@docusaurus/preset-classic').Options} */
const presetConfig = {
  theme: {
    customCss: require.resolve('./static/css/custom.css'),
  },
  pages: {
    path: 'pages',
  },
  docs: {
    path: '../docs/',
    sidebarPath: require.resolve('./sidebars.json'),
    editUrl: `${REPO_URL}/edit/master/docs/`,
    sidebarCollapsible: false,
  },
};

/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
const themeConfig = {
  algolia: {
    appId: 'FQ1KVDLIFN',
    apiKey: 'ae064d27baea810146de2d45f8b0dd58',
    indexName: 'express-validator',
    algoliaOptions: {
      facetFilters: ['type:lvl3', 'language:LANGUAGE', 'version:VERSION'],
    },
  },
  colorMode: {
    respectPrefersColorScheme: true,
  },
  docs: {
    sidebar: {
      autoCollapseCategories: false,
    },
  },
  navbar: {
    title: 'express-validator',
    logo: {
      src: 'img/logo.svg',
    },
    items: [
      {
        type: 'docsVersionDropdown',
        position: 'left',
      },
      { type: 'doc', docId: 'index', label: 'Docs', position: 'right' },
      { type: 'docSidebar', sidebarId: 'api', label: 'API', position: 'right' },
      {
        href: REPO_URL,
        label: 'GitHub',
        position: 'right',
      },
      {
        type: 'search',
        position: 'right',
        className: 'navbar-search',
      },
    ],
  },
  footer: {
    style: 'dark',
    logo: {
      src: 'img/logo-horizontal.svg',
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
            to: 'docs/api/check',
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
                  data-show-count="true"
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
};

// https://docusaurus.io/docs/api/docusaurus-config
/** @type {import('@docusaurus/types').Config} */
const siteConfig = {
  presets: [['@docusaurus/preset-classic', presetConfig]],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
        // All these redirects match pages that existed in the docs structure prior to v7.0.0.
        // They are here in case they were linked to out in the wild, so that those links don't break
        redirects: [
          {
            from: ['/docs/wildcards', '/docs/whole-body-validation'],
            to: '/docs/guides/field-selection',
          },
          {
            from: ['/docs/custom-validators-sanitizers', '/docs/custom-error-messages'],
            to: '/docs/guides/customizing',
          },
          {
            from: '/docs/running-imperatively',
            to: '/docs/guides/manually-running',
          },
          { from: '/docs/check-api', to: '/docs/api/check' },
          {
            from: ['/docs/validation-chain-api', '/docs/sanitization-chain-api'],
            to: '/docs/api/validation-chain',
          },
          { from: '/docs/matched-data-api', to: '/docs/api/matched-data' },
          { from: '/docs/validation-result-api', to: '/docs/api/validation-result' },
        ],
      },
    ],
  ],
  staticDirectories: ['static'],

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
  themeConfig,
};

module.exports = siteConfig;
