import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ensureDir = (subpath) => path.join(path.resolve(__dirname, subpath), "");

const alias = [
  { find: /^@app\//, replacement: ensureDir("src/app") },
  { find: /^@components\//, replacement: ensureDir("src/components") },
  { find: /^@services\//, replacement: ensureDir("src/services") },
  { find: /^@modes\//, replacement: ensureDir("src/modes") },
  { find: /^@hooks\//, replacement: ensureDir("src/hooks") },
  { find: /^@data\//, replacement: ensureDir("src/data") },
  { find: /^@utils\//, replacement: ensureDir("src/utils") },
  { find: /^@domains\//, replacement: ensureDir("src/domains") },
  { find: /^@app$/, replacement: path.resolve(__dirname, "src/app/index.js") },
  { find: /^@components$/, replacement: path.resolve(__dirname, "src/components/index.js") },
  { find: /^@services$/, replacement: path.resolve(__dirname, "src/services/index.js") },
  { find: /^@modes$/, replacement: path.resolve(__dirname, "src/modes/index.js") },
  { find: /^@hooks$/, replacement: path.resolve(__dirname, "src/hooks/index.js") },
  { find: /^@data$/, replacement: path.resolve(__dirname, "src/data/index.js") },
  { find: /^@utils$/, replacement: path.resolve(__dirname, "src/utils/index.js") },
  { find: /^@domains$/, replacement: path.resolve(__dirname, "src/domains") },
];

export default alias;
export { alias };

