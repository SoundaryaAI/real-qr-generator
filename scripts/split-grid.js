const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

async function main() {
  const [, , inputPath, columnsArg, rowsArg, outputDirectoryArg] = process.argv;
  const columns = Number(columnsArg);
  const rows = Number(rowsArg);

  if (!inputPath || !Number.isInteger(columns) || columns < 1 || !Number.isInteger(rows) || rows < 1) {
    console.error("Usage: node scripts/split-grid.js <image-path> <columns> <rows> [output-directory]");
    process.exitCode = 1;
    return;
  }

  // Sharp reads the image metadata without loading the whole image into memory.
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Could not detect the image width and height.");
  }

  // Calculate each cell size. The final row/column receives any leftover pixels.
  const cellWidth = Math.floor(metadata.width / columns);
  const cellHeight = Math.floor(metadata.height / rows);
  // An optional output directory prevents different source sheets from
  // overwriting each other's frame-1.png, frame-2.png, and so on.
  const outputDirectory = path.resolve(outputDirectoryArg || "src/assets/frames");
  await fs.mkdir(outputDirectory, { recursive: true });

  console.log(`Source: ${metadata.width}x${metadata.height}`);
  console.log(`Grid: ${columns} columns by ${rows} rows`);

  let frameNumber = 1;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const left = column * cellWidth;
      const top = row * cellHeight;
      const width = column === columns - 1 ? metadata.width - left : cellWidth;
      const height = row === rows - 1 ? metadata.height - top : cellHeight;
      const outputPath = path.join(outputDirectory, `frame-${frameNumber}.png`);

      // Extract one rectangle from the source and write that rectangle as PNG.
      // Clone the source pipeline so each crop starts from the original image.
      await image.clone().extract({ left, top, width, height }).png().toFile(outputPath);
      const outputMetadata = await sharp(outputPath).metadata();
      console.log(`frame-${frameNumber}.png: ${outputMetadata.width}x${outputMetadata.height}`);
      frameNumber += 1;
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});