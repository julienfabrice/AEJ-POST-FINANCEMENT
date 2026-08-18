const fs = require('fs');

let d = fs.readFileSync('src/pages/Dashboard/DashboardPage.tsx', 'utf8');
d = d.replace("MoreHorizontal,", "Download, Plus,");
d = d.replace("ArrowRight", "");
d = d.replace("import { DropdownMenu", "// import { DropdownMenu");
fs.writeFileSync('src/pages/Dashboard/DashboardPage.tsx', d);

let j = fs.readFileSync('src/pages/Jeunes/JeunesPage.tsx', 'utf8');
j = j.replace("import { createFileRoute } from '@tanstack/react-router'", "");
fs.writeFileSync('src/pages/Jeunes/JeunesPage.tsx', j);
