import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const rootDir = process.cwd();
const assetsDir = path.join(rootDir, 'src', 'assets');

const files = [
  'pendant-light.png',
  'pendant-dark.png',
  'w-bg.jpg',
  'abc-lux-logo.png',
  'ajmal-roshan-k.png',
  'umer-hayat.png',
];

for (const file of files) {
  const inputPath = path.join(assetsDir, file);
  const outputPath = path.join(assetsDir, file.replace(path.extname(file), '.webp'));

  await sharp(inputPath).webp({ quality: 90 }).toFile(outputPath);
  console.log(`Converted ${file} -> ${path.basename(outputPath)}`);
}
