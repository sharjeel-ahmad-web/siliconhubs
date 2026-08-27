const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'src', 'app', 'api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(apiDir, filePath);
  
  // Fix old params pattern for Next.js 16
  // Match: { params }: { params: { id: string } }
  const oldPattern = /\{\s*params\s*\}:\s*\{\s*params:\s*\{\s*([^}]+)\s*\}\s*\}/g;
  
  if (oldPattern.test(content)) {
    content = content.replace(oldPattern, (match, inner) => {
      return `{ params }: { params: Promise<{ ${inner} }> }`;
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${relativePath}`);
    return true;
  }
  return false;
}

function walkDir(dir) {
  let fixed = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixed += walkDir(fullPath);
    } else if (entry.name === 'route.ts') {
      if (fixFile(fullPath)) fixed++;
    }
  }
  
  return fixed;
}

console.log('Fixing remaining API route params for Next.js 16...');
const totalFixed = walkDir(apiDir);
console.log(`\nFixed ${totalFixed} files.`);
