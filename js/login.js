const submitInput = document.getElementById("submit-input")
const loginInput = document.getElementById("flEmail")
const passwordInput = document.getElementById("flSenha")
const errorMessage = document.getElementById("error")

submitInput.addEventListener('click', (e) => {
    e.preventDefault()
    const data = {
        email: loginInput.value,
        senha: passwordInput.value
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }

    fetch("http://localhost:8080/api/usuarios/auth", options)
        .then(response => response.json())
        .then(json => {
            if(json.token) {
                localStorage.setItem('token', json.token)
                return window.location =  "/home.html"
            }
            errorMessage.textContent = json.message
        })
        .catch(err => console.log(err))

})

const loginCadastro = document.getElementById('fpEmail')
const senhaCadastro = document.getElementById('fpSenha')
const confirmaSenha = document.getElementById('fpSenha2')
const submitCadastro = document.getElementById('submitPerfil')

submitCadastro.addEventListener('click', (e) => {
    e.preventDefault()

    if((senhaCadastro.value.length || confirmaSenha.value.length)<5){
        alert('Senha deve ter mais que 5 caracteres')
    }
    else if(senhaCadastro.value != confirmaSenha.value) {
        alert('Senhas devem ser iguais')
    }
    else {
        const data = {
            email: loginCadastro.value,
            senha: confirmaSenha.value
        }

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
    
        fetch("http://localhost:8080/api/usuarios", options)
            .then(response => response.json())
            .then(json => {
                //Tratar no backend
                if(json.message.includes("Email deve ser um endereço de e-mail bem formado")){
                    alert('Email deve ser um endereço de e-mail bem formado')
                }
                return overlayOff('overlay')
            })
            .catch(err => console.log(err))
    } 

})

/**
 * Função que ativa o overlay effect.
 * @param {String} id Id do elemento.
 */
function overlayOn(id) {
    document.getElementById(id).style.display = "flex";
}

/**
 * Função que desativa o overlay effect.
 * @param {String} id Id do elemento.
 */
function overlayOff(id) {
    document.getElementById(id).style.display = "none";
}