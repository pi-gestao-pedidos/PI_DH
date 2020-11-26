carregaTodosProdutos()

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



//Quando Clicar no Button mudar o Show
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

// async function limpaTodosProdutos(){
//     const item2 = document.querySelectorAll(".itemProduto");
//     item2.forEach(itens2 => {
//         item2.parentNode.removeChild(itens2);
//     })
//     return(true)
// }

function carregaTodosProdutos() {
    fetchApi('/produtos', 'GET')
        .then(response => response.json())
        .then(json => {
            const produtos = document.getElementById('containerMain')
            json.forEach(item => {
                let itens = document.createElement("div")
                itens.className = "itemProduto"
                itens.id = "produto" + item.idProduto
                itens.innerHTML = `
                        <img class="iconProduto" src="imgs/productIcon.png" />
                        <div class="itemDetalhes">
                            <h4>${item.nome}</h4>
                            <p class="descricao">${item.descricao}</p>
                            <span class="row"
                                style="font-size: 1.3em; font-weight: bold;">Preço:&nbsp; <span
                                    style="font-weight: normal;">${item.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></span>
                        </div>
                        <img class="iconEditar" src="imgs/editIcon.png" onclick="alteraProduto(${item.idProduto}), buscaCusto()"/>
                        <img class="iconLixeira" src="imgs/trashIcon.png" onclick="deletaProduto(${item.idProduto}, 'produto${item.idProduto}')"/>
                        `
                produtos.appendChild(itens)
            })
        })
        .catch(err => console.log(err))
}


function deletaProduto(idProduto, idProdutoHtml) {
    var item = document.getElementById(idProdutoHtml);
    console.log(item)
    item.parentNode.removeChild(item);
    fetchApi('/produtos/' + idProduto, 'DELETE')
}

function novoProduto() {
    materiais = []
    custos = []
    const produtos = document.getElementById('novoProdutoOverlay')
    let itens = document.createElement("form")
    itens.id = "formProduto"
    itens.className = "containerForm"
    // itens.method = "POST"
    itens.style.gap = "3%"
    itens.innerHTML = `
            <span class="closeForm" onclick="overlayOff('novoProdutoOverlay'), limpaListas()">x</span>
            <input class="row dadosDBoverlay" type="text" name="nome" id="fpNome" placeholder="nome*" required />
            <input class="row dadosDBoverlay" type="text" name="descricao" id="fpDescricao" placeholder="descrição">
            <div class="row" style="gap: 3%;">
                <input class="column dadosDBoverlay" type="number" onchange="calculaPrecoCustoTotal()" min=".25" step="0.25" name="tempo" id="fptempo"
                    placeholder="min p/ produzir 1 unid" required />
                <input class="column dadosDBoverlay" type="number" min="1" name="unidadeMensal" id="fpProducao"
                    placeholder="unid prod mensal" required />
            </div>
            <div class="row" style="gap: 0%;">
                
                    <div class="column5 dropdownFilter btnFilter dadosDBoverlay" style="margin-right: 3%; justify-content: center; align-items: center;">
                        <span onclick="myFunctionFilter()" class="">Selecionar
                            Material</span>
                        <ul id="myDropdownFilter" class="dropdown-content-filter" style="padding-left: 2%;">
                            <input type="text" placeholder="Procurar.." id="myInput" onkeyup="filterFunction()">
                        </ul>
                    </div>
                <div class="column dadosDBoverlay editar"
                    style="padding: 1% 2%; cursor: pointer;  color: white; background-color: #2B92F6;"
                    type="submit" value="editar" onclick="overlayOn('newMaterialOverlay')">cadastrar
                </div>
                <div class="column7 dadosDBoverlay editar"
                    style="padding: 1% 2%; cursor: pointer; margin-left: 3%; margin-top: 0%; color: white; background-color: #2B92F6;"
                    type="submit" value="editar" onclick="overlayOn('addCustosOverlay')">adicionar custos
                </div>
            </div>

            <div class="row" style="align-items: baseline; margin-top: 1%; gap: 3%;">
                <div class="column tabela">
                    <div class="row" style="text-align: center;">
                        <p class="column5 tabelaCabecalho">material</p>
                        <p class="column2 tabelaCabecalho">qtd.</p>
                        <p class="column2 tabelaCabecalho">medida</p>
                        <p class="column2 tabelaCabecalho" style="color:transparent;">.</p>
                    </div>
                    <div id="tabelaMateriais" class="row6ConteudoTabela" style="margin-top: 0%;">
                    </div>
                </div>

                <div class="column tabela">
                    <div class="row" style="text-align: center;">
                        <p class="column6 tabelaCabecalho">custo</p>
                        <p class="column3 tabelaCabecalho">valor</p>
                        <p class="column3 tabelaCabecalho">%</p>
                        <p class="column2 tabelaCabecalho" style="color:transparent;">.</p>
                    </div>
                    <div id="tabelaCustos" class="row6ConteudoTabela" style="margin-top: 0%;">
                </div>
            </div>
        </div>
            <p style="margin-top:1%; font-size: 1.2em;" class="resultadoProduto" name="precoCusto" id="fpcusto">Preço de Custo R$ ${precoCustoTotal}</p>  
            <input style="margin-top:1%;" class="row dadosDBoverlay" onchange="calculaPrecoCustoTotal()" type="text" name="lucro" id="fpLucro" placeholder="lucro(%)">
            <p id="resultadoProduto" name="precoSugerido" class="row resultado">Preço Sugerido R$ 0,00</p>
            <input  class="row dadosDBoverlay" type="text" name="precoVenda" id="fpPreco" placeholder="preço de venda">
            <input class="btnSalvar" type="button" onclick="postProduto()" value="salvar" />
        `
    let produtoForm = document.getElementById('formProduto')
    if (produtoForm) {
        produtoForm.parentNode.removeChild(produtoForm);
        produtos.appendChild(itens)
    } else { { produtos.appendChild(itens) } }

    overlayOn('novoProdutoOverlay')
    //            .catch(err => console.log(err))
}
function alteraProduto(idProduto) {
    materiais = []
    custos = []
    fetchApi('/produtos/' + idProduto, 'GET')
        .then(response => response.json())
        .then(json => {
            const produtos = document.getElementById('novoProdutoOverlay')
            let itens = document.createElement("form")
            itens.id = "formProduto"
            itens.className = "containerForm"
            // itens.method = "POST"
            itens.style.gap = "3%"
            itens.innerHTML = `
                    <span class="closeForm" onclick="overlayOff('novoProdutoOverlay'), limpaListas()">x</span>
                    <input class="row dadosDBoverlay" type="text" name="nome" id="fpNome" value=${json.nome} required />
                    <input class="row dadosDBoverlay" type="text" name="descricao" id="fpDescricao" value=${json.descricao}>
                    <div class="row" style="gap: 3%;">
                        <input class="column dadosDBoverlay" type="number" onchange="calculaPrecoCustoTotal()" min=".25" step="0.25" name="tempo" id="fptempo"
                        value=${json.tempo} required />
                        <input class="column dadosDBoverlay" type="number" min="1" name="unidadeMensal" id="fpProducao"
                        value=${json.unidadeMensal} required />
                    </div>
                    <div class="row" style="gap: 0%;">
                        
                            <div class="column5 dropdownFilter btnFilter dadosDBoverlay" style="margin-right: 3%; justify-content: center; align-items: center;">
                                <span onclick="myFunctionFilter()" class="">Selecionar
                                    Material</span>
                                <ul id="myDropdownFilter" class="dropdown-content-filter" style="padding-left: 2%;">
                                    <input type="text" placeholder="Procurar.." id="myInput" onkeyup="filterFunction()">
                                </ul>
                            </div>
                        <div class="column dadosDBoverlay editar"
                            style="padding: 1% 2%; cursor: pointer;  color: white; background-color: #2B92F6;"
                            type="submit" value="editar" onclick="overlayOn('newMaterialOverlay')">cadastrar
                        </div>
                        <div class="column7 dadosDBoverlay editar"
                            style="padding: 1% 2%; cursor: pointer; margin-left: 3%; margin-top: 0%; color: white; background-color: #2B92F6;"
                            type="submit" value="editar" onclick="overlayOn('addCustosOverlay')">adicionar custos
                        </div>
                    </div>
        
                    <div class="row" style="align-items: baseline; margin-top: 1%; gap: 3%;">
                        <div class="column tabela">
                            <div class="row" style="text-align: center;">
                                <p class="column5 tabelaCabecalho">material</p>
                                <p class="column2 tabelaCabecalho">qtd.</p>
                                <p class="column2 tabelaCabecalho">medida</p>
                                <p class="column2 tabelaCabecalho" style="color:transparent;">.</p>
                            </div>
                            <div id="tabelaMateriais" class="row6ConteudoTabela" style="margin-top: 0%;">
                            </div>
                        </div>
        
                        <div class="column tabela">
                            <div class="row" style="text-align: center;">
                                <p class="column6 tabelaCabecalho">custo</p>
                                <p class="column3 tabelaCabecalho">valor</p>
                                <p class="column3 tabelaCabecalho">%</p>
                                <p class="column2 tabelaCabecalho" style="color:transparent;">.</p>
                            </div>
                            <div id="tabelaCustos" class="row6ConteudoTabela" style="margin-top: 0%;">
                        </div>
                    </div>
                </div>
                    <p style="margin-top:1%; font-size: 1.2em;" class="resultadoProduto" name="precoCusto" id="fpcusto">Preço de Custo ${precoCustoTotal}</p>  
                    <input style="margin-top:1%;" onchange="calculaPrecoCustoTotal()" class="row dadosDBoverlay" type="text" name="lucro" id="fpLucro" value=${json.lucro}>
                    <p id="resultadoProduto" name="precoSugerido" class="row resultado">${json.precoSugerido}</p>
                    <input  class="row dadosDBoverlay" type="text" name="precoVenda" id="fpPreco" value=${json.precoVenda}>
                    <input class="btnSalvar" type="button" onclick="putProduto(${json.idProduto})" value="salvar" />
                                `
            let produtoForm = document.getElementById('formProduto')
            if (produtoForm) {
                produtoForm.parentNode.removeChild(produtoForm);
                produtos.appendChild(itens)
            } else { { produtos.appendChild(itens) } }
            json.materiais.forEach(materialPut => {
                // console.log(materialPut)
                addMaterial(materialPut.idMaterial)
            })

            custoProdutoPut(json.despesas)
            // json.despesas.forEach(custosPut => {
            //     // console.log(materialPut)
            //     custoProdutoPut(json.despesas)
            // })
            overlayOn('novoProdutoOverlay')
            // produtoForm.reset()
        })
        .catch(err => console.log(err))
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
                        <input class="column2" style="border-style: none; font-size: 1.2vw; padding: 0%; margin-bottom: 0%; text-align: center; color: #8F959B;" type="number" min="1" name="producao" id="fpProducao"
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

    precoFinalTotal = (precoCustoTotal * (1 + (produto.lucro / 100)))

    putcustoTotal.innerText = 'Custo Total = ' + precoCustoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const putfinalTotal = document.getElementById('resultadoProduto')
    putfinalTotal.innerText = 'Preco Sugerido = ' + precoFinalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    //console.log(precoC.precoCustoTotal)
}


function deletaMaterial(idMaterial, nameMaterial) {
    var item = document.getElementById(idMaterial);
    item.parentNode.removeChild(item);
    delete materiais[nameMaterial]
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
    precoCustoTotal.materiais = []
    const responseProduto = await fetchApi('/produtos', 'POST', produto)
    const jsonProduto = await responseProduto.json()
    await putProduto(jsonProduto.idProduto)
    overlayOff('novoProdutoOverlay')
    limpaListas()
    produtoForm.reset()
    //limpaTodosProdutos()
    //carregaProdutosTodos()
    location.reload()
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
    console.log(produto)
    const responseProduto = await fetchApi('/produtos/' + idProduto, 'PUT', produto)
    const jsonProduto = await responseProduto.json()
    overlayOff('novoProdutoOverlay')
    limpaListas()
    produtoForm.reset()
    return { jsonProduto }
}



function custoProdutoPut(custo) {
    // custos = JSON.stringify(custo)
    // console.log(custo)
    custo.forEach(fila => {
        if (fila.valor == null ) { fila.valor = "" }
        if (fila.porcentagem == null) { fila.porcentagem = "" }
        custos.push(fila)
        overlayOff('addCustosOverlay')
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
        overlayOff('addCustosOverlay')
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
    overlayOff('newMaterialOverlay')
    newMaterialForm.reset()
})


function buscaCusto(){
    fetchApi('/produtos/custohora', 'GET')
            .then(async response => {
                custohora = await response.json()
                console.log(custohora)
                })
}
