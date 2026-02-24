import fs from "node:fs";
import path from "node:path";
import { getTheme, repositoryDir } from "./theme";

const zedIconTheme = await getTheme();

const zedManifest = {
  $schema: "https://zed.dev/schema/icon_themes/v0.3.0.json",
  name: "Symbols Icon Theme",
  author: "Zed Industries",
  themes: [zedIconTheme],
};

const iconThemesDir = path.join(import.meta.dirname, "../icon_themes");

if (!fs.existsSync(iconThemesDir)) {
  fs.mkdirSync(iconThemesDir, { recursive: true });
}

fs.writeFileSync(
  path.join(iconThemesDir, "symbols-icon-theme.json"),
  JSON.stringify(zedManifest, null, 2),
);

const syncIcons = (sourceDir: string, destDir: string) => {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Icon source directory is missing: ${sourceDir}`);
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const sourceFiles = new Set(fs.readdirSync(sourceDir));

  fs.readdirSync(destDir).forEach((file) => {
    if (!sourceFiles.has(file)) {
      fs.rmSync(path.join(destDir, file));
    }
  });

  sourceFiles.forEach((file) => {
    const sourceFile = path.join(sourceDir, file);
    const destFile = path.join(destDir, file);
    fs.copyFileSync(sourceFile, destFile);
  });
};

// Copy icons from repo to the icons directory
syncIcons(
  path.join(repositoryDir, "./src/icons/files"),
  path.join(import.meta.dirname, "../icons/files"),
);

syncIcons(
  path.join(repositoryDir, "./src/icons/folders"),
  path.join(import.meta.dirname, "../icons/folders"),
);
console.log("Symbols Icon Theme generated successfully.");
