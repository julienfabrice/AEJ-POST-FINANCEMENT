const fs = require('fs');
const html = fs.readFileSync('maquette/aej-demo.html', 'utf8');
const match = html.match(/const LOGO_WM = '([^']+)'/);
if (match) {
  const b64 = match[1];
  let imgTs = fs.readFileSync('src/constants/images.ts', 'utf8');
  imgTs = `export const IMAGES = {
  logo: "data:image/png;base64,${b64}"
}
`;
  fs.writeFileSync('src/constants/images.ts', imgTs);
  console.log("Updated IMAGES.logo with base64 from mockup");
}
