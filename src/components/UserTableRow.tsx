import { useState, useEffect } from "react";

export default function UserTableRow({ id }: { id: number }) {
  const [userData, setUserData] = useState({ phone: 0 });

  useEffect(() => {
    fetch(`https://dummyjson.com/users/${id}`)
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, []);

  return <p style={{ margin: 0 }}>{userData.phone}</p>;
}
