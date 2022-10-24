import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import "./InfoTable.css";
import * as FaIcons from "react-icons/fa";

const InfoTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: data }, useSortBy);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span className="sortBtn">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <FaIcons.FaSortDown />
                    ) : (
                      <FaIcons.FaSortUp />
                    )
                  ) : (
                    <FaIcons.FaSort />
                  )}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default InfoTable;
