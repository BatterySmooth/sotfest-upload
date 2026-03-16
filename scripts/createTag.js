import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// Read package.json version
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const version = pkg.version;

// Create Git tag
try {
  execSync(`git tag v${version}`, { stdio: 'inherit' });
  console.log(`Created Git tag v${version}`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}