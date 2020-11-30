
let produto
let produtoForm = document.getElementById('formProduto')
// const materiaisForm = document.getElementById('addMateriais')
const newMaterialForm = document.getElementById('novoMaterial')
const custoProdutoForm = document.getElementById('custoVariavel')
const errorMaterial = document.getElementById("errorMaterial")
let custos = []
let materiais = []
let custohora
let precoCustoTotal
let precoFinalTotal


function juntaArray(){
    const precificarForm = Object.assign({},
        convertFormToArray(post1),
        convertFormToArray(post2),
        convertFormToArray(post3),
        convertFormToArray(post4),
        convertFormToArray(post5),
        convertFormToArray(post6),
    )
    console.log(precificarForm)
}

function mudarShow(id) {
    document.getElementById(id).classList.toggle("show");
}


newMaterialForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const material = convertFormToArray(newMaterialForm)
    fetchApi('/materiais', 'POST', material)
        .then(async response => {
            if (!response.ok) {
                const error = await response.json()
                return error.errors.forEach(err => {
                    let itens = document.createElement("span")
                    itens.innerText = err.defaultMessage
                    errorMaterial.appendChild(itens)
                })
            }
        })
        .catch(err => console.error(err))
    mudarShow('newMaterialOverlay')
    newMaterialForm.reset()
})

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}


function myFunctionFilter() {
    fetchApi('/materiais', 'GET')
        .then(response => response.json())
        .then(json => {
            let materiais = document.getElementById('myDropdownFilter')
            json.forEach(item => {
                if (!document.getElementById(item.idMaterial + 'filtro')) {
                    let itens = document.createElement("div")
                    itens.id = item.idMaterial + 'filtro'
                    //itens.className = "dropdown-content-filter"
                    itens.innerHTML = `
                    <li
                    href="#${item.nome}" class="row margem" onclick="addMaterial(${item.idMaterial})"
                    style="width: 98%; padding: 1%; margin-top: 1%; margin-bottom:  1%; color: gray;">
                    ${item.nome}
                    </li>
                `
                    materiais.appendChild(itens)
                }
            })
            json.forEach(item => {
                if (document.getElementById('material' + item.idMaterial)) {
                    var item = document.getElementById(item.idMaterial + 'filtro');
                    item.parentNode.removeChild(item);
                }
            })
        })
        .catch(err => console.log(err))
    document.getElementById("myDropdownFilter").classList.toggle("show");
}

function myFunctionProduto() {
    var x = document.getElementById("myDropdownProduto");
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
    // document.getElementById("myDropdownProduto").classList.toggle("show");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdownFilter");
    a = div.getElementsByTagName("li");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function addMaterial(idMaterial) {
    document.getElementById("myDropdownFilter").classList.remove("show");
    fetchApi('/materiais/' + idMaterial, 'GET')
        .then(async response => {
            json = await response.json()
            if (!document.getElementById('material' + idMaterial)) {
                json.quantidade = 1
                materiais.push(json)
                // console.log(materiais)
                const materialadd = document.getElementById('tabelaMateriais')
                // json.forEach(item => {
                let itens = document.createElement("div")
                itens.className = "rowTabela"
                itens.id = 'material' + json.idMaterial
                itens.innerHTML = `
                        <p class="column7">${json.nome} </p>
                        <input class="column2" style="border-style: none; font-size: 1.2vw; padding: 0%; margin-bottom: 0%; text-align: center; color: #8F959B;" type="number" min="1" name="quantidade" id="fpProducao"
                    value="1" onchange="alterarQuantidade(${materiais.length - 1}, event)" required />
                        <p class="column4">${json.unidadeMedida} </p>
                        <img class="column icon" style="cursor: pointer; height: 70%; padding: 1%; margin-right: 1%;"
                            src="imgs/trashIcon.png" onclick="deletaMaterial('material${json.idMaterial}', ${materiais.length - 1})" />
                    `
                materialadd.appendChild(itens)
                calculaPrecoCustoTotal()
                console.log(materiais)
                // })
            }
            else
                alert("Material já foi inserido")
        })
        .catch(err => console.log(err))

}

async function calculaPrecoCustoTotal() {
    let produtoForm = document.getElementById('formProduto')
    const produto = convertFormToArray(produtoForm)
    let custoMateriais = await materiais.filter(x => x.custo > 0)
                                            .reduce((total, numero) => total + (numero.custo * numero.quantidade), 0);
    let custoVariaveis = await custos.filter(x => x.valor > 0)
                                            .reduce((total, numero) => total + parseFloat(numero.valor), 0);
    let custoPercentual = await custos.filter(x => x.porcentagem > 0)
                                            .reduce((total, numero) => total + parseFloat(numero.porcentagem), 0);
    // precoCustoTotal = (((custohora * produto.tempo) + custoMateriais + custoVariaveis) * (1+(custoPercentual / 100)))
    precoCustoTotal = (((custohora * produto.tempo) + (parseFloat(custoMateriais) + custoVariaveis)) * (1 + (custoPercentual / 100)))
    const putcustoTotal = document.getElementById('fpcusto')
    console.log(produto)
    console.log(custohora * produto.tempo)
    console.log(parseFloat(custoMateriais) + custoVariaveis)
    console.log(1 + (custoPercentual / 100))    

    precoFinalTotal = (precoCustoTotal * (1 + (produto.lucro / 100)))
    console.log(precoFinalTotal)
    putcustoTotal.innerText = 'Custo Total = ' + precoCustoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const putfinalTotal = document.getElementById('resultadoProduto')
    putfinalTotal.innerText = 'Preco Sugerido = ' + precoFinalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    //console.log(precoC.precoCustoTotal)
}


function deletaMaterial(idMaterial, nameMaterial) {
    var item = document.getElementById(idMaterial);
    item.parentNode.removeChild(item);
    delete materiais[nameMaterial]
    calculaPrecoCustoTotal()
    // console.log(materiais)
}

function alterarQuantidade(valor, event) {
    materiais[valor].quantidade = event.target.value
    calculaPrecoCustoTotal()
    // console.log(materiais)
}

function limpaListas(){
    materiais = []
    despesas = []
    putcustoTotal = 0.00
    precoFinalTotal = 0.00
    custohora = undefined
    var item = document.getElementById('formProduto');
    item.parentNode.removeChild(item);
}

async function postProduto() {
    let produtoForm = document.getElementById('formProduto')
    const produto = convertFormToArray(produtoForm)
    // console.log(produto)
    produto.precoCusto = precoCustoTotal
    produto.precoSugerido = precoFinalTotal
    produto.despesas = []
    produto.materiais = []
    const responseProduto = await fetchApi('/produtos', 'POST', produto)
    const jsonProduto = await responseProduto.json()
    await putProduto(jsonProduto.idProduto)
    console.log(produto)
    // overlayOff('novoProdutoOverlay')
    produtoForm.reset()
    // limpaTodosProdutos()
    //carregaProdutosTodos()
    //location.reload()
    return { jsonProduto }
}



async function putProduto(idProduto) {
    // event.preventDefault
    produtoForm = document.getElementById('formProduto')
    const produto = convertFormToArray(produtoForm)
    materiais.forEach(materiais => materiais.idProduto = idProduto)
    produto.materiais = materiais
    custos.forEach(custos => custos.idProduto = idProduto)
    produto.despesas = custos
    produto.precoCusto = precoCustoTotal
    produto.precoSugerido = precoFinalTotal
    const responseProduto = await fetchApi('/produtos/' + idProduto, 'PUT', produto)
    const jsonProduto = await responseProduto.json()
    // overlayOff('novoProdutoOverlay')
    //limpaListas()
    //produtoForm.reset()
    return { jsonProduto }
}



function custoProdutoPut(custo) {
    // custos = JSON.stringify(custo)
    // console.log(custo)
    custo.forEach(fila => {
        if (fila.valor == null ) { fila.valor = "" }
        if (fila.porcentagem == null) { fila.porcentagem = "" }
        custos.push(fila)
        // overlayOff('addCustosOverlay')
        const custoadd = document.getElementById('tabelaCustos')
        // json.forEach(item => {
        let itens = document.createElement("div")
        itens.className = "rowTabela"
        itens.id = custo.indexOf(fila)
        itens.innerHTML = `
                                <p class="column6">${fila.nome}</p>
                                <p class="column4">${fila.valor}</p>
                                <p class="column4" >${fila.porcentagem}</p>
                                <img class="column icon" style="cursor: pointer; height: 70%; padding: 1%; margin-right: 1%;"
                                    src="imgs/trashIcon.png" onclick="deletaCusto(${custo.indexOf(fila)})" />
                                `
        custoadd.appendChild(itens)
        calculaPrecoCustoTotal()
        console.log(custos)
    })
    // console.log(custos)
    // custoProdutoForm.reset()
}

custoProdutoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let erro = false
    const custosok = convertFormToArray(custoVariavel)
    if (custosok.valor && custosok.porcentagem) {
        alert('Favor inserir apenas valor OU porcentagem')
        erro = true
        return
    }
    else if (!custosok.valor && !custosok.porcentagem) {
        alert('Favor inserir valor OU porcentagem')
        erro = true
        return
    }
    else {
        if (custos.length >= 1) {
            custos.forEach(fila => {
                if (fila.nome == custosok.nome) {
                    alert("Custo já existe")
                    erro = true
                    return
                }
            })
        }
    }
    if (erro == false) {
        custos.push(convertFormToArray(custoVariavel))
        console.log(custos)
        // overlayOff('addCustosOverlay')
        const custoadd = document.getElementById('tabelaCustos')
        // json.forEach(item => {
        let itens = document.createElement("div")
        itens.className = "rowTabela"
        itens.id = custos.length - 1
        itens.innerHTML = `
                            <p class="column6">${custosok.nome}</p>
                            <p class="column4">${custosok.valor}</p>
                            <p class="column4" >${custosok.porcentagem}</p>
                            <img class="column icon" style="cursor: pointer; height: 70%; padding: 1%; margin-right: 1%;"
                                src="imgs/trashIcon.png" onclick="deletaCusto(${custos.length - 1})" />
                             `
        custoadd.appendChild(itens)
        calculaPrecoCustoTotal()
        custoProdutoForm.reset()
    }

})

function deletaCusto(idCusto) {
    var item = document.getElementById(idCusto)
    item.parentNode.removeChild(item)
    delete custos[idCusto]
    calculaPrecoCustoTotal()
    console.log(custos)
}

newMaterialForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const material = convertFormToArray(newMaterialForm)
    fetchApi('/materiais', 'POST', material)
        .then(async response => {
            if (!response.ok) {
                const error = await response.json()
                return error.errors.forEach(err => {
                    let itens = document.createElement("span")
                    itens.innerText = err.defaultMessage
                    errorMaterial.appendChild(itens)
                })
            }
        })
        .catch(err => console.error(err))
        mudarShow('newMaterialOverlay')
    // overlayOff('newMaterialOverlay')
    newMaterialForm.reset()
})


function buscaCusto(){
    fetchApi('/produtos/custohora', 'GET')
            .then(async response => {
                custohora = await response.json()
                console.log(custohora)
                })
}
