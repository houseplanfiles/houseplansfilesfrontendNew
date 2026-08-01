const fs = require('fs');
const path = require('path');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = findFiles('src/components');
// Also check src/app just in case
findFiles('src/app', allFiles);

let fixedCount = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Regex to check if "use client" or 'use client' is in the file but not at the very top (ignoring leading whitespace/comments)
  // Actually, a simpler way is: if file contains '"use client";' or "'use client';" 
  // Let's just find the exact string and if it's after imports, move it to the top.
  
  const clientRegex = /^(['"]use client['"];?)/m;
  const match = content.match(clientRegex);
  
  if (match) {
    const index = match.index;
    // Check if there are any imports before it
    const beforeClient = content.substring(0, index);
    if (beforeClient.includes('import ')) {
      // It has imports before "use client"
      // Remove the "use client" from its current location
      content = content.replace(clientRegex, '');
      // Add it to the very top
      content = '"use client";\n' + content.trimStart();
      fs.writeFileSync(file, content);
      console.log('Fixed:', file);
      fixedCount++;
    }
  }
}

console.log(`Fixed ${fixedCount} files`);
