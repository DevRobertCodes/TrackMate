document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const question = document.getElementById("security-question");
  const answer = document.getElementById("security-answer");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const lastUser = users[users.length - 1];

    if (!question.value.trim() || !answer.value.trim()) {
      alert("Please select a question and provide an answer.");
      return;
    }

    if (!lastUser) {
      alert("No user found. Please register.");
      window.location.href = "register.html";
      return;
    }

    lastUser.recoveryQuestion = question.value.trim();
    lastUser.recoveryAnswer = answer.value.trim();
    localStorage.setItem("users", JSON.stringify(users));
    alert("Recovery question saved. You can now log in.");
    window.location.href = "index.html";
  });
});