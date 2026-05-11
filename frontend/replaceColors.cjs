const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const srcPath = path.join(__dirname, 'src');
const files = walk(srcPath);

let updatedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const initialContent = content;
  
  // Replace dark:text-indigo-400 -> dark:text-emerald-400
  // and dark:bg-indigo-900/30 -> dark:bg-emerald-900/30
  content = content.replace(/dark:([^'"\s]+?)indigo-/g, 'dark:$1emerald-');
  content = content.replace(/dark:([^'"\s]+?)purple-/g, 'dark:$1teal-');
  
  if (content !== initialContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + path.basename(file));
    updatedCount++;
  }
});
console.log(`Done. Updated ${updatedCount} files.`);
