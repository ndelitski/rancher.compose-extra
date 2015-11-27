import {extender, interpolator} from './transformers';
import fs from "fs";
import path from "path";

export default async function processFile({filePath}) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`file ${filePath} does not exists`);
    }

    let content = fs.readFileSync(filePath, 'utf8');
    for (let fn of [extender, envInterpolator]) {
        content = await fn({content, filePath});
    }
    return content;
}

async function envInterpolator({content, filePath}) {
    return await interpolator(content, process.env, {strict: false});
}
