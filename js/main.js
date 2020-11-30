window.addEventListener('DOMContentLoaded', () => {
    carregar()
    showProfile()
})


/**
 * Função que verifica se o usuário está logado
 */
function carregar() {
    const token = localStorage.getItem('token')
    let isTokenValid = false
    fetchApi('/', 'GET')
        .then(response => {
            if (response.ok) {
                isTokenValid = true
            }
        })
        .then(() => {
            if (!token || !isTokenValid) {
                window.location.href = "/login.html"
            }
        })
        .catch(() => {
            isTokenValid = false
            window.location.href = "/login.html"
        })
}


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

const url = 'http://localhost:8080'


/**
 * Função que busca recursos da API e retorna uma "promise"
 * @param {String} mapping Valor que será mapeado
 * @param {String} method 'POST', 'GET', 'PUT', 'DELETE'
 * @param {Object} data Corpo da requisição
 */
const fetchApi = (mapping, method, data) => {
    const token = localStorage.getItem('token')
    return fetch(url + mapping, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: JSON.stringify(data)
    })
}


/**
 * Converte um formulário em um array
 * @param {HTMLFormElement} form 
 */
function convertFormToArray(form) {
    const formData = new FormData(form)
    const data = Array.from(formData.entries()).reduce((memo, pair) => ({
        ...memo,
        [pair[0]]: pair[1],
    }), {});
    return data
}


/**
 * função que atualiza o perfil amarzenado
 */
function updateStoredProfile() {
    fetchApi('/empreendedor', 'GET')
        .then(response => response.json())
        .then(json => {
            localStorage.setItem('profile', JSON.stringify(json))
            document.location.reload()
        })
        .catch(err => console.log(err))
}


/**
 * Função que exibe foto e nome do usuário
 */
function showProfile() {
    if (getStoredProfile() == null) return
    
    showPic(document.getElementById('profilePic'))
    
    if (getStoredProfile().length == null && localStorage.getItem('profile').nome == null)
        document.getElementById('profileName').textContent = getStoredProfile().nome.split(' ')[0]
}


/**
 * função que converte a string armazenada em json 
 */
function getStoredProfile() {
    if (!(localStorage.getItem('profile')) || localStorage.getItem('profile') == 'undefined') return
    return JSON.parse(localStorage.getItem('profile'))
}


/**
 * função que busca a foto
 */
function getPic() {
    if (getStoredProfile() == null && getStoredProfile().foto == null) return
    return fetch(getStoredProfile().foto, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem('token')
        },
    })
}

/**
 * Função que exibe foto e nome do usuário
 */
async function showPic(element) {
    if (getStoredProfile() == null) return
    if (getStoredProfile().foto != null) {
        try {
            const res = await getPic()
            const img = await res.blob()
            return element.src = URL.createObjectURL(img)
        } catch (err) {
            return console.log(err)
        }
    }
    return element.src = "imgs/avatar.png";
}
