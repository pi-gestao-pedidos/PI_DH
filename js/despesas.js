const itens = document.getElementById('itens')
let despesas = []
fetchApi('/despesas', 'GET')
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        res.message
    })
    .then(async json => {
        despesas = await json
        despesas.forEach(element => {
            const itemDespesa = document.createElement('div')
            itemDespesa.className = 'itemDespesa'
            itemDespesa.innerHTML = `
                <img class="icon" src="imgs/costIcon.png"/>
                <p class="nomeItenCost">${element.nome}</p>
                <p class="precoDesp">R$ ${(element.valor).toFixed(2)}</p>
                <img class="icon iconbtn" src="./imgs/editIcon.png" onclick='updateDespesa(${element.idDespesa})'/>
                <img class="icon iconbtn" src="./imgs/trashIcon.png" onclick="deleteDespesa(${element.idDespesa})" />
            `
            itens.appendChild(itemDespesa)
        })
    })

function updateDespesa(id) {
    overlayOn('despesasOverlay')
    const despesa = despesas.filter(despesa => despesa.idDespesa == id)[0]
    despesasForm.idDespesa.value = despesa.idDespesa
    despesasForm.nome.value = despesa.nome
    despesasForm.valor.value = despesa.valor.toFixed(2)

}

async function deleteDespesa(id) {
    if (confirm('Esta operação não poderá ser desfeita. Deseja continuar?')) {
        await fetchApi(('/despesas/' + id), 'DELETE')
        alert('Cadastrado excluido!')
        return document.location.reload()

    }
}



const despesasForm = document.getElementById('formDespesas')
const salvarBtn = document.getElementById('salvarBtn')

salvarBtn.addEventListener('click', (e) => {
    e.preventDefault()

    let validated = inputs.length
    for (let input of inputs) {
        input.checkValidity();
        if (input.checkValidity()) validated--
    }

    if (validated == 0) {
        const despesasData = convertFormToArray(despesasForm)
        fetchApi('/despesas', 'POST', despesasData)
            .then(async res => {
                if (res.ok) {
                    await res.json()
                    alert('Despesa cadastrada!')
                    return document.location.reload()
                }
                alert('Erro ao cadastrar! ', res.statusText)
                console.log(JSON.stringify(despesasData))
            })
            .catch(err => console.error(err))

    }
})

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
    overlayOff('despesasOverlay')
    despesasForm.idDespesa.value = ""
    despesasForm.reset()
})