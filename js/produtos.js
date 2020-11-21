//Quando Clicar no Button mudar o Show
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}


function myFunctionFilter() {
    fetchApi('/material', 'GET')
        .then(response => response.json())
        .then(json => {
            const materiais = document.getElementById('myDropdownFilter')
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
                if (document.getElementById(item.idMaterial)) {
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


fetchApi('/produtos', 'GET')
    .then(response => response.json())
    .then(json => {
        const produtos = document.getElementById('containerMain')
        json.forEach(item => {
            let itens = document.createElement("div")
            itens.className = "itemProduto"
            itens.innerHTML = `
                        <img class="iconProduto" src="imgs/productIcon.png" />
                        <div style="padding-left: 15%; padding-right: 15%;">
                            <h4>${item.nome}</h4>
                            <p class="descricao">${item.descricao}</p>
                            <span class="row"
                                style="justify-content: center; font-size: 1.3em; font-weight: bold;">Preço:&nbsp; <span
                                    style="font-weight: normal;">${item.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></span>
                        </div>
                        <img class="iconEditar" onclick="overlayOn('novoProdutoOverlay')" src="imgs/editIcon.png" />
                        <img class="iconLixeira" src="imgs/trashIcon.png" />
                        `
            produtos.appendChild(itens)
        })
    })
    .catch(err => console.log(err))


// fetchApi('/material', 'GET')
//     .then(response => response.json())
//     .then(json => {
//         const materiais = document.getElementById('myDropdownFilter')
//         json.forEach(item => {
//             let itens = document.createElement("div")
//             //itens.className = "dropdown-content-filter"
//             itens.innerHTML = `
//                     <li
//                     href="#${item.nome}" class="row margem" onclick="addMaterial(${item.idMaterial})"
//                     style="width: 98%; padding: 1%; margin-top: 1%; margin-bottom:  1%; color: gray;">
//                     ${item.nome}
//                     </li>
//                 `
//             materiais.appendChild(itens)
//         })
//     })
//     .catch(err => console.log(err))


function addMaterial(idMaterial) {
    document.getElementById("myDropdownFilter").classList.toggle("show");
    fetchApi('/material/' + idMaterial, 'GET')
        .then(response => response.json())
        .then(json => {
            if (!document.getElementById(idMaterial)) {
                const materialadd = document.getElementById('tabelaMateriais')
                // json.forEach(item => {
                let itens = document.createElement("div")
                itens.className = "rowTabela"
                itens.id = json.idMaterial
                itens.innerHTML = `
                        <p class="column7">${json.nome} </p>
                        <input class="column2" style="border-style: none; font-size: 1.2vw; padding: 0%; margin-bottom: 0%; text-align: center; color: #8F959B;" type="number" min="1" name="producao" id="fpProducao"
                    value="1" required />
                        <p class="column4">${json.unidadeMedida} </p>
                        <img class="column icon" style="cursor: pointer; height: 70%; padding: 1%; margin-right: 1%;"
                            src="imgs/trashIcon.png" onclick="deletaMaterial(${json.idMaterial})" />
                    `
                materialadd.appendChild(itens)
                // })
            }
            else
                alert("Material já foi inserido")
        })
        .catch(err => console.log(err))
}

function deletaMaterial(idMaterial) {
    var item = document.getElementById(idMaterial);
    item.parentNode.removeChild(item);
}

const produtoForm = document.getElementById('formProduto')
// const materiaisForm = document.getElementById('addMateriais')
const newMaterialForm = document.getElementById('novoMaterial')
const custoProdutoForm = document.getElementById('custoVariavel')
const errorMaterial = document.getElementById("errorMaterial")

const custos = []
const materiais = []

async function postProduto() {
    const produto = convertFormToArray(produtoForm)
    const responseProduto = await fetchApi('/produtos', 'POST', produto)
    const jsonProduto = responseProduto.json()
    custos.forEach(custo => custo['idProduto'] = jsonProduto.idProduto)
    const responseDespesaProduto = await fetchApi('/despesasDoProduto/lista', 'POST', custos)
    const jsonDespesaProduto = responseDespesaProduto.json()
    materiais.forEach(materiais => materiais['idProduto'] = jsonProduto.idProduto)
    const responseMateriais = await fetchApi('/materialproduto', 'POST', materiais)
    const jsonMateriais = responseMateriais.json()
    return { jsonProduto, jsonDespesaProduto, jsonMateriais }
}

produtoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    postProduto().catch(err => console.log(err))
    overlayOff('novoProdutoOverlay')
    produtoForm.reset()
})

// custoProdutoForm.addEventListener('submit', (event) => {
//     event.preventDefault()
//     custos.push(convertFormToArray(custoProdutoForm))
//     overlayOff('addCustosOverlay')
//     custoProdutoForm.reset()
// })

// materiaisForm.addEventListener('submit', (event) => {
//     event.preventDefault()
//     materiais.push(convertFormToArray(materiaisForm))
//     console.log(materiais)
//     overlayOff('addMateriaisOverlay')
//     materiaisForm.reset()
// })

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
    if (erro==false){
        custos.push(convertFormToArray(custoVariavel))
        console.log(custos)
        overlayOff('addCustosOverlay')
        const custoadd = document.getElementById('tabelaCustos')
        // json.forEach(item => {
        let itens = document.createElement("div")
        itens.className = "rowTabela"
        itens.id = custos.length-1
        itens.innerHTML = `
                            <p class="column6">${custosok.nome}</p>
                            <p class="column4">${custosok.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            <p class="column4" >${custosok.porcentagem}</p>
                            <img class="column icon" style="cursor: pointer; height: 70%; padding: 1%; margin-right: 1%;"
                                src="imgs/trashIcon.png" onclick="deletaCusto(${custos.length-1})" />
                             `
        custoadd.appendChild(itens)
        custoProdutoForm.reset()
    }

})

function deletaCusto(idCusto) {
    var item = document.getElementById(idCusto)
    item.parentNode.removeChild(item)
    delete custos[idCusto]
    console.log(custos)
}


// fetchApi('/despesasDoProduto', 'POST', custos)
//     .then(async response => {
//         if (!response.ok) {
//             const error = await response.json()
//             return error.errors.forEach(err => {
//                 let itens = document.createElement("span")
//                 itens.innerText = err.defaultMessage
//                 errorMaterial.appendChild(itens)
//             })
//         }
//     })
// overlayOff('addCustosOverlay')
// custoProdutoForm.reset()
// })

newMaterialForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const material = convertFormToArray(newMaterialForm)
    fetchApi('/material', 'POST', material)
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


/*
async function postProduto() {
    const response = await fetchApi('/produtos', 'POST', produto)
    const jsonProduto = await response.json();
    return json
}
async function postDespesaProduto() {
    const responseDespesaProduto = await fetchApi('/despesasDoProduto/lista', 'POST', custos)
    const jsonDespesaProduto = await response.json()
    return json
}
*/

/*
produtoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let idProduto
    const produto = convertFormToArray(produtoForm)

    fetchApi('/produtos', 'POST', produto)
        .then(response => {
            if (response.ok) {
                response.json().then(json => {
                    idProduto = json.idProduto
                    custos.forEach(custo => custo['idProduto'] = idProduto)

                    fetchApi('/despesasDoProduto/lista', 'POST', custos)
                    .then(response => response.json())
                    .catch(err => console.log(err))

                    fetchApi('/materialproduto', 'POST', materiais)
                    .then(response => response.json())
                    .catch(err => console.log(err))

                })
                    .catch(err => console.log(err))
            }
            return response.json()
        })
        .catch(err => console.log(err))
})

// produto erro = err.errors[0].defaultMessage
// produto erros = err.errors.forEach(err => console.log(err.defaultMessage))

custoProdutoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    custos.push(convertFormToArray(custoProdutoForm))
})

materiaisForm.addEventListener('submit', (event) => {
    event.preventDefault()
    materiais.push(convertFormToArray(materiaisForm))
})

newMaterialForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const newMaterial = convertFormToArray(newMaterialForm)

    fetchApi('/materiais', 'POST', newMaterial)
    .then(response => response.json)
    .catch(err => console.log(err))
})
*/
