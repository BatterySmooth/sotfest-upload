import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// Read the current package.json version
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const version = pkg.version;

// Commit build version
try {
  execSync('git add package.json', { stdio: 'inherit' });
  execSync(`git commit -m "Build v${version}"`, { stdio: 'inherit' });
  console.log(`Committed package.json with message: Build v${version}`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}