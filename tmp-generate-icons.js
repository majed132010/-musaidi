const sharp = require("sharp");
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="40" fill="#5b4fcf"/><text x="96" y="130" font-size="100" text-anchor="middle" font-family="serif">M</text></svg>`);
sharp(svg).resize(192, 192).png().toFile("icon-192.png", () => {});
sharp(svg).resize(512, 512).png().toFile("icon-512.png", () => {});
