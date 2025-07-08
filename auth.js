// document.addEventListener("DOMContentLoaded", () => {
//   // Toggle password visibility
// document.querySelectorAll(".toggle-password").forEach((icon) => {
//   icon.addEventListener("click", () => {
//     const targetId = icon.getAttribute("data-target");
//     const passwordField = document.getElementById(targetId);

//     if (!passwordField) return;

//     const isPassword = passwordField.type === "password";
//     passwordField.type = isPassword ? "text" : "password";

//     // Toggle icons
//     icon.classList.toggle("fa-eye");
//     icon.classList.toggle("fa-eye-slash");
//   });
// });


//   // Determine the current page based on the URL path
//   const path = window.location.pathname;

//   if (path.includes("register.html")) {
//     const registerForm = document.getElementById("auth-form");
//     const usernameInput = document.getElementById("username");
//     const passwordInput = document.getElementById("password");
//     const confirmPasswordInput = document.getElementById("confirm-password");

//     registerForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const username = usernameInput.value.trim();
//       const password = passwordInput.value;
//       const confirmPassword = confirmPasswordInput.value;

//       if (!username || !password || !confirmPassword) {
//         alert("Please fill in all fields.");
//         return;
//       }

//       if (password !== confirmPassword) {
//         alert("Passwords do not match.");
//         return;
//       }

//       const storedUsersJSON = localStorage.getItem("users");
//       const users = storedUsersJSON ? JSON.parse(storedUsersJSON) : [];

//       const userExists = users.some(user => user.username === username);
//       if (userExists) {
//         alert("Username already taken.");
//         return;
//       }

//       const newUser = { username, password };
//       users.push(newUser);
//       localStorage.setItem("users", JSON.stringify(users));
//       window.location.href = "recovery.html";
//     });

//   } else if (path.includes("recovery.html")) {
//     const recoveryForm = document.getElementById("auth-form");
//     const questionSelect = document.getElementById("security-question");
//     const answerInput = document.getElementById("security-answer");

//     recoveryForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const selectedQuestion = questionSelect.value.trim();
//       const answer = answerInput.value.trim();

//       if (!selectedQuestion || !answer) {
//         alert("Please select a question and provide an answer.");
//         return;
//       }

//       const storedUsersJSON = localStorage.getItem("users");
//       let users = storedUsersJSON ? JSON.parse(storedUsersJSON) : [];
//       const lastUserIndex = users.length - 1;

//       if (lastUserIndex < 0) {
//         alert("No user found. Please register.");
//         window.location.href = "register.html";
//         return;
//       }

//       users[lastUserIndex].recoveryQuestion = selectedQuestion;
//       users[lastUserIndex].recoveryAnswer = answer;
//       localStorage.setItem("users", JSON.stringify(users));

//       alert("Recovery question saved. You can now log in.");
//       window.location.href = "index.html";
//     });

//   } else if (path.includes("index.html")) {
//     const loginForm = document.getElementById("auth-form");
//     const usernameInput = document.getElementById("username");
//     const passwordInput = document.getElementById("password");

//     loginForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const enteredUsername = usernameInput.value.trim();
//       const enteredPassword = passwordInput.value;

//       if (!enteredUsername || !enteredPassword) {
//         alert("Please enter both username and password.");
//         return;
//       }

//       const usersJSON = localStorage.getItem("users");
//       const users = usersJSON ? JSON.parse(usersJSON) : [];

//       const foundUser = users.find(
//         (user) => user.username === enteredUsername && user.password === enteredPassword
//       );

//       if (foundUser) {
//         alert("Login successful!");
//         localStorage.setItem("currentUser", JSON.stringify(foundUser));
//         window.location.href = "dashboard.html";
//       } else {
//         alert("Invalid username or password.");
//       }
//     });

//   } else if (path.includes("reset.html")) {
//     const resetForm = document.getElementById("auth-form");
//     const usernameInput = document.getElementById("reset-username");
//     const questionSelect = document.getElementById("security-question");
//     const answerInput = document.getElementById("security-answer");
//     const newPasswordInput = document.getElementById("password");
//     const confirmPasswordInput = document.getElementById("confirm-password");

//     if (!resetForm) return;

//     resetForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       const username = usernameInput.value.trim();
//       const selectedQuestion = questionSelect.value.trim();
//       const answer = answerInput.value.trim();
//       const newPassword = newPasswordInput.value;
//       const confirmPassword = confirmPasswordInput.value;

//       // Validation
//       if (!username || !selectedQuestion || !answer || !newPassword || !confirmPassword) {
//         alert("Please fill in all fields.");
//         return;
//       }

//       if (newPassword !== confirmPassword) {
//         alert("New passwords do not match.");
//         return;
//       }

//       // Get users
//       const storedUsersJSON = localStorage.getItem("users");
//       const users = storedUsersJSON ? JSON.parse(storedUsersJSON) : [];

//       // Find the user
//       const userIndex = users.findIndex(
//         (user) =>
//           user.username === username &&
//           user.recoveryQuestion === selectedQuestion &&
//           user.recoveryAnswer === answer
//       );

//       if (userIndex === -1) {
//         alert("User not found or incorrect recovery information.");
//         return;
//       }

//       // Optional check: don't allow same password
//       if (users[userIndex].password === newPassword) {
//         alert("New password must be different from old password.");
//         return;
//       }

//       // Update user's password
//       users[userIndex].password = newPassword;
//       localStorage.setItem("users", JSON.stringify(users));

//       // Also update currentUser if it matches
//       const currentUserJSON = localStorage.getItem("currentUser");
//       if (currentUserJSON) {
//         const currentUser = JSON.parse(currentUserJSON);
//         if (currentUser.username === username) {
//           currentUser.password = newPassword;
//           localStorage.setItem("currentUser", JSON.stringify(currentUser));
//         }
//       }

//       alert("Password reset successful! You can now log in.");
//       window.location.href = "index.html";
//     });
//   }
// });