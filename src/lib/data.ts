export const fetchUsers = (query: string) => {
  return fetch(
    `https://dummyjson.com/users${query ? `/search?q=${query}` : ``}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((json) => {
      const users = json.users.map((user: { id: any }) => ({
        ...user,
        key: user.id,
      }));
      return users;
    })
    .catch((error) => console.log("Error:", error));
};
