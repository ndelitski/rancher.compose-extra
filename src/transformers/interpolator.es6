/**
 * Resolve variables (`${var} syntax`) within text file
 */

export default async function interpolator(text, context, {strict = false}) {
    const re =  /(?:[^$])\$\{([\d\w\._-]+)\}/g;
    const matches = [];
    let m;

    while (m = re.exec(text)) {
      m.value = eval(`var data=${JSON.stringify(context)}; data.${m[1]}`);
      if (!m.value) {
        if (strict) {
          console.error(`cannot resolve value for `, m);
          throw new Error(`unresolved variable ${m[1]}`)
        }
        // else skip this match in non-strict mode
      } else {
        matches.push(m);
      }
    }

    let di = 0;
    for(m of matches) {
      text = text.replace('${'+ m[1] + '}', m.value);
      //console.log(m);
      //m.index+=di;
      //text = replaceRange(text, m.index, m.index + m[1].length + 3, m.value);
      //di = m.value.length - m[1].length - 3
    }

    return text;
}

function replaceRange(input, startIndex, endIndex, str) {
  return input.substring(0, startIndex) + str + input.substring(endIndex)
}
