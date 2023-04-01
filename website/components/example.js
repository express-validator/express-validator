import React from 'react';
import styles from './example.module.css';

export const SideBySideExample = ({ children }) => {
  return <div className={styles.example}>{children}</div>;
};

export const ExampleCell = ({ title, children }) => (
  <div>
    <strong className={styles.exampleTitle}>{title}</strong>
    {children}
  </div>
);

export function UsageExample({ children }) {
  return (
    <div>
      <strong className={styles.exampleTitle}>Usage example</strong>
      {children}
    </div>
  );
}

export function ErrorExample({ children }) {
  return (
    <div>
      <strong className={styles.exampleTitle}>Error example</strong>
      {children}
    </div>
  );
}
