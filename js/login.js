const submitInput = document.getElementById("formLogin")
const loginInput = document.getElementById("flEmail")
const passwordInput = document.getElementById("flSenha")
const errorMessage = document.getElementById("error")

submitInput.addEventListener('submit', (e) => {
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
                storeProfile(json.token)
                    .then(url => window.location = url)
                    .catch(err => console.error(err))
            }
            errorMessage.textContent = json.message
        })
        .catch(err => console.log(err))

})

const loginCadastro = document.getElementById('fpEmail')
const senhaCadastro = document.getElementById('fpSenha')
const confirmaSenha = document.getElementById('fpSenha2')
const formCadastro = document.getElementById('formPerfil')

formCadastro.addEventListener('submit', (e) => {
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

/**
 * Função que armazena o perfil
 * @param {String} token 
 */
 async function storeProfile(token) {
    const response = await fetch('http://localhost:8080/empreendedor', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
    const json = await response.json()
    const url = "/home.html"
    localStorage.setItem('profile', JSON.stringify(json[0]))
    return url
 }
