// 📄 reset.js — Handles password reset

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const username = document.getElementById("reset-username");
  const question = document.getElementById("security-question");
  const answer = document.getElementById("security-answer");
  const newPassword = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(user =>
      user.username === username.value.trim() &&
      user.recoveryQuestion === question.value.trim() &&
      user.recoveryAnswer === answer.value.trim()
    );

    if (!username.value.trim() || !question.value.trim() || !answer.value.trim() || !newPassword.value || !confirmPassword.value) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      alert("Passwords do not match.");
      return;
    }

    if (index === -1) {
      alert("User not found or recovery info incorrect.");
      return;
    }

    if (users[index].password === newPassword.value) {
      alert("New password must differ from the old one.");
      return;
    }

    users[index].password = newPassword.value;
    localStorage.setItem("users", JSON.stringify(users));

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.username === username.value.trim()) {
      currentUser.password = newPassword.value;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    alert("Password reset successful!");
    window.location.href = "index.html";
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
