#!/usr/bin/env node

/**
 * Script to identify hardcoded strings in JSX files that should be translated
 * Usage: node scripts/findTranslatableStrings.js
 */

const fs = require('fs');
const path = require('path');

const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
];

const STRING_PATTERN = /["'`]([^"'`]{10,})["'`]/g;
const COMMON_TECHNICAL_TERMS = [
  'localhost',
  'http',
  'https',
  'src',
  'className',
  'onClick',
  'href',
];

function isExcluded(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function findJsxFiles(dir) {
  let jsxFiles = [];
  
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      if (isExcluded(filePath)) continue;
      
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        jsxFiles = [...jsxFiles, ...findJsxFiles(filePath)];
      } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
        jsxFiles.push(filePath);
      }
    }
  } catch (err) {
    // Ignore errors in reading directories
  }
  
  return jsxFiles;
}

function extractStrings(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const strings = [];
  let match;
  
  while ((match = STRING_PATTERN.exec(content)) !== null) {
    const str = match[1];
    
    // Skip very short strings and technical terms
    if (str.length < 3) continue;
    if (COMMON_TECHNICAL_TERMS.some(term => str.includes(term))) continue;
    
    strings.push({
      string: str,
      line: content.substring(0, match.index).split('\n').length,
    });
  }
  
  return strings;
}

console.log('🔍 Finding translatable strings in JSX files...\n');

const srcDir = path.join(__dirname, '../src');
const jsxFiles = findJsxFiles(srcDir);

const allStrings = {};

for (const filePath of jsxFiles) {
  const strings = extractStrings(filePath);
  
  if (strings.length > 0) {
    const relativePath = path.relative(srcDir, filePath);
    allStrings[relativePath] = strings;
  }
}

// Output results
let totalStrings = 0;
for (const [file, strings] of Object.entries(allStrings)) {
  console.log(`📄 ${file}`);
  
  for (const { string, line } of strings) {
    console.log(`   Line ${line}: "${string}"`);
    totalStrings++;
  }
  
  console.log();
}

console.log(`\n📊 Total potential translatable strings found: ${totalStrings}`);
console.log('\n✅ Review the above strings and add them to:');
console.log('   - src/i18n/locales/en.json (English)');
console.log('   - src/i18n/locales/fr.json (French)');
