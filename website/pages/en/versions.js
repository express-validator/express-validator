/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const CWD = process.cwd();

const siteConfig = require(CWD + '/siteConfig.js');
const versions = require(CWD + '/versions.json');

const repoUrl = `https://github.com/${siteConfig.repoPath}`;
const docsUrl = `${siteConfig.baseUrl}docs`;

const VersionsTable = ({ versions }) => (
  <table className="versions">
    <tbody>
      {versions.map(version => (
        <tr key={version.name}>
          <th>{version.name}</th>
          <td>
            <a href={version.docs}>Documentation</a>
          </td>
          <td>
            <a href={version.infoUrl}>{version.infoLabel}</a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

class Versions extends React.Component {
  get latestVersion() {
    const name = versions[0];
    return [{
      name,
      docs: docsUrl,
      infoLabel: 'Release Notes',
      infoUrl: `${repoUrl}/releases/v${name}`
    }];
  }

  get nextVersion() {
    return [{
      name: 'master',
      docs: `${docsUrl}/next`,
      infoLabel: 'Source code',
      infoUrl: repoUrl
    }];
  }

  get olderVersions() {
    return versions.slice(1).map(version => ({
      name: version,
      docs: `${docsUrl}/${version}/`,
      infoLabel: 'Release Notes',
      infoUrl: `${repoUrl}/releases/v${version}`
    }));
  }

  render() {
    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer versionsContainer">
          <div className="post">
            <header className="postHeader">
              <h2>{siteConfig.title + ' Versions'}</h2>
            </header>

            <h3 id="latest">Current version (Stable)</h3>
            <p>Latest version of express-validator.</p>
            <VersionsTable versions={this.latestVersion}/>

            <h3 id="latest">Latest version</h3>
            <p>Here you can find the latest documentation and unreleased code.</p>
            <VersionsTable versions={this.nextVersion}/>

            {this.olderVersions.length > 0 && (
              <div>
                <h3 id="archive">Past versions</h3>
                <p>Here you can find documentation for previous versions of express-validator.</p>
                <VersionsTable versions={this.olderVersions}/>
                <p>
                  You can find past versions of this project{' '}
                  <a href={this.repoUrl}> on GitHub </a>.
                </p>
              </div>
            )}
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Versions;
