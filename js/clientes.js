const ul = document.getElementById('contactList')
let clientes = []

fetchApi('/clientes', 'GET')
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        res.message
    })
    .then(async json => {
        clientes = await json

        clientes.sort((a, b) => {
            if (a.nome > b.nome) {
              return 1;
            }
            if (a.nome < b.nome) {
              return -1;
            }
            return 0;
          });

        clientes.forEach(cliente => {
            for (const key in cliente) {
                (cliente[key] == null) ? cliente[key] = "" : cliente[key];
                (cliente.telefones[0] == null) ? cliente.telefones[0] = { "ddd": "", "numero": "" } : cliente.telefones[0];
            }
            const li = document.createElement('li')
            li.innerHTML = `
                <img class="clientPic" src="imgs/avatar.png" alt="Imagem do Perfil" />
                <h4>${cliente.nome}</h4>
                <p id="email">${cliente.email}</p>
                <p id="telefone">(${cliente.telefones[0].ddd}) ${cliente.telefones[0].numero}</p>
                <img class="icon iconbtn" src="./imgs/editIcon.png" onclick='updateCliente(${cliente.idPessoa})' />
                <img class="icon iconbtn" src="./imgs/trashIcon.png" onclick='deleteCliente(${cliente.idPessoa})' />
            `
            ul.appendChild(li)
        })
    })

const clienteForm = document.getElementById('clienteForm')
const phoneForm = document.getElementById('phoneForm')
const addressForm = document.getElementById('addressForm')
const submit = document.getElementById('submit')
let newCliente

submit.addEventListener('click', async () => {

    let validated = inputs.length
    for (let input of inputs) {
        input.checkValidity();
        if (input.checkValidity()) validated--
    }

    if (validated == 0) {
        const clienteData = convertFormToArray(clienteForm)
        const phoneData = convertFormToArray(phoneForm)
        const addressData = convertFormToArray(addressForm)

        convertEmptyToNull(clienteData)
        convertEmptyToNull(phoneData)
        convertEmptyToNull(addressData)

        const urlPic = 'http://localhost:8080/download/'
        if (uploadPic.files.length > 0) {
            postPic(uploadedPic)
                .then(async res => { (res.ok) ? await res.json() : await res.message })
                .then(json => console.log(json))
                .catch(err => console.error(err))
            clienteData.foto = urlPic + uploadedPic.get('image').name
        }

        if (clienteData.idPessoa != null) {
            if (phoneData.idTelefone != null) {
                phoneData.idPessoa = clienteData.idPessoa
                clienteData.telefones = [phoneData]
            } else {
                clienteData.telefones = []
            }

            if(phoneData.idTelefone == null && phoneData.ddd != null && phoneData.numero != null) {
                phoneData.idPessoa = clienteData.idPessoa
                clienteData.telefones = [phoneData]
            }

            if (addressData.idEndereco !=null) {
                addressData.idPessoa = clienteData.idPessoa
                clienteData.enderecos = [addressData]
            } else {
                clienteData.enderecos = []
            }

            if (addressData.idEndereco == null && addressData.cep != null) {
                addressData.idPessoa = clienteData.idPessoa
                clienteData.enderecos = [addressData]
            }

            putCliente(clienteData)

        }else {
            fetchApi('/clientes', 'POST', clienteData)
                .then(async res => {
                    if (res.ok) {
                        newCliente = await res.json()
    
                        if (phoneData.ddd != null) {
                            postTelefone(newCliente, phoneData)
                        }
    
                        if (addressData.cep != null) {
                            postEndereco(newCliente, addressData)
                        }
    
                        alert('Cliente cadastrado!')
                        return document.location.reload()
                    }
                    alert('Erro ao cadastrar! ')
                    console.log(res.json())
                })
                .catch(err => console.error(err))
        }





    }
})

let telefones

function updateCliente(id) {
    overlayOn('clienteOverlay')
    const cliente = clientes.filter(cliente => cliente.idPessoa == id)[0]
    imputingValue(clienteForm, cliente)
    imputingValue(phoneForm, cliente.telefones[0])
    imputingValue(addressForm, cliente.enderecos[0])

}

async function deleteCliente(id) {
    if (confirm('Esta operação não poderá ser desfeita. Deseja continuar?')) {
        await fetchApi(('/clientes/' + id), 'DELETE')
        alert('Cadastrado excluido!')
        return document.location.reload()
    }
}


const inputs = document.querySelectorAll('input, select, textarea');
for (let input of inputs) {

    input.addEventListener('invalid', () => {
        input.classList.add('error');
    }, false);

    input.addEventListener('blur', () => {
        input.checkValidity();
    })

}

const resetBtn = document.getElementById('resetBtn')

resetBtn.addEventListener('click', () => {
    clienteForm.reset()
    clienteForm.idPessoa.value = ""
    phoneForm.reset()
    phoneForm.idTelefone.value = ""
    addressForm.reset()
    addressForm.idEndereco.value = ""
    overlayOff('clienteOverlay')
})


function convertEmptyToNull(array) {
    for (let key in array) {
        (array[key] == "") ? array[key] = null : array[key];
    }
}


function putCliente(cliente) {
    console.log(cliente)
    return fetchApi(('/clientes/' + cliente.idPessoa), 'PUT', cliente)
        .then(async res => {
            if(res.ok) {
                await res.json()
                alert('Cadastro alterado!')
                return document.location.reload()
            }
            alert('Erro ao cadastrar! ')
            console.error(await res.json())
            return document.location.reload()
        })
        .then(json => json)
        .catch(err => console.error(err))
}

function postTelefone(cliente, phoneData) {
    phoneData.idPessoa = cliente.idPessoa
    fetchApi('/telefones', 'POST', phoneData)
        .then(res => res.json())
        .then(json => json)
        .catch(err => console.error(err))
}

function postEndereco(cliente, addressData) {
    addressData.idPessoa = cliente.idPessoa
    fetchApi('/enderecos', 'POST', addressData)
        .then(res => res.json())
        .then(json => json)
        .catch(err => console.error(err))
}


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

const pic = document.getElementById('pic')
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

