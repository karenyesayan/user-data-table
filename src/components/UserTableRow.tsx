import type { DataType } from "../lib/definitions";

// @ts-ignore
export default function UserTableRow({ phone, ...rest }: DataType) {
  return <p style={{ margin: 0 }}>{phone}</p>;
}
