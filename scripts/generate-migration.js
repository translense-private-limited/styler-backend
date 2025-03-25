const { execSync } = require("child_process");

const args = process.argv.slice(2);
const migrationName = args[0] ? `db/migrations/${args[0]}` : `db/migrations/auto_migration_${Date.now()}`;

const command = `npm run typeorm -- migration:generate ${migrationName}`;

console.log(`Running: ${command}`);
execSync(command, { stdio: "inherit" });
