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

    login(options)
})

async function login(options) {
    try {
        const response = await fetch("http://localhost:8080/api/usuarios/auth", options)
        const json = await response.json()
        if (json.token) {
            const url = await storeProfile(json.token, json.email)
            localStorage.setItem('token', json.token)
            if (localStorage.getItem('token')) {
                window.location = url
            }
        }
        errorMessage.textContent = json.message
    } catch (error) {
        console.log(error)
    }
}

const nomeInput = document.getElementById('fpNome')
const loginCadastro = document.getElementById('fpEmail')
const senhaCadastro = document.getElementById('fpSenha')
const confirmaSenha = document.getElementById('fpSenha2')
const formCadastro = document.getElementById('formPerfil')

formCadastro.addEventListener('submit', (e) => {
    e.preventDefault()

    if ((senhaCadastro.value.length || confirmaSenha.value.length) < 5) {
        alert('Senha deve ter mais que 5 caracteres')
    }
    else if (senhaCadastro.value != confirmaSenha.value) {
        alert('Senhas devem ser iguais')
    }
    else {
        const data = {
            nome: nomeInput.value,
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
                // if (json.message.includes("Email deve ser um endereço de e-mail bem formado")) {
                //     alert('Email deve ser um endereço de e-mail bem formado')
                // }
                if (json.message) {
                    console.log(json.status, json.message)
                    if(json.message.includes("UNIQUE")){
                        return alert('Usuário já cadastrado!')
                    }
                    return alert(json.message.split("'")[1])
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
async function storeProfile(token, email) {
    const response = await fetch(('http://localhost:8080/empreendedor/' + email), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
    const json = await response.json()
    const url = "/home.html"
    localStorage.setItem('profile', JSON.stringify(json))
    return url
}
