function saveToServer (event) {
    event.preventDefault()
    const username = event.target.usernameinput.value
    const email = event.target.emailinput.value
    const password = event.target.passwordinput.value
    const phonenumber = event.target.Phonenumberinput.value
  
    // console.log(username, email, password);
    const obj = { username, email, password, phonenumber }
    axios
      .post('http://localhost:3000/signupdetails', obj)
      .then((response) => {
        console.log(response)
        alert("Successfuly signed up")
        redirectToLogin()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  function redirectToLogin () {
    window.location.href = '/pages/index.html'
  }
  