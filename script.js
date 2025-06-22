document.addEventListener("DOMContentLoaded", () => {
  let isRegistering = false;
  
  const intro = document.getElementById("intro");
  const fullNameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const authButton = document.getElementById("auth-button");
  const toggleText = document.getElementById("toggle-auth");

  toggleText.addEventListener("click", (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;

    if (isRegistering) {
      intro.textContent = "Track and manage your expenses like a pro.";
      fullNameInput.style.display = "block";
      emailInput.style.display = "block";
      confirmPasswordInput.style.display = "block";
      authButton.textContent = "Register";
      toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-auth-link">Login here</a>`;
    } else {
      intro.textContent = "Login to your account.";
      fullNameInput.style.display = "none";
      emailInput.style.display = "none";
      confirmPasswordInput.style.display = "none";
      authButton.textContent = "Login";
      toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-auth-link">Create one</a>`;
    }
  });
});
