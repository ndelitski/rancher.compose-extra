import {extender} from '../src/transformers';
import fs from 'fs';
import path from 'path';

const filesDir = path.join(__dirname, 'files');

describe("extender transformer", () => {
  it("should transform file", async () => {
    const inputPath = path.join(filesDir, 'in-compose.yml');
    const inputFile = fs.readFileSync(inputPath, 'utf8');
    const outputFile = fs.readFileSync(path.join(filesDir, 'out-compose.yml'), 'utf8');
    const result = await extender({content: inputFile, filePath: inputPath});
    console.log(result);
    expect(result).to.eql(outputFile);
  });
});
