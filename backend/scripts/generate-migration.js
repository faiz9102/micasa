import { execSync } from "child_process";

// Read --name= manually
const arg =
  process.argv.find(a => a.startsWith("--name=")) ||
  process.argv[2];

const name = arg?.includes("=") ? arg.split("=")[1] : arg;
const formattedName = name.replace(/\s+/g, "-").toLowerCase();

if (!name) {
  console.error("❌ Please provide a migration name using --name=...");
  process.exit(1);
}

const command = `typeorm migration:generate ./migrations/${formattedName} -d src/configs/data-source.js --outputJs --esm -p`;

execSync(command, { stdio: "inherit" });