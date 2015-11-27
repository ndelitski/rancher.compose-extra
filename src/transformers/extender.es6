/**
 * Apply service definitions(@-prefixed keys) to yml
 */
import yml from "yamljs";
import yml2 from "js-yaml";
import fs from "fs";
import path from "path";
import {isArray, pairs, omit, uniq} from 'lodash';
import interpolator from './interpolator';

export default async function extender({content, filePath}) {
    // console.log(`extender received ${content}`);
    const parsed = yml.parse(content);

    for (let [service, data] of pairs(parsed)) {
      if (data.extends) {
        const templatePath = path.resolve(path.dirname(filePath), data.extends.file);
        if (!data.extends.file || !data.extends.service) {
          throw new Error(`ExtendError: extend syntax is incorrect - should contain fields 'file' and 'service'`);
        }
        if (!fs.existsSync(templatePath)) {
          throw new Error(`ExtendError: template not found in path ${templatePath}`);
        }
        const template = fs.readFileSync(templatePath, 'utf8');
        const templateParsed = yml.parse(template);
        if (!templateParsed[data.extends.service]) {
          throw new Error(`ExtendError: service '${data.extends.service} not found in ${templatePath}'`);
        }
        parsed[service] = merge({}, templateParsed[data.extends.service], data);
        parsed[service] = JSON.parse(await interpolator(JSON.stringify(parsed[service]), merge({service_name: service}, omit(data.extends, 'file', 'service')), {strict: false}));
        delete parsed[service].extends;
      }
      //walkKeys(data, async (key, value, node, lvl) => {
      //  if (key === 'extends') {
      //    let template = await findServiceDefinitionFile([key.substring(1)]);
      //    //template = interpolator(template, {service_name: service, arg: value});
      //    merge(node, yml.parse(template));
      //    delete node[key];
      //  }
      //});
    }
    return yml2.dump(parsed);
}

// walk object from bottom
async function walkKeys(node, fn, lvl = 0) {
    for (let [key, value] of pairs(node)) {
        if (typeof value == 'object') {
          await walkKeys(value, fn, lvl + 1);
        }
        await fn(key, value, node, lvl);
    }
}


function merge() {
  var argc = arguments.length,
    objects = new Array(argc);

  for (var i = 0; i < argc; i++) {
    objects[i] = arguments[i];
  }

  return objects.reduce(function (dest, other) {
    if (!dest) {
      return other;
    }

    if (typeof(other) !== 'object') {
      return dest;
    }

    for (var key in other) {
      if (other.hasOwnProperty(key)) {
        if (isArray(other[key]) && isArray(dest[key])) {
          Array.prototype.splice.apply(dest[key], [dest[key].length, 0].concat(other[key]));
          dest[key]=uniq(dest[key]);
        } else if (typeof (other[key]) == 'object' && typeof(dest[key]) == 'object') {
          merge(dest[key], other[key]);
        } else {
          if (other[key] !== undefined) {
            dest[key] = other[key];
          }
        }
      }
    }

    return dest;
  })
}
