// See https://docusaurus.io/docs/site-config.html for all the possible site configuration options.
const siteConfig = {
  // Metadata
  title: 'express-validator',
  tagline: 'express-validator docs',
  url: 'https://express-validator.github.io',
  baseUrl: '/',
  repoPath: 'express-validator/express-validator',
  projectName: 'express-validator.github.io',
  organizationName: 'express-validator',

  // Website customization
  headerLinks: [
    {doc: 'index', label: 'Docs'},
    {doc: 'check-api', label: 'API'},
    {href: 'https://github.com/express-validator/express-validator', label: 'GitHub'},
  ],
  headerIcon: 'img/logo.svg',
  footerIcon: 'img/logo.svg',
  favicon: 'img/favicon.png',
  colors: {
    primaryColor: 'rgb(107, 0, 177)',
    secondaryColor: 'rgb(93, 0, 154)',
  },
  onPageNav: 'separate',
  scripts: ['https://buttons.github.io/buttons.js'],

  // Features
  editUrl: 'https://github.com/express-validator/express-validator/edit/master/docs/',
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' express-validator',
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  }
};

module.exports = siteConfig;
