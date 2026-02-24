import fs from "node:fs";
import path from "node:path";
import type { IconTheme } from "./types/icon-theme";
import type { VSCodeIconTheme } from "./types/vscode-icon-theme";

const keyMapping: { [key: string]: string } = {
  git: "vcs",
  console: "terminal",
  code: "json",
  coffeescript: "coffee",
  default: "file",
  storage: "database",
  template: "templ",
};

const baseDir = path.join(import.meta.dirname, "../");
const defaultRepositoryDir = path.resolve(baseDir, "../vscode-symbols");
const repositoryDirFromEnv = process.env.SYMBOLS_VSCODE_DIR;

const resolveRepositoryDir = () => {
  const resolvedDir = repositoryDirFromEnv
    ? path.resolve(repositoryDirFromEnv)
    : defaultRepositoryDir;
  const themePath = path.join(resolvedDir, "./src/symbol-icon-theme.json");

  if (!fs.existsSync(themePath)) {
    throw new Error(
      `Cannot find vscode-symbols source theme at ${themePath}.` +
        " Clone your vscode-symbols fork next to zed-symbols or set SYMBOLS_VSCODE_DIR.",
    );
  }

  return resolvedDir;
};

const toZedIconKey = (iconKey: string): string =>
  keyMapping[iconKey] || iconKey;

const resolveThemePath = (repoDir: string): string => {
  const modifiedThemePath = path.join(
    repoDir,
    "./src/symbol-icon-theme.modified.json",
  );
  const defaultThemePath = path.join(repoDir, "./src/symbol-icon-theme.json");

  if (fs.existsSync(modifiedThemePath)) {
    return modifiedThemePath;
  }

  if (fs.existsSync(defaultThemePath)) {
    return defaultThemePath;
  }

  throw new Error(
    `Cannot find a vscode-symbols theme file in ${repoDir}.` +
      " Expected src/symbol-icon-theme.modified.json or src/symbol-icon-theme.json.",
  );
};

export const repositoryDir = resolveRepositoryDir();
export const repositoryThemePath = resolveThemePath(repositoryDir);

export const getTheme = async (): Promise<IconTheme> => {
  const data = fs.readFileSync(repositoryThemePath, "utf-8");
  const symbolsIconTheme = JSON.parse(data) as VSCodeIconTheme;

  const transformedIconDefinitions = Object.fromEntries(
    Object.entries(symbolsIconTheme.iconDefinitions ?? {})
      .filter(([key]) => !key.startsWith("folder"))
      .map(([key, value]) => [
        toZedIconKey(key), // Apply key renaming if a mapping exists
        {
          path: value.iconPath,
        },
      ]),
  );

  const folderIconDefinitions = Object.fromEntries(
    Object.entries(symbolsIconTheme.iconDefinitions ?? {})
      .filter(([key]) => key.startsWith("folder"))
      .map(([key, value]) => [
        key,
        {
          iconPath: value.iconPath,
        },
      ]),
  );
  /**
   * Transform fileNames object to be case-insensitive
   * This is necessary because ZED's API is case-sensitive but the manifest is not
   */
  const transformedFileNames = Object.entries(
    symbolsIconTheme.fileNames ?? {},
  ).reduce(
    (acc, [key, value]) => {
      const normalizedValue = toZedIconKey(value);
      acc[key.toLowerCase()] = normalizedValue;
      acc[key.toUpperCase()] = normalizedValue;
      return acc;
    },
    {} as { [key: string]: string },
  );

  const transformedFileExtensions = Object.fromEntries(
    Object.entries(symbolsIconTheme.fileExtensions ?? {}).map(
      ([key, value]) => [key, toZedIconKey(value)],
    ),
  );

  const named_directory_icons: IconTheme["named_directory_icons"] = {};

  // Process folder name mappings from the manifest
  Object.entries(symbolsIconTheme.folderNames ?? {}).forEach(
    ([folderName, iconKey]) => {
      const collapsedIcon = folderIconDefinitions[iconKey];
      const expandedIconKey =
        symbolsIconTheme.folderNamesExpanded?.[folderName];
      const expandedIcon = expandedIconKey
        ? folderIconDefinitions[expandedIconKey]
        : collapsedIcon;

      if (collapsedIcon) {
        const variations = [
          folderName,
          `.${folderName}`,
          `_${folderName}`,
          `__${folderName}__`,
        ];

        const iconPaths = {
          collapsed: collapsedIcon.iconPath,
          expanded: expandedIcon?.iconPath || collapsedIcon.iconPath,
        };

        variations.forEach((variation) => {
          named_directory_icons[variation] = iconPaths;
        });
      }
    },
  );

  return {
    name: "Symbols Icon Theme",
    appearance: "dark",
    file_icons: transformedIconDefinitions,
    directory_icons: {
      collapsed: "./icons/folders/folder.svg",
      expanded: "./icons/folders/folder-open.svg",
    },
    named_directory_icons,
    file_suffixes: transformedFileExtensions,
    file_stems: transformedFileNames,
  };
};
