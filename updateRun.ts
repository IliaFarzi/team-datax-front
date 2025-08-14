import { execSync } from "child_process";

function run(cmd: string) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function safeCatch(error: unknown): void {
  if (error instanceof Error) {
    console.error("❌ خطایی رخ داد:", error.message);
  } else {
    console.error("❌ خطای ناشناخته:", error);
  }
  process.exit(1);
}

try {
  // بررسی branch فعلی
  const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
  console.log(`در حال حاضر روی branch "${branch}" هستید.`);
  if (branch !== "main" && branch !== "master") {
    console.warn(`⚠️ توصیه می‌شه روی branch اصلی (main یا master) باشید.`);
  }

  // گرفتن آخرین تغییرات
  run("git pull");

  // نصب/آپدیت پکیج‌ها
  run("npm install");

  // اجرای پروژه در حالت توسعه
  run("npm run dev");

} catch (err: unknown) {
  safeCatch(err);
}
