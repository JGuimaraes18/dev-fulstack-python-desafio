export function setAuth(data: {
  access: string;
  refresh: string;
  user: any;
}) {
  localStorage.setItem("token", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("user", JSON.stringify(data.user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRefresh() {
  return localStorage.getItem("refresh");
}

export function getUser() {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export function logout() {
  localStorage.clear();
}

export function isAdmin() {
  const user = getUser();
  return user?.groups?.includes("ADMIN");
}

export function isSeller() {
  const user = getUser();
  return user?.groups?.includes("SELLER");
}