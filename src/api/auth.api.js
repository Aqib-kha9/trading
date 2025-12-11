export const login = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === "admin@masterstroke.com" && credentials.password === "admin123") {
        resolve({
          data: {
            token: "mock-jwt-token-123",
            user: {
              id: 1,
              name: "Admin User",
              email: "admin@masterstroke.com",
              role: "admin"
            }
          }
        });
      } else {
        reject({ response: { data: { message: "Invalid credentials" } } });
      }
    }, 800);
  });
};

export const logout = async () => {
    return new Promise((resolve) => setTimeout(resolve, 300));
};
