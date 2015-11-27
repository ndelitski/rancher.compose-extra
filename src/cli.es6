import processFileAsync from './process-file';
import assert from 'assert';

const yamlFile = process.argv[2];
console.log(yamlFile);

(async () => {
    console.log(await processFileAsync({filePath: yamlFile}));
})().then(()=> {
}, (err) => {
    console.error(err);
    console.error(err.stack);
    process.exit(1);
});
