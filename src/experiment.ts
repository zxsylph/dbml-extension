import { importer, exporter } from '@dbml/core';
import * as fs from 'fs';
import * as path from 'path';

const samplePath = path.join(__dirname, '../sample.dbml');
const content = fs.readFileSync(samplePath, 'utf-8');

console.log('Original Content:');
console.log(content);

try {
    const imported = importer.import(content, 'dbml');
    console.log('Imported (Intermediate Model):');
    // console.log(imported); // It might be large

    const exported = exporter.export(imported, 'dbml');
    console.log('Exported (Formatted Content):');
    console.log(exported);
} catch (err) {
    console.error('Error:', err);
}
