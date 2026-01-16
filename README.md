# @zxsylph/dbml-formatter

A powerful and flexible formatter for [DBML (Database Markup Language)](https://dbml.dbdiagram.io/home/) files. This tool helps keep your DBML schemas clean, consistent, and readable by applying standard formatting rules, alignment, and optional enhancements.

## Features

- **Standard Formatting**: Applies consistent spacing and indentation to tables, fields, indexes, and relationships.
- **Alignment**:
  - Automatically aligns field data types for better readability.
  - Aligns field settings (e.g., `[pk, increment]`) for a clean columnar look.
- **Field Sorting** (Optional): Sorts fields within groups alphabetically.
- **Note Management** (Optional): Automatically adds empty notes to fields and tables if they are missing.
- **Batch Processing**: Supports formatting individual files or entire directories recursively.
- **Dry Run**: Preview changes without modifying files.

## Installation

You can use the formatter directly via `npx` without installation:

```bash
npx @zxsylph/dbml-formatter <file-or-options>
```

Or install it globally:

```bash
npm install -g @zxsylph/dbml-formatter
```

## Usage

### Format a Single File

Prints the formatted result to `stdout`.

```bash
npx @zxsylph/dbml-formatter schema.dbml
```

### Format a Directory

Formats all `.dbml` files in the specified directory (and subdirectories) **in place**.

```bash
npx @zxsylph/dbml-formatter --folder ./database
```

### Options & Flags

| Flag              | Description                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| `--folder <path>` | Specifies a directory to recursively find and format `.dbml` files. Updates files in place.    |
| `--dry-run`       | Use with `--folder` to preview formatting changes in the console instead of overwriting files. |
| `--order-field`   | Sorts fields within their logical groups (separated by blank lines) in ascending order.        |
| `--add-note`      | Automatically adds `Note: ''` to tables and fields that don't have one.                        |

### Examples

**1. Basic file formatting (output to console):**

```bash
npx @zxsylph/dbml-formatter schema.dbml > formatted_schema.dbml
```

**2. Format an entire project directory:**

```bash
npx @zxsylph/dbml-formatter --folder ./src/db
```

**3. Format with field sorting and extra notes:**

```bash
npx @zxsylph/dbml-formatter --folder ./src/db --order-field --add-note
```

**4. Preview changes for a folder:**

```bash
npx @zxsylph/dbml-formatter --folder ./src/db --dry-run
```

## Formatting Rules

The formatter applies the following styles:

- **Indentation**: 2 spaces.
- **Spacing**: Removes extra empty lines inside table bodies.
- **Alignment**: Vertically aligns data types and column settings `[...]`.
- **Hoisting**: Moves table-level notes to the top of the table definition.

## License

ISC
