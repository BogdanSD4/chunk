const fs = require('fs');

function transformText(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if (char >= 'A' && char <= 'Z' && i > 0) {
      result += `-${char.toLowerCase()}`;
    } else {
      result += char.toLowerCase();
    }
  }
  return result;
}

fs.readFile('./src/exp.ts', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const importRegex = /import\s+(\w+)\s+from\s+"primevue\/(\w+)";/g;

  let match;
  const imports = []
  const componets = [];

  while ((match = importRegex.exec(data)) !== null) {
    imports.push(match[0]);
    componets.push(match[1])
  }

  let newData = '';
  imports.forEach(i => newData += i + '\n')
  newData += '\nexport const p = {'
  componets.forEach(i => newData += `\n  '${transformText(i)}': ${i},`)
  newData += '\n}'
  
  fs.writeFile('./src/exp.ts', newData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
  });
});