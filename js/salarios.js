//const detailsCard = document.querySelectorAll("#detailsCard li")

const salarios = document.getElementById('salarios')

let ul
let cards = []
let semana
const semanas = fetchApi('/semana', 'GET')
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        return res.message
    })
    .then(json => {
        semana = json
        semana.forEach(element => {

            const card = document.createElement('div')
            card.className = 'card'
            card.setAttribute('onclick', `getSalarios(${element.idPessoa})`)
            card.innerHTML = `
                <div class="divPersonalPic">
                    <img id=
                    ${element.pessoa.idPessoa}
                     class="personalPic" 
                    src='imgs/avatar.png'
                    alt="Imagem do Perfil"/>
                </div>
                <ul>
                    <li><strong><p id="sNome">${element.pessoa.nome}</p></strong></li>
                    <li><strong>Salário: </strong><p id="sSalario">${(element.pessoa.salario).toFixed(2)}</p></li>
                    <li><strong>Carga Horária: </strong><p id="sCargaHoraria">${element.pessoa.cargaHoraria}hrs</p></li>
                    <li><strong>Dias de trabalho: </strong><p id="sDiasDeTrabalho"></p></li>
                    <li>
                        <div id="divCheckbox" class="displayCheck">
                           <input type="checkbox" name="fsDias"  value=${element.domingo} ${(element.domingo == true)? 'checked' : '' } onclick="return false;"/>
                           <label for="fsDom">Dom</label>
                           <input type="checkbox" name="fsDias"  value=${element.segunda} ${(element.segunda == true)? 'checked' : '' } onclick="return false;"/>
                           <label for="fsSeg">Seg</label>
                           <input type="checkbox" name="fsDias"  value=${element.terca} ${(element.terca == true)? 'checked' : '' } onclick="return false;"/>
                           <label for="fsTer">Ter</label>
                           <input type="checkbox" name="fsDias"  value=${element.quarta} ${(element.quarta == true)? 'checked' : '' } onclick="return false;"/>
                           <label for="fsQua">Qua</label>
                           <input type="checkbox" name="fsDias"  value=${element.quinta} ${(element.quinta == true)? 'checked' : '' } onclick="return false;"/>
                           <label for="fsQui">Qui</label>
                           <input type="checkbox" name="fsDias"  value=${element.sexta} ${(element.sexta == true)? 'checked' : '' } onclick="return false;"/>
                           <label for="fsSex">Sex</label>
                           <input type="checkbox" name="fsDias"  value=${element.sabado} ${(element.sabado == true)? 'checked' : '' } onclick="return false;"/>
                           <label for="fsSab">Sab</label>
                       </li>
                    </div>
                </ul>
                    `

            card.foto = element.pessoa.foto
            card.idPessoa = element.pessoa.idPessoa
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
    const funcionario = semana.filter(item => item.idPessoa == id)

    funcionarioForm['fsImg'].src = document.getElementById(id).src
    funcionarioForm['idSemana'].value = funcionario[0].idSemana
    funcionarioForm['idPessoa'].value = funcionario[0].idPessoa
    funcionarioForm['fsNome'].value = funcionario[0].pessoa.nome
    funcionarioForm['fsSalario'].value = (funcionario[0].pessoa.salario).toFixed(2)
    funcionarioForm['fsHoras'].value = funcionario[0].pessoa.cargaHoraria

    funcionarioForm['fsDom'].checked = funcionario[0].domingo
    funcionarioForm['fsSeg'].checked = funcionario[0].segunda
    funcionarioForm['fsTer'].checked = funcionario[0].terca
    funcionarioForm['fsQua'].checked = funcionario[0].quarta
    funcionarioForm['fsQui'].checked = funcionario[0].quinta
    funcionarioForm['fsSex'].checked = funcionario[0].sexta
    funcionarioForm['fsSab'].checked = funcionario[0].sabado
}

const btnSalvar = document.getElementById('btnSalvar')
const resetBtn = document.getElementById('resetBtn')
const inputs = document.querySelectorAll('input[id^="fs"]')

resetBtn.addEventListener('click', () => {
    overlayOff('salariosOverlay')
    funcionarioForm.reset()
    funcionarioForm['fsImg'].src = "imgs/avatar.png"
})

btnSalvar.addEventListener('click', () => {

    const data = {}
    inputs.forEach(input => {
        if (input.type == 'checkbox') data[input.name] = input.checked 
        if (input.type == 'number') data[input.name] = input.valueAsNumber
        if (input.type == 'hidden') data[input.name] = parseFloat(input.value)
    })
    console.log(data)
})

for (let input of inputs) {

    input.addEventListener('invalid', () => {
        input.classList.add('error');
    }, false);

    input.addEventListener('blur', () => {
        input.checkValidity();
    })

}