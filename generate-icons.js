const fs = require('fs');

const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <rect width="192" height="192" rx="40" fill="#5b4fcf"/>
  <text x="96" y="130" font-size="100" text-anchor="middle">🤖</text>
</svg>`;

const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="100" fill="#5b4fcf"/>
  <text x="256" y="340" font-size="260" text-anchor="middle">🤖</text>
</svg>`;

fs.writeFileSync('icon-192.svg', svg192);
fs.writeFileSync('icon-512.svg', svg512);
console.log('done');
