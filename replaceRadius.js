const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update form fields and buttons to M3 roundedness
      // M3 Buttons and dialogs typically use rounded-full (for buttons) or rounded-3xl (for cards/dialogs)
      content = content.replace(/rounded-xl/g, 'rounded-full');
      content = content.replace(/rounded-2xl/g, 'rounded-3xl');
      
      // M3 Typography tweaks
      // Usually font-medium or font-semibold, not font-black for standard text
      content = content.replace(/font-black/g, 'font-bold');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('src');
console.log('Radii replaced');
