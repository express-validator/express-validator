/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  get repoUrl() {
    const { config: { repoPath } } = this.props;
    return `https://github.com/${repoPath}`;
  }

  docUrl(doc) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + 'docs/' + doc;
  }

  render() {
    const { config } = this.props;
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={config.baseUrl} className="nav-home">
            {config.footerIcon && (
              <img
                src={config.baseUrl + config.footerIcon}
                alt={config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('index.html', this.props.language)}>
              Getting Started
            </a>
            <a href={this.docUrl('check-api.html', this.props.language)}>
              API Reference
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="http://stackoverflow.com/questions/tagged/express-validator"
              target="_blank"
              rel="noreferrer noopener">
              Stack Overflow
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={this.repoUrl}>GitHub</a>
            <a
              className="github-button"
              href={this.repoUrl}
              data-icon="octicon-star"
              data-count-href="/express-validator/express-validator/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
        </section>

        <section className="copyright">{config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
