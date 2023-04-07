// We're on standalone JS code, so it's fine to use require():
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const ts = require('typescript');

const generatedDocsPath = path.resolve(__dirname, '../../docs/api/validator');

// Keep the following in sync with .github/workflows/docs.yml
const optionsPath = path.resolve(__dirname, '../../src/options.ts');
const validatorsPath = path.resolve(__dirname, '../../src/chain/validators.ts');
const sanitizersPath = path.resolve(__dirname, '../../src/chain/sanitizers.ts');

const program = ts.createProgram([optionsPath, validatorsPath, sanitizersPath], {});
const options = readOptions();

// Underscore prefix to make docusaurus not generate a docs page for these.
// They are meant to be imported by other markdown files.
// https://docusaurus.io/docs/markdown-features/react#importing-markdown
regenerateSource(validatorsPath, path.join(generatedDocsPath, '_validators.md'));
regenerateSource(sanitizersPath, path.join(generatedDocsPath, '_sanitizers.md'));

/**
 * Reads the options file and builds a map of option name to definition.
 */
function readOptions() {
  const source = program.getSourceFile(optionsPath);
  const options = {};
  source.forEachChild(node => {
    if (ts.isTypeAliasDeclaration(node)) {
      const name = node.name.text;
      options[name] = node.type
        .getText(source)
        .split(/\s*\|\s*/)
        // Filter out empty values, in case the source is formatted like `type X = | Foo | Bar`
        .filter(Boolean);
    }

    if (ts.isInterfaceDeclaration(node)) {
      const name = node.name.text;
      let props = {};

      // Loop through types that this interface extends. Limitations:
      // 1. No recursion
      // 2. Doesn't support non-interface extend clauses
      // 3. Assumes that the extended interface has already been visited
      node.heritageClauses?.forEach(clause => {
        clause.types.forEach(type => {
          const typeName = type.getText(source);
          props = {
            ...props,
            ...options[typeName],
          };
        });
      });

      node.forEachChild(child => {
        if (ts.isPropertySignature(child)) {
          props[child.name.text] = child.getText(source);
        }
      });

      options[name] = props;
    }
  });
  return options;
}

/**
 * Reads an input file, finds interfaces that declare methods from validator.js,
 * and generate an output markdown file for these.
 */
function regenerateSource(input, output) {
  const source = program.getSourceFile(input);
  const optionsPattern = `Options.(${Object.keys(options).join('|')})`;
  const outputEntries = [];

  source.forEachChild(node => {
    if (!ts.isInterfaceDeclaration(node)) {
      return;
    }

    node.forEachChild(child => {
      if (!ts.isMethodSignature(child) || !validator[child.name.text]) {
        return;
      }

      const name = child.name.text;
      let outputContents = `#### \`${name}()\`\n\n`;

      let details = [];

      const params = child.parameters
        .map(param => {
          // const printedParam = printer.printNode(ts.EmitHint.Unspecified, param, source);
          const text = param.getText(source);
          return text.replace(new RegExp(optionsPattern), (_match, optionName) => {
            const option = options[optionName];
            if (Array.isArray(option)) {
              if (option.length >= 10) {
                details.push(
                  '<details>\n' +
                    `<summary>Possible values of ${optionName}</summary>\n\n` +
                    option.map(item => `- \`${item}\``).join('\n') +
                    '\n\n</details>',
                );
                return optionName;
              }

              return option.join(' | ');
            }

            const objText = Object.values(option)
              // Indent properties
              .map(prop => `  ${prop}`)
              .join('\n');
            return `{\n${objText}\n}`;
          });
        })
        .join(', ');

      const signature = `${name}(${params}): ValidationChain`;
      outputContents += '```ts\n' + signature + '\n```';
      outputContents += details.length ? `\n\n${details.join('\n')}` : '';
      outputEntries.push(outputContents);
    });
  });

  fs.writeFileSync(output, outputEntries.join('\n\n'));
}
