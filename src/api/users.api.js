import usersData from '../mock/users.json';

export const fetchUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: usersData });
    }, 600);
  });
};

export const fetchUserById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = usersData.find(u => u.id === parseInt(id));
      if (user) resolve({ data: user });
      else reject({ message: "User not found" });
    }, 400);
  });
};

export const updateUser = async (id, data) => {
    // In a real mock with server, we would update state. For static json imports, we just return success.
    return new Promise((resolve) => setTimeout(() => resolve({ data: { ...data, id } }), 500));
};
