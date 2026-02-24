# Symbols

A file icon theme for Zed sourced from
[vscode-symbols](https://github.com/miguelsolorio/vscode-symbols).

## Source Repository

This project reads data from a local `vscode-symbols` clone by default:

- Default path: `../vscode-symbols` (relative to this repository)
- Override path: set `SYMBOLS_VSCODE_DIR=/absolute/path/to/vscode-symbols`
- Preferred input file: `vscode-symbols/src/symbol-icon-theme.modified.json`
- Fallback input file: `vscode-symbols/src/symbol-icon-theme.json`

## Custom Mappings

Custom mappings are managed in the workspace root:

- `../custom-mappings.json`

Those mappings are applied to
`vscode-symbols/src/symbol-icon-theme.modified.json` before build.

Supported mapping groups:

- `fileExtensions`
- `fileNames`
- `folderNames`
- `folderNamesExpanded`

Use icon keys from `vscode-symbols/src/symbol-icon-theme.json`.

## Update Workflow

Run from the workspace root (`../`):

```bash
pnpm run workspace:sync
```

Or run only the zed build pipeline (apply mappings + build):

```bash
pnpm run zed:build
```

## License

Icons remain under the original
[vscode-symbols license](https://github.com/miguelsolorio/vscode-symbols/blob/main/LICENSE).
