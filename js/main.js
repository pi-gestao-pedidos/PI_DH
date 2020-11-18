function carregar(){
    const token =  localStorage.getItem('token')
    let isTokenValid = false
    fetchApi('/', 'GET')
    // const options = {
    //     method: 'GET',
    //     headers: { 
    //         'Content-Type': 'application/json',
    //         'Authorization': "Bearer "+token
    //     },
    // }

    // fetch("http://localhost:8080/", options)
        .then(() => {
            isTokenValid = true
        })
        .then(()=>{
            if(!token || !isTokenValid){
                window.location.href = "/login.html"
            }
        })
        .catch(() => {
            isTokenValid=false
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
 * @param {String} data Corpo da requisição
 */
const fetchApi = (mapping, method, data) => {
    const token =  localStorage.getItem('token')
    return fetch(url + mapping, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          },
        body: JSON.stringify(data)
    })
        // .then(response => response.json())
        // .catch(error => { return console.log(error) })
}

