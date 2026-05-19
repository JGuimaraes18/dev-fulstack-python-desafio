type Column<T> = {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
}

type TableProps<T> = {
  data: T[]
  columns: Column<T>[]
}

export function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td
                key={colIndex}
                style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
              >
                {typeof col.accessor === "function"
                  ? col.accessor(row)
                  : (row[col.accessor] as React.ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}