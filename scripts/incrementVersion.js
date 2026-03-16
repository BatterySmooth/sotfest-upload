import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Read package.json version
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const typeArgIndex = process.argv.findIndex(arg => ["major", "minor", "patch"].includes(arg));
const type = typeArgIndex !== -1 ? process.argv[typeArgIndex] : "patch";

const [major, minor, patch] = pkg.version.split(".").map(Number);

let newVersion;
switch (type) {
  case "major":
    newVersion = `${major + 1}.0.0`;
    break;
  case "minor":
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case "patch":
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

pkg.version = newVersion;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`Version bumped to: ${newVersion}`);