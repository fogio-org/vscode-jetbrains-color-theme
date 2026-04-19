#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parse, printParseErrorCode } = require('jsonc-parser');

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const themes = pkg.contributes.themes.map(t => ({
  label: t.label,
  uiTheme: t.uiTheme,
  file: path.join(root, t.path),
}));

let totalErrors = 0;
const loaded = [];

for (const t of themes) {
  const raw = fs.readFileSync(t.file, 'utf8');
  const errors = [];
  const obj = parse(raw, errors, { allowTrailingComma: true });
  if (errors.length) {
    console.error(`✗ ${path.basename(t.file)}: parse errors`);
    for (const e of errors) {
      console.error(`  - ${printParseErrorCode(e.error)} at offset ${e.offset}`);
    }
    totalErrors += errors.length;
    continue;
  }

  const colorsObj = obj.colors || {};
  const tokens = obj.tokenColors || [];
  const semantic = obj.semanticTokenColors || {};

  // Validate hex colors in workbench colors
  for (const [k, v] of Object.entries(colorsObj)) {
    if (typeof v !== 'string') continue;
    if (v === 'default') continue;
    if (!HEX_RE.test(v)) {
      console.error(`✗ ${path.basename(t.file)}: invalid color "${k}" = "${v}"`);
      totalErrors++;
    }
  }

  // Validate tokenColors
  for (const [i, tc] of tokens.entries()) {
    if (!tc.settings) {
      console.error(`✗ ${path.basename(t.file)}: tokenColors[${i}] missing settings`);
      totalErrors++;
      continue;
    }
    const fg = tc.settings.foreground;
    if (fg !== undefined && !HEX_RE.test(fg)) {
      console.error(`✗ ${path.basename(t.file)}: tokenColors[${i}] bad fg "${fg}"`);
      totalErrors++;
    }
  }

  loaded.push({ t, colorsObj, semantic });
  console.log(`✓ ${path.basename(t.file)} — colors: ${Object.keys(colorsObj).length}, tokens: ${tokens.length}, semantic: ${Object.keys(semantic).length}`);
}

// Cross-theme parity check (warnings only)
if (loaded.length === 2) {
  const [a, b] = loaded;
  const aKeys = new Set(Object.keys(a.colorsObj));
  const bKeys = new Set(Object.keys(b.colorsObj));
  const onlyInA = [...aKeys].filter(k => !bKeys.has(k));
  const onlyInB = [...bKeys].filter(k => !aKeys.has(k));
  if (onlyInA.length || onlyInB.length) {
    console.log(`\n⚠ workbench color key parity (warning only):`);
    if (onlyInA.length) console.log(`  only in ${path.basename(a.t.file)}: ${onlyInA.length}`);
    if (onlyInB.length) console.log(`  only in ${path.basename(b.t.file)}: ${onlyInB.length}`);
  }
  const aSem = new Set(Object.keys(a.semantic));
  const bSem = new Set(Object.keys(b.semantic));
  const semOnlyA = [...aSem].filter(k => !bSem.has(k));
  const semOnlyB = [...bSem].filter(k => !aSem.has(k));
  if (semOnlyA.length || semOnlyB.length) {
    console.log(`⚠ semantic token parity:`);
    if (semOnlyA.length) console.log(`  only in ${path.basename(a.t.file)}: ${semOnlyA.join(', ')}`);
    if (semOnlyB.length) console.log(`  only in ${path.basename(b.t.file)}: ${semOnlyB.join(', ')}`);
  }
}

if (totalErrors > 0) {
  console.error(`\n✗ ${totalErrors} error(s)`);
  process.exit(1);
}
console.log('\n✓ all themes valid');
