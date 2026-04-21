#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

const expectString = (value, field) => {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`package.json must declare a non-empty string field: ${field}`);
  }
};

const expectFile = (relativePath, field) => {
  expectString(relativePath, field);
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    fail(`${field} points to a missing file: ${relativePath}`);
  }
};

['name', 'displayName', 'publisher', 'version', 'description'].forEach((field) => {
  expectString(pkg[field], field);
});

if (!pkg.engines || typeof pkg.engines.vscode !== 'string' || pkg.engines.vscode.trim() === '') {
  fail('package.json must declare engines.vscode');
}

expectFile(pkg.icon, 'icon');

if (!pkg.contributes || !Array.isArray(pkg.contributes.themes) || pkg.contributes.themes.length === 0) {
  fail('package.json must declare contributes.themes with at least one theme');
}

const allowedUiThemes = new Set(['vs', 'vs-dark', 'hc-black', 'hc-light']);
const themeIds = new Set();

for (const [index, theme] of pkg.contributes.themes.entries()) {
  if (!theme || typeof theme !== 'object') {
    fail(`contributes.themes[${index}] must be an object`);
  }

  expectString(theme.label, `contributes.themes[${index}].label`);
  expectString(theme.id, `contributes.themes[${index}].id`);
  expectString(theme.uiTheme, `contributes.themes[${index}].uiTheme`);
  expectFile(theme.path, `contributes.themes[${index}].path`);

  if (!allowedUiThemes.has(theme.uiTheme)) {
    fail(
      `contributes.themes[${index}].uiTheme must be one of: ${Array.from(allowedUiThemes).join(', ')}`
    );
  }

  if (themeIds.has(theme.id)) {
    fail(`contributes.themes contains duplicate id: ${theme.id}`);
  }
  themeIds.add(theme.id);
}

if (pkg.categories && !pkg.categories.includes('Themes')) {
  fail('package.json categories must include "Themes" for a theme extension');
}

console.log(`✓ package.json manifest valid`);
console.log(`✓ themes declared: ${pkg.contributes.themes.length}`);
