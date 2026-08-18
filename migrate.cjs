const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.tsx') && !file.startsWith('_')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // If it already imports from '@/pages/', skip it
      if (content.includes('@/pages/')) continue;
      
      // Try to find the component function
      const funcMatch = content.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
      if (!funcMatch) continue;
      
      const compName = funcMatch[1];
      
      // The page name without Page, e.g. 'DispositifsPage' -> 'Dispositifs'
      let pageDirName = compName.replace(/Page$/, '');
      if (pageDirName === '') pageDirName = 'Home'; // Fallback
      
      // We will create the page in src/pages/[pageDirName]/[compName].tsx
      const targetPageDir = path.join(__dirname, 'src', 'pages', pageDirName);
      if (!fs.existsSync(targetPageDir)) fs.mkdirSync(targetPageDir, { recursive: true });
      
      const targetPageFile = path.join(targetPageDir, `${compName}.tsx`);
      
      // Extract everything from 'function ...' onwards
      const funcIndex = content.indexOf(`function ${compName}`);
      let pageContent = content.substring(funcIndex);
      pageContent = `export ${pageContent}`;
      
      // Imports needed by the page component (usually none for the stubs, but let's copy react if needed)
      // Actually, these stubs just use standard HTML
      fs.writeFileSync(targetPageFile, pageContent);
      
      // Now rewrite the route file
      const relativeRoute = fullPath.replace(path.join(__dirname, 'src', 'routes'), '');
      // E.g. /_authenticated/_agent/dispositifs.tsx
      const routeString = relativeRoute.replace(/\.tsx$/, '').replace(/\/index$/, '/');
      
      const newRouteContent = `import { createFileRoute } from '@tanstack/react-router'
import { ${compName} } from '@/pages/${pageDirName}/${compName}'

export const Route = createFileRoute('${routeString}')({
  component: ${compName},
})
`;
      fs.writeFileSync(fullPath, newRouteContent);
      console.log(`Migrated ${fullPath} -> src/pages/${pageDirName}/${compName}.tsx`);
    }
  }
}

processDir(path.join(__dirname, 'src', 'routes', '_authenticated', '_agent'));
