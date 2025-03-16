import { useState, useEffect } from "react";
import { Table, Input, Space } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import type { GetProps } from "antd";
import "./App.css";

interface DataType {
  id: React.Key;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  ip: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
}

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const columns: TableColumnsType<DataType> = [
  {
    title: "FirstName",
    dataIndex: "firstName",
    showSorterTooltip: { target: "full-header" },
    defaultSortOrder: undefined,
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
  },
  {
    title: "Email",
    dataIndex: "email",
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

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    // console.log(info?.source, value);
    setQuery(value);
  };

  useEffect(() => {
    let url = "https://dummyjson.com/users";

    if (query) {
      url = url + `/search?q=${query}`;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => setData(json.users))
      .catch((error) => console.log("Error:", error));
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
        rowKey={(record) => record.id}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.phone}</p>
          ),
          rowExpandable: (record) => record.firstName !== "Not Expandable",
        }}
        pagination={{
          // pageSize: 10,
          defaultCurrent: JSON.parse(
            localStorage.getItem("current-page") || "1"
          ),
          showLessItems: true,
        }}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
}
