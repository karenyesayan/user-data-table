import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Space } from "antd";
import UserTableRow from "./components/UserTableRow";
import { fetchUsers } from "./redux/thunks/usersThunk";
import {
  usersSelector,
  usersTotalSelector,
  usersLoadingSelector,
} from "./redux/slices/usersSlice";
import { useAppDispatch } from "./hooks/useAppDispatch";
import type { TableColumnsType, TableProps, GetProps } from "antd";
import type { DataType } from "./lib/definitions";
import "./App.css";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const filter: string[] = JSON.parse(
  localStorage.getItem("default-filters") || "[]"
);

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
    defaultFilteredValue: filter,
  },
];

export default function App() {
  const dispatch = useAppDispatch();
  const users = useSelector(usersSelector);
  const total = useSelector(usersTotalSelector);
  const loading = useSelector(usersLoadingSelector);

  const [query, setQuery] = useState(() =>
    filter[0]
      ? `/filter?key=role&value=${filter[0]}&limit=10&skip=0`
      : `?limit=10&skip=${
          (JSON.parse(localStorage.getItem("current-page") || "1") - 1) * 10
        }`
  );

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log(sorter);
    const { role } = filters;
    const { current = 1 } = pagination;
    const calcOffset = (current - 1) * 10;

    switch (extra.action) {
      case query.startsWith("/search") && "paginate": {
        localStorage.setItem("current-page", JSON.stringify(current));
        return setQuery((q) => q.replace(/(skip)=\d+/, `skip=${calcOffset}`));
      }
      case role?.length && role && "paginate": {
        localStorage.setItem("current-page", JSON.stringify(current));
        return setQuery(
          `/filter?key=role&value=${
            role && role[0]
          }&limit=10&skip=${calcOffset}`
        );
      }
      case "paginate": {
        localStorage.setItem("current-page", JSON.stringify(current));
        return setQuery(`?limit=10&skip=${calcOffset}`);
      }
      case role !== null && "filter": {
        localStorage.setItem(
          "default-filters",
          JSON.stringify(filters.role || [])
        );
        return setQuery(
          `/filter?key=role&value=${
            role && role[0]
          }&limit=10&skip=${calcOffset}`
        );
      }
      case "filter": {
        localStorage.setItem(
          "default-filters",
          JSON.stringify(filters.role || [])
        );
        localStorage.setItem("current-page", JSON.stringify(1));
        return setQuery(`?limit=10&skip=${calcOffset}`);
      }
    }
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
          expandedRowRender: (record) => <UserTableRow id={record.id} />,
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
