//Quando Clicar no Button mudar o Show
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}


function myFunctionFilter() {
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
            <img class="icon" src="imgs/productIcon.png" alt="Produto">
            <ul>
                <li><h4>${item.nome}</h4></li>
                <li><p class="descricao">${item.descricao}</p></li>
                <li><strong>Preço:&nbsp</strong><p class="preco">${item.precoVenda/*.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })*/}</p></li>
            </ul>
            `
            produtos.appendChild(itens)
        })
    })
    .catch(err => console.log(err))

const produtoForm = document.getElementById('formProduto')
const materiaisForm = document.getElementById('addMateriais')
const newMaterialForm = document.getElementById('novoMaterial')
const custoProdutoForm = document.getElementById('custoVariavel')
const errorMaterial = document.getElementById("errorMaterial")

const custos = []
const materiais = []

async function postProduto() {
    const produto = convertFormToArray(produtoForm)
    const responseProduto = await fetchApi('/produtos', 'POST', produto)
    const jsonProduto = await responseProduto.json()
    custos.forEach(custo => custo['idProduto'] = jsonProduto.idProduto)
    const responseDespesaProduto = await fetchApi('/despesasDoProduto/lista', 'POST', custos)
    const jsonDespesaProduto = responseDespesaProduto.json()
    materiais.forEach(materiais => materiais['idProduto'] = jsonProduto.idProduto)
    const responseMateriais = await fetchApi('/materialproduto', 'POST', materiais)
    const jsonMateriais = responseMateriais.json()
    return {jsonProduto, jsonDespesaProduto, jsonMateriais}
}

produtoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    postProduto().catch(err => console.log(err))
    overlayOff('novoProdutoOverlay')
    produtoForm.reset()
})

custoProdutoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    custos.push(convertFormToArray(custoProdutoForm))
    overlayOff('addCustosOverlay')
    custoProdutoForm.reset()
})

materiaisForm.addEventListener('submit', (event) => {
    event.preventDefault()
    materiais.push(convertFormToArray(materiaisForm))
    console.log(materiais)
    overlayOff('addMateriaisOverlay')
    materiaisForm.reset()
})


newMaterialForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const material = convertFormToArray(newMaterialForm)
    fetchApi('/materiais', 'POST', material)
        .then(async response => {
            if(!response.ok){
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
