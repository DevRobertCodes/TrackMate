function getUser() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
