import React from 'react';
import { Redirect } from '@docusaurus/router';

export default function IndexPage() {
  return (
    <>
      <Redirect to="docs" />
      <div>
        If you are not redirected automatically, follow this <a href="docs/">link</a>.
      </div>
    </>
  );
}
