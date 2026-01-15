#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { format } from './formatter/formatter';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Usage: dbml-fmt <file>');
    process.exit(1);
}

const filePath = args[0];
const absPath = path.resolve(process.cwd(), filePath);

if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
}

try {
    const content = fs.readFileSync(absPath, 'utf-8');
    const formatted = format(content);
    console.log(formatted);
} catch (error) {
    console.error('Error formatting file:', error);
    process.exit(1);
}
