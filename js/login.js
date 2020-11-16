import axios from 'axios'

const submitInput = document.getElementById("submit-input")

submitInput.addEventListener("click", () => {
  const loginInput = document.getElementById("login-input")
  const passwordInput = document.getElementById("password-input")

  const data = {email: loginInput.value, senha: passwordInput.value}

  axios.post("http://localhost:8080/api/usuarios/auth",data)
      .then(res => alert(JSON.stringify(res)))
      .catch(err => console.log(err))
})
