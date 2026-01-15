import { tokenize, TokenType } from './formatter/tokenizer';
import * as fs from 'fs';
import * as path from 'path';

const samplePath = path.join(__dirname, '../sample.dbml');
const content = fs.readFileSync(samplePath, 'utf-8');

const tokens = tokenize(content);

console.log('Tokens:');
tokens.forEach(t => {
    let typeName = TokenType[t.type];
    console.log(`[${typeName}] ${JSON.stringify(t.value)}`);
});
