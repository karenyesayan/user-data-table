import { useState, useEffect } from "react";
import { Table, Input, Space } from "antd";
import { fetchUsers } from "./lib/data";
import type { TableColumnsType, TableProps, GetProps } from "antd";
import type { DataType } from "./lib/definitions";
import "./App.css";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const columns: TableColumnsType<DataType> = [
  {
    title: "FirstName",
    dataIndex: "firstName",
    showSorterTooltip: { target: "full-header" },
    defaultSortOrder: undefined,
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    responsive: ["xs"],
  },
  {
    title: "FirstName",
    dataIndex: "firstName",
    showSorterTooltip: { target: "full-header" },
    defaultSortOrder: undefined,
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    responsive: ["sm"],
  },
  {
    title: "Email",
    dataIndex: "email",
    responsive: ["sm"],
  },
  {
    title: "Role",
    dataIndex: "role",
    filters: [
      {
        text: "admin",
        value: "admin",
      },
      {
        text: "moderator",
        value: "moderator",
      },
      {
        text: "user",
        value: "user",
      },
    ],
    defaultFilteredValue: JSON.parse(
      localStorage.getItem("default-filters") || "[]"
    ),
    onFilter: (value, record) => record.role.indexOf(value as string) === 0,
    responsive: ["sm"],
  },
];

const onChange: TableProps<DataType>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);

  switch (extra.action) {
    case "paginate": {
      return localStorage.setItem(
        "current-page",
        JSON.stringify(pagination.current)
      );
    }
    case "filter": {
      return localStorage.setItem(
        "default-filters",
        JSON.stringify(filters.role || [])
      );
    }
  }
};

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const onSearch: SearchProps["onSearch"] = (value) => setQuery(value);

  useEffect(() => {
    fetchUsers(query).then((users) => setData(users));
  }, [query]);

  return (
    <>
      <Space direction="vertical">
        <Search
          placeholder="input search text"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </Space>
      <Table<DataType>
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.phone}</p>
          ),
          rowExpandable: (record) => record.firstName !== "Not Expandable",
        }}
        pagination={{
          defaultCurrent: JSON.parse(
            localStorage.getItem("current-page") || "1"
          ),
          showLessItems: true,
          hideOnSinglePage: true,
        }}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
}
