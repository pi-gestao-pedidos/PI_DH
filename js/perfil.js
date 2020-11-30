const container = document.getElementById('containerMain')
const storedProfile = (getStoredProfile() != null) ? getStoredProfile() : []

const perfil = document.createElement('div')
perfil.className = 'perfil'
perfil.innerHTML = `
            <div class="divPersonalPic">
                <img id="detailsPic" class="personalPic" src ="imgs/avatar.png" alt="Imagem do Perfil" />
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
    if (storedProfile.enderecos === undefined) return
    const adresses = storedProfile.enderecos
    if (adresses.length == 0) return ''

    let list = ""
    for (let address in adresses) {
        list += "<li> CEP: "
        for (let key in adresses[address]) {
            if (!(key.includes('idEndereco') || key.includes('uf')))
                list += adresses[address][key] + ", "
            if (key.includes('uf'))
                list += adresses[address][key] + "."
        }
        list += "</li>"
    }
    return list
}

function phonesHTML() {
    if (storedProfile.telefones === undefined) return
    const phones = storedProfile.telefones
    if (phones.length == 0) return ''

    let list = ""
    for (let phone in phones) {
        list += "<li>"
        for (let key in phones[phone]) {
            if (key.includes('ddd')) {
                list += '(' + phones[phone][key] + ') '
            }
            if (key.includes('numero')) {
                list += phones[phone][key]
            }
            
        }
        list += "</li>"
    }
    return list
}

let senha = document.getElementById('fpSenha')
let senha2 = document.getElementById('fpSenha2')

const inputs = document.querySelectorAll('input, select, textarea');

for (let input of inputs) {

    input.addEventListener('invalid', () => {
        input.classList.add('error');
    }, false);

    input.addEventListener('blur', () => {
        input.checkValidity();
    })

}

const pic = document.getElementById('pic')
const detailsPic = document.getElementById('detailsPic')
showPic(pic)
showPic(detailsPic)

const uploadPic = document.getElementById('uploadBtn')

let uploadedPic;

uploadPic.addEventListener("change", (event) => {
    const img = event.target.files[0]
    pic.src = URL.createObjectURL(img)
    const formData = new FormData()
    formData.append("image", img)
    uploadedPic = formData
})

async function postPic(formData) {
    const res = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        },
        body: formData
    })
    return await res.json()
}

const userForm = document.getElementById('usuarioForm')
const form1 = document.getElementById('empreendedorForm1')
const form2 = document.getElementById('empreendedorForm2')
const phoneForm = document.getElementById('phoneForm')
const addressForm = document.getElementById('addressForm')

const submitPerfil = document.getElementById('submitPerfil')

const storedTelefones = (storedProfile.telefones === undefined) ? [] : storedProfile.telefones[0];
const storedEnderecos = (storedProfile.enderecos === undefined) ? [] : storedProfile.enderecos[0];

imputingValue(userForm, storedProfile)
imputingValue(form1, storedProfile)
imputingValue(form2, storedProfile)
imputingValue(phoneForm, storedTelefones)
imputingValue(addressForm, storedEnderecos)

function imputingValue(form, array) {
    if (array == null) return

    for (let index = 0; index < form.length; index++) {
        if (array[form[index].name] != null) {
            form[index].value = array[form[index].name]
        } else {
            form[index].value = ""
        }
    }
}


let message
submitPerfil.addEventListener('click', () => {

    let userChange = false
    let empreendedorChange = false
    let telefoneChange = false
    let enderecoChange = false
    let picChange = false

    let senhas = (senha.value != senha2.value) ? senha2.setCustomValidity("As senhas devem ser iguais") : senha2.setCustomValidity("");

    let validated = inputs.length
    for (let input of inputs) {
        input.checkValidity();
        if (input.checkValidity()) validated--
    }

    if (validated == 0) {

        const usuarioForm = convertFormToArray(userForm)

        fetchApi(('/api/usuarios/' + usuarioForm.email), 'PUT', usuarioForm)
            .then(res => res.json())
            .then(json => {
                if (json.message) {
                    console.log(json.status, json.message)
                    return alert(json.message.split("'")[1])
                }
                userChange = true
                usuarioForm.idPessoa = json.idPessoa
                if (usuarioForm.idPessoa) {
                    const empreendedorForm = Object.assign({},
                        convertFormToArray(form1),
                        convertFormToArray(form2),
                    )
                    empreendedorForm.idPessoa = usuarioForm.idPessoa
                    empreendedorForm.nome = usuarioForm.nome
                    empreendedorForm.email = usuarioForm.email
                    empreendedorForm.foto = storedProfile.foto
                    // phoneForm.idPessoa = await usuarioForm.idPessoa
                    // addressForm.idPessoa = await usuarioForm.idPessoa
                    

                    if(empreendedorForm.cpf == "") empreendedorForm.cpf = null

                    let urlPic = 'http://localhost:8080/download/'

                    fetchApi(('/empreendedor/'+ empreendedorForm.idPessoa), 'PUT', empreendedorForm)
                        .then(res => res.json())
                        .then(empreendedorChange = true)
                        .catch(err => console.log(err))

                    if (phoneForm.ddd.value.length > 1 && phoneForm.numero.value.length > 1) {
                        const telefoneForm = convertFormToArray(phoneForm)
                        telefoneForm.idPessoa = json.idPessoa
                        if (storedProfile.telefones[0]) {
                            telefoneForm.idTelefone = storedProfile.telefones[0].idTelefone
                            fetchApi(('/telefones/' + storedProfile.telefones[0].idTelefone), 'PUT', telefoneForm)
                                .then(telefoneChange = true)
                                .catch(err => console.log(err))

                        } else {
                            console.log(telefoneForm)
                            fetchApi('/telefones', 'POST', telefoneForm)
                                .then(telefoneChange = true)
                                .catch(err => console.log(err))

                        }
                    } else {
                        telefoneChange = true
                    }

                    if (addressForm.cep.value.length > 1) {
                        const enderecoForm = convertFormToArray(addressForm)
                        enderecoForm.idPessoa = json.idPessoa
                        if (storedProfile.enderecos[0]) {
                            enderecoForm.idEndereco = storedProfile.enderecos[0].idEndereco
                            fetchApi(('/enderecos/' + storedProfile.enderecos[0].idEndereco), 'PUT', enderecoForm)
                                .then(enderecoChange = true)
                                .catch(err => console.log(err))

                        } else {
                            console.log(enderecoForm)
                            fetchApi('/enderecos', 'POST', enderecoForm)
                                .then(enderecoChange = true)
                                .catch(err => console.log(err))

                        }
                    } else {
                        enderecoChange = true
                    }

                    if (uploadedPic) {
                        postPic(uploadedPic)
                            .then(res => console.log(res))
                            .catch(err => console.log(err))
                        empreendedorForm.foto = urlPic += uploadedPic.get('image').name
                        if (empreendedorForm.foto) {
                            fetchApi(`/empreendedor/${empreendedorForm.idPessoa}`, 'PUT', empreendedorForm)
                                .then(picChange = true)
                                .catch(err => alert('ERRO' + err))
                        }
                    } else {
                        picChange = true
                    }

                    if (userChange && empreendedorChange && telefoneChange && enderecoChange && picChange) {
                        alert('Alterado com sucesso!')
                        storeProfile(localStorage.getItem('token'))
                            .then(() => document.location.reload())
                    }
                }
            })
            .catch(err => console.log(err))
    }

})


async function storeProfile(token) {
    const response = await fetch('http://localhost:8080/empreendedor', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
    const json = await response.json()
    localStorage.setItem('profile', JSON.stringify(json[0]))

}