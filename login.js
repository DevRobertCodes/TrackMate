// 📄 login.js — Handles user login
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.username === username.value.trim() && u.password === password.value);

    if (!username.value.trim() || !password.value) {
      alert("Please enter both username and password.");
      return;
    }

    if (found) {
      localStorage.setItem("currentUser", JSON.stringify(found));
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid username or password.");
    }
  });
  
    // Show/hide password toggle
    document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const passwordField = document.getElementById(targetId);
      if (!passwordField) return;

      const isPassword = passwordField.type === "password";
      passwordField.type = isPassword ? "text" : "password";

      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  });
});
