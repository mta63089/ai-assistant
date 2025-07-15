// scripts/lint-staged.mjs
import { execSync } from "node:child_process";

const files = process.argv.slice(2);

const groups = files.reduce((acc, file) => {
  const workspace = file.split("/").slice(0, 2).join("/");
  acc[workspace] ||= [];
  acc[workspace].push(file);
  return acc;
}, {});

for (const workspace in groups) {
  try {
    execSync(
      `pnpm --filter ${workspace} exec eslint --fix ${groups[workspace].join(" ")}`,
      { stdio: "inherit" }
    );
  } catch {
    process.exit(1);
  }
}
