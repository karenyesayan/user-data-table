import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchUsers } from "./redux/thunks/usersThunk";
import {
  usersSelector,
  usersTotalSelector,
  usersLoadingSelector,
} from "./redux/slices/usersSlice";
import { Table, Input, Space } from "antd";
import UserTableRow from "./components/UserTableRow";
import { useAppDispatch } from "./hooks/useAppDispatch";
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
    filterMultiple: false,
    defaultFilteredValue: JSON.parse(
      localStorage.getItem("default-filters") || "[]"
    ),
  },
];

const getQueryParams = () => {
  const queryParams = localStorage.getItem("query-params");
  return queryParams && !queryParams.startsWith("/search")
    ? queryParams
    : "?limit=10&skip=0";
};

export default function App() {
  const dispatch = useAppDispatch();
  const users = useSelector(usersSelector);
  const total = useSelector(usersTotalSelector);
  const loading = useSelector(usersLoadingSelector);
  const [query, setQuery] = useState(() => getQueryParams());

  const onChange: TableProps<DataType>["onChange"] = (
    { current = 1 },
    { role },
    _sorter,
    { action }
  ) => {
    const skip = (current - 1) * 10;
    let params;

    if (action === "filter") {
      params = `${
        role && role[0] ? `/filter?key=role&value=${role[0]}&` : "?"
      }limit=10&skip=${role && role[0] ? skip : 0}`;
      localStorage.setItem("default-filters", JSON.stringify(role || []));
    } else {
      params = query.replace(/(skip)=\d+/, `skip=${skip}`);
    }

    setQuery(params);
    localStorage.setItem("query-params", params);
    localStorage.setItem("current-page", JSON.stringify(current));
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    localStorage.setItem("current-page", JSON.stringify(1));
    setQuery(`/search?q=${value}&limit=10&skip=0`);
  };

  useEffect(() => {
    dispatch(fetchUsers(query));
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
          onClear={() => {
            localStorage.setItem("current-page", JSON.stringify(1));
            setQuery("?limit=10&skip=0");
          }}
        />
      </Space>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.id}
        expandable={{
          expandedRowRender: (record) => <UserTableRow {...record} />,
          rowExpandable: (record) => record.firstName !== "Not Expandable",
        }}
        pagination={{
          current: JSON.parse(localStorage.getItem("current-page") || "1"),
          defaultCurrent: JSON.parse(
            localStorage.getItem("current-page") || "1"
          ),
          hideOnSinglePage: true,
          total: total,
          showSizeChanger: false,
        }}
        dataSource={users}
        loading={loading}
        onChange={onChange}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
}
