const crypto = require("crypto");
const fs = require("fs");

function calculateBlocks(data) {
  const blockSize = 1024;
  const blocks = Math.ceil(data.length / blockSize);
  const blocksArray = [];
  let currentBlocksSize = 0;
  let j = 0;

  for (let i = 0; i < blocks; i++) {
    let block = [];
    for (j = 0; j < blockSize; j++) {
      if (data[currentBlocksSize + j] !== undefined) {
        block.push(data[currentBlocksSize + j]);
      }
    }
    currentBlocksSize += j;
    blocksArray.push(block);
  }

  return blocksArray;
}

function calculateHash(block) {
  // The "data" argument must be of type string or an instance of Buffer or Uint8Array
  const bufferedBlock = new Uint8Array(block);
  const hash = crypto.createHash("sha256").update(bufferedBlock);

  return hash;
}

function calculateH0(blocks) {
  const reversedBlocks = blocks.reverse();

  const hashBlocks = [];
  // CONSOLE ERROR: The "list[0]" argument must be an instance of Buffer or Uint8Array. Received an instance of Hash
  hashBlocks.push(calculateHash(reversedBlocks[0]));

  for (let i = 1; i < reversedBlocks.length; i++) {
    const bufferedBlock = new Uint8Array(reversedBlocks[i]);
    const nextBlock = Int8Array.from([
      ...bufferedBlock,
      ...hashBlocks[i - 1].digest(),
    ]);

    hashBlocks.push(calculateHash(nextBlock));
  }

  const H0 = hashBlocks[hashBlocks.length - 1].digest("hex");
  return H0;
}

function run() {
  const args = process.argv.slice(2);
  const fileName = args[0] || "FuncoesResumo-SHA1.mp4";
  const data = fs.readFileSync(`./src/videos/${fileName}`);
  const blocks = calculateBlocks(data);

  console.log(
    `The hex encoded h0 for the video FuncoesResumo - SHA1.mp4 is: ${calculateH0(
      blocks
    )}`
  );
}

run();
