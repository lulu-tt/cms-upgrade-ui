import type { ReactNode } from "react";

export interface DataTableColumn<Row> {
  key: keyof Row | string;
  header: string;
  render?: (row: Row) => ReactNode;
}

export interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
}

export function DataTable<Row extends Record<string, ReactNode>>({ columns, rows }: DataTableProps<Row>) {
  return (
    <div className="cms-table-wrap">
      <table className="cms-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={String(column.key)}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
