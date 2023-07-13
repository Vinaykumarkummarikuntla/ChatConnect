function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const showPasswordToggle = document.querySelector(".show");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showPasswordToggle.innerHTML = "&#128064;"; // Change to hide icon
  } else {
    passwordInput.type = "password";
    showPasswordToggle.innerHTML = "&#128065;"; // Change to show icon
  }
}

async function checkOnServer(event) {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;
  console.log(email, password);
  const obj = { email, password };
  console.log(obj);
  try {
    const response = await axios.post(
      "http://localhost:3000/logindetails",
      obj
    );
    console.log(response.status, "STATUS");

    localStorage.setItem("token", response.data.token);
    window.location.href = "/pages/chat.html";
  } catch (err) {
    console.log("catch error", err.response.status);
    if (err.response.status === 401) {
      const invalidPasswordMessage = document.getElementById("invalidpassword");
      invalidPasswordMessage.textContent = "Invalid Password";
      invalidPasswordMessage.classList.add("invalidpassword");
    } else if (err.response.status === 404) {
      const invalidPasswordMessage = document.getElementById("invalidpassword");
      invalidPasswordMessage.textContent = "User is not found";
      invalidPasswordMessage.classList.add("invalidpassword");
    }
  }
}
