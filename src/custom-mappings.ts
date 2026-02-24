import type { VSCodeIconTheme } from "./types/vscode-icon-theme";

type CustomMappings = Pick<
  VSCodeIconTheme,
  "fileExtensions" | "fileNames" | "folderNames" | "folderNamesExpanded"
>;

export const customMappings: CustomMappings = {
  fileExtensions: {
    // "tfvars": "terraform",
  },
  fileNames: {
    // "Brewfile": "homebrew",
  },
  folderNames: {
    // "infra": "folder-assets",
  },
  folderNamesExpanded: {
    // "infra": "folder-assets",
  },
};
