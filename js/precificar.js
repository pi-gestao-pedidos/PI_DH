const newMaterialForm = document.getElementById('novoMaterial')
let materiais = []

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
    overlayOff('newMaterialOverlay')
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
                        <p class="column8">${json.nome} </p>
                        <input class="column2" style="border-style: none; font-size: 1.2vw; padding: 0%; margin-bottom: 0%; text-align: center; color: #8F959B;" type="number" min="1" name="producao" id="fpProducao"
                    value="1" onchange="alterarQuantidade(${materiais.length - 1}, event)" required />
                        <p class="column4">${json.unidadeMedida} </p>
                        <img class="column icon" style="cursor: pointer; height: 70%; padding: 1%; margin-right: 3%;"
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

function deletaMaterial(idMaterial, nameMaterial) {
    var item = document.getElementById(idMaterial);
    item.parentNode.removeChild(item);
    delete materiais[nameMaterial]
    calculaPrecoCustoTotal()
    // console.log(materiais)
}