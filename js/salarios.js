let test
let funcionarios = {}
let cards = []
const salarios = document.getElementById('salarios')

fetchApi('/funcionarios', 'GET')
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        res.message
    })
    .then(json => {
        funcionarios = json
        funcionarios.forEach(element => {

            if (element.idPessoa == getStoredProfile().idPessoa) return
            if (element.semana == null) element.semana = {}


            const card = document.createElement('div')
            card.className = 'card'
            card.setAttribute('onclick', `getSalarios(${element.idPessoa})`)
            card.innerHTML = `
                <div class="divPersonalPic">
                    <img id="${element.idPessoa}" class="personalPic" src='imgs/avatar.png'alt="Imagem do Perfil"/>
                </div>
                <ul>
                    <li><strong><p id="sNome">${element.nome}</p></strong></li>
                    <li><strong>Salário: </strong><p id="sSalario">${(element.salario).toFixed(2)}</p></li>
                    <li><strong>Carga Horária: </strong><p id="sCargaHoraria">${element.cargaHoraria}hrs</p></li>
                    <li><strong>Dias de trabalho: </strong><p id="sDiasDeTrabalho"></p></li>
                    <li>
                        <div id="divCheckbox" class="displayCheck">
                        <input type="checkbox" name="fsDias"  value=${element.semana.domingo} ${(element.semana.domingo == true) ? 'checked' : ''} onclick="return false;"/>
                        <label for="fsDom">Dom</label>
                        <input type="checkbox" name="fsDias"  value=${element.semana.segunda} ${(element.semana.segunda == true) ? 'checked' : ''} onclick="return false;"/>
                        <label for="fsSeg">Seg</label>
                        <input type="checkbox" name="fsDias"  value=${element.semana.terca} ${(element.semana.terca == true) ? 'checked' : ''} onclick="return false;"/>
                        <label for="fsTer">Ter</label>
                        <input type="checkbox" name="fsDias"  value=${element.semana.quarta} ${(element.semana.quarta == true) ? 'checked' : ''} onclick="return false;"/>
                        <label for="fsQua">Qua</label>
                        <input type="checkbox" name="fsDias"  value=${element.semana.quinta} ${(element.semana.quinta == true) ? 'checked' : ''} onclick="return false;"/>
                        <label for="fsQui">Qui</label>
                        <input type="checkbox" name="fsDias"  value=${element.semana.sexta} ${(element.semana.sexta == true) ? 'checked' : ''} onclick="return false;"/>
                        <label for="fsSex">Sex</label>
                        <input type="checkbox" name="fsDias"  value=${element.semana.sabado} ${(element.semana.sabado == true) ? 'checked' : ''} onclick="return false;"/>
                        <label for="fsSab">Sab</label>
                    </li>
                </ul>
            `

            card.foto = element.foto
            card.idPessoa = element.idPessoa
            cards.push(card)
            salarios.appendChild(card)

        });

        exibeFoto()

        const addCard = document.createElement('div')
        addCard.id = 'card2'
        addCard.className = 'card'
        addCard.setAttribute('onclick', "overlayOn('salariosOverlay')")
        addCard.innerHTML = `<img id="add" src="./imgs/add.png" alt="Adicionar"/>`
        salarios.appendChild(addCard)
    })
    .catch(err => console.error(err))


function exibeFoto() {
    cards.forEach(async card => {
        if (card.foto != null) {
            let img = document.getElementById(card.idPessoa)
            getPicFuncionario(card.foto, img)
        }
    })
}

async function getPicFuncionario(url, element) {
    try {
        const res = await fetch(url, {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        })
        const blob = await res.blob()
        return element.src = URL.createObjectURL(blob)

    } catch (err) {
        return console.error(err)
    }
}


const funcionarioForm = document.getElementById('formSalarios')

function getSalarios(id) {
    overlayOn('salariosOverlay')
    let funcionario = funcionarios.filter(item => item.idPessoa == id)[0];

    (funcionario.idPessoa == getStoredProfile().idPessoa) ?
        deleteBtn.style.display = "none" :
        deleteBtn.style.display = "flex";

    funcionarioForm['fsImg'].src = document.getElementById(id).src
    funcionarioForm['idPessoa'].value = funcionario.idPessoa
    funcionarioForm['fsNome'].value = funcionario.nome
    funcionarioForm['fsSalario'].value = (funcionario.salario).toFixed(2)
    funcionarioForm['fsHoras'].value = funcionario.cargaHoraria

    funcionarioForm['fsDom'].checked = funcionario.semana.domingo
    funcionarioForm['fsSeg'].checked = funcionario.semana.segunda
    funcionarioForm['fsTer'].checked = funcionario.semana.terca
    funcionarioForm['fsQua'].checked = funcionario.semana.quarta
    funcionarioForm['fsQui'].checked = funcionario.semana.quinta
    funcionarioForm['fsSex'].checked = funcionario.semana.sexta
    funcionarioForm['fsSab'].checked = funcionario.semana.sabado
}

const btnSalvar = document.getElementById('btnSalvar')
const resetBtn = document.getElementById('resetBtn')
const inputs = document.querySelectorAll('input[id^="fs"]')

resetBtn.addEventListener('click', () => {
    overlayOff('salariosOverlay')
    funcionarioForm.reset()
    deleteBtn.style.display = "none"
    funcionarioForm['fsIdPessoa'].value = null
    funcionarioForm['fsImg'].src = "imgs/avatar.png"
})


btnSalvar.addEventListener('click', () => {

    let validated = inputs.length
    for (let input of inputs) {
        input.checkValidity();
        if (input.checkValidity()) validated--
    }

    if (validated == 0) {

        const semanaData = {}
        const funcionarioData = {}

        inputs.forEach(input => {
            if (input.type == 'checkbox') semanaData[input.name] = input.checked
            if (input.type == 'number') funcionarioData[input.name] = input.valueAsNumber
            if (input.type == 'text') funcionarioData[input.name] = input.value
        })


        funcionarioData.semana = semanaData
        funcionarioData.idPessoa = funcionarioForm.idPessoa.value



        if (funcionarioForm.idPessoa.value < 1) {
            funcionarioData.foto = null
            deleteBtn.style.display = "none"
        } else {
            funcionarioData.foto = cards.filter(element => element.idPessoa == funcionarioForm.idPessoa.value)[0].foto
            deleteBtn.style.display = "block"
        }


        const urlPic = 'http://localhost:8080/download/'
        if (uploadPic.files.length > 0) {
            postPic(uploadedPic)
                .then(async res => { (res.ok) ? await res.json() : await res.message })
                .then(json => console.log(json))
                .catch(err => console.error(err))
            funcionarioData.foto = urlPic + uploadedPic.get('image').name
        }

        if (funcionarioForm.idPessoa.value == getStoredProfile().idPessoa) {
            const empreendedor = { ...getStoredProfile(), ...funcionarioData }
            empreendedor.usuario.nome = empreendedor.nome
            console.log(empreendedor)
            /***** ERROR  MAPEAMENTO ERRADO NO BACKEND ******/
            // return fetchApi(('/empreendedor/' + empreendedor.idPessoa), 'PUT', empreendedor)
            //     .then(async res => {
            //         if (res.ok) {
            //             await res.json()
            //             alert('Cadastrado alterado!')
            //             return document.location.reload()
            //         }
            //         alert('Erro ao alterar cadastro! ', res.statusText)
            //     })
            //     .catch(err => console.error(err))

            return document.location.reload()
        }


        if (funcionarioData.idPessoa < 1) {
            fetchApi('/funcionarios', 'POST', funcionarioData)
                .then(async res => {
                    if (res.ok) {
                        await res.json()
                        alert('Funcionário cadastrado!')
                        return document.location.reload()
                    }
                    alert('Erro ao cadastrar! ', res.statusText)
                    console.log(JSON.stringify(funcionarioData))
                })
                .catch(err => console.error(err))

        } else {
            fetchApi(('/funcionarios/' + funcionarioData.idPessoa), 'PUT', funcionarioData)
                .then(async res => {
                    if (res.ok) {
                        await res.json()
                        alert('Cadastrado alterado!')
                        return document.location.reload()
                    }
                    alert('Erro ao alterar cadastro! ', res.statusText)
                })
                .catch(err => console.error(err))
        }
    }
})

const deleteBtn = document.getElementById('btnExcluir')

deleteBtn.addEventListener('click', () => {
    if (confirm('Esta operação não poderá ser desfeita. Deseja continuar?')) {
        fetchApi(('/funcionarios/' + parseInt(funcionarioForm['idPessoa'].value)), 'DELETE')
            .then(() => { alert('Cadastrado excluido!'); return document.location.reload() })
    }
})

/* 
*/


for (let input of inputs) {

    input.addEventListener('invalid', () => {
        input.classList.add('error');
    }, false);

    input.addEventListener('blur', () => {
        input.checkValidity();
    })

}


const pic = document.getElementById('fsImg')
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