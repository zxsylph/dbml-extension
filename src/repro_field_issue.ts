import { format } from './formatter/formatter';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../test_folder/repro_empty_note_field.dbml');
const content = fs.readFileSync(filePath, 'utf-8');

const formatted = format(content);

console.log('--- Formatted Output ---');
console.log(formatted);

// Robust check:
// We just check if the output contains `Note: ""` or `note: ""` for each field name.
// Since the output might be multiline, we can't just filter lines.
// We scan the text.

const requiredFields = ['id', 'username', 'email'];
let allPresent = true;

// Just check globally if we have 3 empty notes + the table note?
// Table note is also `Note: ""`
// So we expect 4 `Note: ""` or `note: ""`
const matches = formatted.match(/Note:\s*""/gi);
const count = matches ? matches.length : 0;

console.log(`Found ${count} empty notes.`);

if (count >= 4) { // 1 for table + 3 for fields
    console.log('SUCCESS: Empty notes added to fields.');
} else {
    console.error('FAILURE: Empty notes NOT added to fields (or not enough).');
    process.exit(1);
}
