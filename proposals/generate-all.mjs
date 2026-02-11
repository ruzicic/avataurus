#!/usr/bin/env node
// Master script: generates all proposal SVGs
import { execSync } from 'child_process';
const dir = new URL('.', import.meta.url).pathname;
for (const script of ['a-geometric-dino.mjs', 'b-abstract-shapes.mjs', 'c-minimal-face.mjs', 'd-identicon-plus.mjs']) {
  console.log(`Generating ${script}...`);
  execSync(`node ${dir}${script}`, { stdio: 'inherit' });
}
console.log('Done! All SVGs generated.');
