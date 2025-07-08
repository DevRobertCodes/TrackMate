document.addEventListener('DOMContentLoaded', () => {
  // Toggle password visibility
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

  // REGISTER FORM LOGIC
  const registerForm = document.getElementById("auth-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");

  if (!registerForm) return; // safety check

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!username || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const storedUsersJSON = localStorage.getItem("users");
    const users = storedUsersJSON ? JSON.parse(storedUsersJSON) : [];

    const userExists = users.some(user => user.username === username);
    if (userExists) {
      alert("Username already taken.");
      return;
    }

    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "recovery.html";
  });
});
