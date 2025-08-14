import { execSync } from "child_process";

function run(cmd: string) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

try {
  // گرفتن آخرین تغییرات از گیت
  run("git pull");

  // نصب/آپدیت پکیج‌ها
  run("npm install");

  // اجرای پروژه در حالت dev
  run("npm run dev");
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error("❌ خطایی رخ داد:", error.message);
  } else {
    console.error("❌ خطای ناشناخته:", error);
  }
  process.exit(1);
}
