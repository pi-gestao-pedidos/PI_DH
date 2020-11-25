// const profileData = document.getElementsByTagName('p');
// const profileForm = document.forms[0];

// const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g; 
// const telRegex = /(\(?\d{2}\)?\s)(\d{4,5}\-?\d{4})/g;

// profileForm.onsubmit = function (event) { event.preventDefault() }

const container = document.getElementById('containerMain')
const storedProfile = getStoredProfile()

const perfil = document.createElement('div')
perfil.className = 'perfil'
perfil.innerHTML = `
            <div class="divPersonalPic">
                <img class="personalPic" src="${storedProfile.foto}" alt="Imagem do Perfil" />
            </div>
            <div class="dadosPessoais">
                <ul id="empreendedor">
                    <li>
                        <h5>Nome:</h5>
                        <p>${storedProfile.nome}</p>
                    </li>
                    <li>
                        <h5>CPF:</h5>
                        <p>${storedProfile.cpf}</p>
                    </li>
                    <li>
                        <h5>Email:</h5>
                        <p>${storedProfile.email}</p>
                    </li>
                </ul>
            <div>
                <h5>Telefones:</h5>
                <ul id="telefones">
                    ${phonesHTML()}
                </ul>
            </div>
            <div>
                <h5>Endereços:</h5>
                <ul id="enderecos">
                    ${adressesHTML()}
                </ul>
            </div>
            <ul id="juridica">
                <li>
                    <h5>Razão Social:</h5>
                    <p>${storedProfile.cnpj}</p>
                </li>
                <li>
                    <h5>CNPJ:</h5>
                    <p>${storedProfile.cnpj}</p>
                </li>
            </ul>
            `
container.appendChild(perfil)

function adressesHTML() {
    const adresses = storedProfile.enderecos
    if (adresses.length == 0) return ''

    let list = ""
    for(let address in adresses){ 
        list += "<li> CEP: "
        for (let key in adresses[address]) {
            if(!(key.includes('idEndereco') || key.includes('uf')))
            list += adresses[address][key] + ", "
            if(key.includes('uf'))
            list += adresses[address][key] + "."
        } 
        list += "</li>"
    }
    return list
}

function phonesHTML() {
    const phones = storedProfile.telefones
    if (phones.length == 0) return ''
    
    let list = ""
    for(let phone in phones) {
        list += "<li>"
        for(let key in phones[phone]) {
            list += phones[phone][key]
        }
        list += "</li>"
    }
}

const inputs = document.querySelectorAll('input, select, textarea');

for(let input of inputs) {
  input.addEventListener('invalid', (event) => {
    input.classList.add('error');    
  }, false);

  input.addEventListener('valid', (event) => {
    input.classList.remove('error');    
  }, false);

  input.addEventListener('blur', (event) => {
    input.checkValidity();
  })

}