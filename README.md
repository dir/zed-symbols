# Symbols

A file icon theme for Zed sourced from
[vscode-symbols](https://github.com/miguelsolorio/vscode-symbols).

## Source Repository

This project reads data from a local `vscode-symbols` clone by default:

- Default path: `../vscode-symbols` (relative to this repository)
- Override path: set `SYMBOLS_VSCODE_DIR=/absolute/path/to/vscode-symbols`

## Custom Mappings

Add your persistent custom mappings in `src/custom-mappings.ts`.
They are merged on top of upstream mappings during `npm run build`.

Supported mapping groups:

- `fileExtensions`
- `fileNames`
- `folderNames`
- `folderNamesExpanded`

Use icon keys from `vscode-symbols/src/symbol-icon-theme.json`.

## Update Workflow

1. Sync your local `vscode-symbols` fork with upstream.
2. Rebuild this repository from that updated source.

One command from this repository:

```bash
npm run sync:from-vscode
```

Or run manually:

```bash
cd ../vscode-symbols && npm run sync:upstream
cd ../zed-symbols && npm run build
```

## License

Icons remain under the original
[vscode-symbols license](https://github.com/miguelsolorio/vscode-symbols/blob/main/LICENSE).
