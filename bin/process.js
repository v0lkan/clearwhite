#!/usr/bin/env node

const { stat, readFile, writeFile, readdir } = require('fs');
const { resolve, join, extname } = require('path');

const showdown = require('showdown');
const converter = new showdown.Converter();

const hljs = require('highlight.js');

const PROJECT_ROOT = join(__dirname, '..');
const DATA_DIR = join(PROJECT_ROOT, 'public/data');

const readDir = (dir) => new Promise((resolve, reject) => {
  readdir(dir, (err, list) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(list);
  });
});

const statFile = (file) => new Promise((resolve, reject) => {
  stat(file, (err, stat) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(stat);
  });
});

const isDir = (stat) => !!stat && stat.isDirectory();

const shouldWalk = (dir) => !dir.endsWith('node_modules') &&
  !dir.endsWith('.git') && !dir.endsWith('.idea');

const walk = async (dir) => {
  const results = [];

  try {
    await Promise.all((await readDir(dir)).map(async (f) => {
      try {
        const file = resolve(dir, f);

        if (isDir(await statFile(file))) {
          if (shouldWalk(file)) {
            results.push(...await walk(file));
          }

          return;
        }

        results.push(file);
      } catch (ex) {
        console.error(ex);
      }
    }));
  } catch (err) {
    console.error(err);
  }

  return results;
};

const readCode = (path) => new Promise((resolve, reject) =>
  readFile(path, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      reject(err);
    }

    resolve(data);
  })
);

// A unique-enough separator.
const separator = '-_cw_-';

const convertMarkdownToHtml = (md) => converter.makeHtml(md);

const highlightedHtml = ({name, code}) => {
  if (!name) {
    return hljs.highlightAuto(code);
  }

  return hljs.highlight(name, code, true);
};

const saveDataFile = (name, text) => new Promise((resolve, reject) => {
  writeFile(join(DATA_DIR, name), text, { encoding: 'utf-8'}, (err) => {
    if (err) {
      reject({ success: false, cause: err });
      return;
    }

    resolve({ success: true });
  });
});

const saveHighlightedHtml = async ({ name, path, code}) => {
  const html = highlightedHtml({ name, code });
  const filePath = path.substring(PROJECT_ROOT.length);
  const fileNameToSave = `${filePath.replace(/\//g, separator)}.html`;

  return saveDataFile(fileNameToSave, html.value);
};


const saveMarkdownHtml = async ({ path, markdown }) => {
  const html = convertMarkdownToHtml(markdown);
  const filePath = path.substring(PROJECT_ROOT.length);
  const fileNameToSave = `${filePath.replace(/\//g, separator)}.html`;

  return saveDataFile(fileNameToSave, html);
};


const run = async () => {
  const results = await walk(PROJECT_ROOT);

  results.forEach(async (path) => {
    try {
      const sourceCode = await readCode(path);
      const extension = extname(path);

      switch (extension.toLowerCase()) {
        case '.md':
          await saveMarkdownHtml({ path, markdown: sourceCode });
          break;
        case '.css':
          await saveHighlightedHtml({ name: 'css', path, code: sourceCode });
          break;
        case '.js':
          await saveHighlightedHtml({ name: 'js', path, code: sourceCode });
          break;
        case '.html':
          await saveHighlightedHtml({ name: 'html', path, code: sourceCode });
          break;
        case '.sass':
          await saveHighlightedHtml({ name: 'sass', path, code: sourceCode });
          break;
        default:
          await saveHighlightedHtml({ path, code: sourceCode });
          break;
      }

      // save the highlighted markup to public/cw/$path$extension.html
      // markdown files are an exception:
      //     convert them directly to html public/cw/$path.html by showdown or something.
    } catch (err) {
      console.error(err);
    }
  });
};

run().then(() => {});