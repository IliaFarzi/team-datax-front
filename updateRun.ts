import { execSync } from "child_process";

function run(cmd: string) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function safeCatch(error: unknown): void {
  if (error instanceof Error) {
    console.error("❌ :", error.message);
  } else {
    console.error("❌ :", error);
  }
  process.exit(1);
}

try {
  const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
  console.log(`your branch "${branch}" .`);
  if (branch !== "main" && branch !== "master") {
    console.warn(`⚠️ U shuold b on main branch`);
  }
  //commands:
  run("git pull");
  run("npm install");
  run("npm run dev");

} catch (err: unknown) {
  safeCatch(err);
}
