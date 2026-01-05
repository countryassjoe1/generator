#!/usr/bin/env node
/**
 * Token Generator – creates an ERC-20 contract with burn functionality
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .requiredOption('-t, --template <fixed|flexible>', 'Which Solidity template to use')
  .requiredOption('-n, --name <string>', 'Token name (human readable)')
  .requiredOption('-s, --symbol <string>', 'Token symbol')
  .option('-d, --decimals <number>', 'Decimals (only for flexible template)', parseInt, 18)
  .requiredOption('-a, --supply <number>', 'Initial supply – whole token amount', Number)
  .option('-o, --out <path>', 'Output folder for generated contracts', 'contracts')
  .parse(process.argv);

const opts = program.opts();

function toClassName(str) {
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('');
}

const tmplFile = opts.template === 'fixed'
  ? path.join(__dirname, '../templates/ERC20TemplateFixed.sol')
  : path.join(__dirname, '../templates/ERC20TemplateFlexible.sol');

if (!fs.existsSync(tmplFile)) {
  console.error(`❌ Template not found at ${tmplFile}`);
  process.exit(1);
}

let tmpl = fs.readFileSync(tmplFile, 'utf8');
const className = toClassName(opts.name);

tmpl = tmpl.replace(/{{CLASS_NAME}}/g, className)
           .replace(/{{TOKEN_NAME}}/g, opts.name)
           .replace(/{{TOKEN_SYMBOL}}/g, opts.symbol);

if (opts.template === 'fixed') {
  const rawSupply = BigInt(opts.supply) * (10n ** 18n);
  tmpl = tmpl.replace(/{{INITIAL_SUPPLY}}/g, rawSupply.toString());
} else {
  tmpl = tmpl.replace(/{{DECIMALS}}/g, opts.decimals.toString())
             .replace(/{{INITIAL_SUPPLY}}/g, opts.supply.toString());
}

const outDir = path.resolve(opts.out);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${className}.sol`);
fs.writeFileSync(outPath, tmpl, 'utf8');

console.log(`✅ Contract with BURN functionality written to ${outPath}`);
console.log(`   Class name: ${className}`);
console.log(`   Token name: ${opts.name}`);
console.log(`   Symbol: ${opts.symbol}`);
console.log(`   Features: Mintable, Burnable, Ownable`);
if (opts.template === 'fixed') {
  console.log(`   Initial supply: ${opts.supply} tokens (18 decimals)`);
} else {
  console.log(`   Decimals: ${opts.decimals}`);
  console.log(`   Initial supply: ${opts.supply} tokens`);
}
