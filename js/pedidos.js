let dia
let mes
let ano
let produtos = []
let data
let produtosSoma = 0
let produtosCusto
let produtosDesconto = 0
let produtosLucro = 0
let totalpedido = 0
let idCliente = 0
let pedidoForm = null
let cliente
let pedido

function limpaListas(){
     dia = null
     mes = null
     ano = null
     produtos = []
     data = null
     produtosSoma = 0
     produtosCusto = 0
     produtosDesconto = 0
     produtosLucro = 0
     totalpedido = 0
     idCliente= null
     pedidoForm=null
}

function dataAtual() {
    data = new Date()
    dia = data.getDate()
    dia = ("0" + dia).slice(-2);
    mes = data.getMonth()
    mes++
    mes = ("0" + mes).slice(-2);
    ano = data.getFullYear()
}


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

function produtosFilterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myProdutosInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("produtosDropdownFilter");
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

function clienteFilterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myClienteInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("clienteDropdownFilter");
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

function clienteFunctionFilter() {
    fetchApi('/clientes', 'GET')
        .then(response => response.json())
        .then(json => {
            let cliente = document.getElementById('clienteDropdownFilter')
            json.forEach(item => {
                if (!document.getElementById(item.idPessoa + 'filtro')) {
                    let itens = document.createElement("div")
                    itens.id = item.idPessoa + 'filtro'
                    //itens.className = "dropdown-content-filter"
                    itens.innerHTML = `
                    <li href="#${item.nome.toUpperCase()}" class="row margem cliente" onclick="addCliente(${item.idPessoa},'${item.nome.toUpperCase()}')"
                            style="width: 98%; padding: 1%; margin-top: 1%; margin-bottom:  1%; color: gray;">
                            ${item.nome.toUpperCase()}
                        </li>
                `
                    cliente.appendChild(itens)
                    console.log(item)
                }
            })
            json.forEach(item => {
                if (document.getElementById('cliente' + item.idPessoa)) {
                    var item = document.getElementById(item.idPessoa + 'filtro');
                    item.parentNode.removeChild(item);
                }
            })
        })
        .catch(err => console.log(err))
    document.getElementById("clienteDropdownFilter").classList.toggle("show");
}


function produtosFunctionFilter() {
    fetchApi('/produtos', 'GET')
        .then(response => response.json())
        .then(json => {
            let produtos = document.getElementById('produtosDropdownFilter')
            json.forEach(item => {
                if (!document.getElementById(item.idProduto + 'filtro')) {
                    let itens = document.createElement("div")
                    itens.id = item.idProduto + 'filtro'
                    //itens.className = "dropdown-content-filter"
                    itens.innerHTML = `
                    <li
                    href="#${item.nome}" class="row margem" onclick="addProduto(${item.idProduto})"
                    style="width: 98%; padding: 1%; margin-top: 1%; margin-bottom:  1%; color: gray;">
                    ${item.nome}
                    </li>
                `
                    produtos.appendChild(itens)
                }
            })
            json.forEach(item => {
                if (document.getElementById('produto' + item.idProduto)) {
                    var item = document.getElementById(item.idProduto + 'filtro');
                    item.parentNode.removeChild(item);
                }
            })
        })
        .catch(err => console.log(err))
    document.getElementById("produtosDropdownFilter").classList.toggle("show");
}

function novoPedido() {
    produtos = []
    const pedido = document.getElementById('pedidosOverlay')
    let itens = document.createElement("form")
    itens.id = "formPedido"
    // itens.className = "containerForm"
    // itens.method = "POST"
    itens.style.gap = "3%"
    itens.innerHTML = `
            <span class="fechar" onclick="mudarShow('pedidosOverlay')">x</span>
            <div class="row" style="height: 1%;">
                <img class="icon column" style="padding: 0%; margin: -2%; margin-right: 3%;"
                    src="imgs/orderIcon2.png" />
                <p class="column dadosDB">Pedido:</p>
                <p class="column2 dadosDBoverlay">NOVO</p>
                <div class="dropdown column5 " style="margin-left: 3%; justify-content: center; align-items: center;">
                    <input id="idStatus" name="status" type="button" onclick="myFunction()" class="dropbtn column5 dadosDBoverlay" value="Selecionar Status">
                    <ul id="myDropdown" class="dropdown-content" style="padding-left: 2%;">
                        <li href="#" class="row margem"
                            onclick="alteraStatus('FINALIZADO','gray')"
                            style="width: 98%; padding: 1% 40%; margin-top: 1%; cursor: pointer; margin-bottom:  1%; color: gray;">
                            FINALIZADO</li>
                        <li href="#" class="row margem"
                        onclick="alteraStatus('DISPONIVEL','green')"    
                        style="width: 98%; padding: 1% 40%; margin-bottom: 1%; cursor: pointer; color: green;">
                            DISPONIVEL</li>
                        <li href="#" class="row margem"
                        onclick="alteraStatus('EM PRODUÇÃO','blue')"    
                        style="width: 98%; padding: 1% 38%; margin-bottom: 1%; cursor: pointer; color: blue;">EM
                            PRODUÇÃO</li>
                        <li href="#" class="row margem"
                        onclick="alteraStatus('PENDENTE','red')"
                            style="width: 98%; padding: 1% 41%; margin-bottom: 1%; cursor: pointer; color: red;">
                            PENDENTE</li>
                    </ul>
                </div>
            </div>


            <div class="row" style="gap: 1%;">
                <div class="column dropdownFilter btnFilter dadosDBoverlay"
                    style="width: 50%; justify-content: center; align-items: center;">
                    <span id="nomeCliente" onclick="clienteFunctionFilter()" class="">Selecionar
                        Cliente</span>
                    <ul id="clienteDropdownFilter" class="dropdown-content-filter" style="padding-left: 2%;">
                        <input type="text" style="margin-bottom:5px;" placeholder="Procurar.." id="myClienteInput" onkeyup="clienteFilterFunction()">
                    </ul>
                </div>
                <div class="column dadosDBoverlay" >
                    <p class="row" style="justify-content: center;     padding: 0% 10%;">
                    Data Pedido:
                    
                    <input name="dataPedidos" type="date" disabled="true" value="${ano}-${mes}-${dia}" class="row dadosDBoverlay" style="border-style: none; width: 50%; text-align: right;" /required>
                    </p>
                    </div>
                
            </div>
            <div class="row" style="gap: 1%;">
                <div class="column dropdownFilter btnFilter dadosDBoverlay"
                                style="width: 50%; justify-content: center; align-items: center;">
                                <span onclick="produtosFunctionFilter()" class="">Selecionar
                                    Produtos</span>
                                <ul id="produtosDropdownFilter" class="dropdown-content-filter" style="padding-left: 2%;">
                                    <input type="text" placeholder="Procurar.." id="myProdutosInput" onkeyup="produtosFilterFunction()">
                                </ul>
                            </div>
                <!-- <div class="column dadosDBoverlay editar"
                    style="cursor: pointer; margin-top: 0%; padding: 0%; height: 100%; color: white; background-color: #2B92F6;"
                    type="button" value="editar" onclick="mudarShow('addProdutoOverlay')">adicionar produto</div> -->
                
                    <div class="column dadosDBoverlay" >
                    <p class="row" style="justify-content: center;     padding: 0% 10%;">
                    Data Entrega:
                    
                    <input name="dataEntrega" type="date" min="${ano}-${mes}-${dia}" class="row dadosDBoverlay" style="border-style: none; width: 50%; text-align: right;" /required>
                    </p>
                    </div>
            </div>
            <div class="row6 tabela" style="gap: 0%;">
                <!-- <p class="column tabela"></p> -->
                <div class="row" style="text-align: center;">
                    <p class="column5 tabelaCabecalho">Nome do Produto</p>
                    <p class="column2 tabelaCabecalho">Valor Unit. R$</p>
                    <p class="column2 tabelaCabecalho">Quant (unid)</p>
                    <p class="column2 tabelaCabecalho">Total (R$)</p>
                    <p class="column tabelaCabecalho" style="padding-right:3%"></p>
                </div>
                <div id="tabelaProdutos" class="row6ConteudoTabela">
                    
                </div>
            </div>
            <div class="row" style="gap: 3%; align-content: center;">
                <div class="column btnForm" onclick="editarValor()" style="margin-top: 0%;"><input class="btn editar" type="button"
                        value="editar valor" /></div>
                        <div cass="column">
                        <p id="descontoTotal" name="desconto" class="row" style="justify-content: center; color: #8F959B;">Desconto (%): 0</p>
                <p id="valorTotal" name="total" class="row" style="justify-content: center; font-size: 1.3em; color: #8F959B;">Valor Total: R$ 0,00</p>
                </div>
                <div class="column btnForm" onclick="postPedido(); mudarShow('pedidosOverlay')" style="margin-top: 0%;"><input class="btn salvar" style="width: 100%;"
                        type="button" value="salvar" /></div>
            </div>
        </form>`

    let pedidoForm = document.getElementById('formPedido')
    if (pedidoForm) {
        pedidoForm.parentNode.removeChild(pedidoForm);
        limpaListas()
        pedido.appendChild(itens)
    } else { { pedido.appendChild(itens) } }

    mudarShow('pedidosOverlay')
}

function addCliente(id, nome) {
    fetchApi('/clientes/'+id, 'GET')
        .then(response => response.json())
        .then(json => {
            cliente = json
            // console.log(cliente)
        })
        .catch(err => console.log(err))

    
    idCliente = id
    document.getElementById('nomeCliente').innerText = nome
    document.getElementById("clienteDropdownFilter").classList.toggle("show");
    // console.log(idCliente)
}

function addProduto(idProduto) {
    document.getElementById("produtosDropdownFilter").classList.remove("show");
    fetchApi('/produtos/' + idProduto, 'GET')
        .then(async response => {
            json = await response.json()
            if (!document.getElementById('produto' + idProduto)) {
                json.quantidade = 1
                produtos.push(json)
                console.log(produtos)
                const produtoadd = document.getElementById('tabelaProdutos')
                // json.forEach(item => {
                let itens = document.createElement("div")
                itens.className = "rowTabela"
                itens.id = 'produto' + json.idProduto
                itens.innerHTML = `
                <p class="column5">${json.nome}</p>
                <p class="column2">${json.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <input class="column2 margem" style="font-size: 1.2vw; padding: 0%; margin-bottom: 0%; text-align: center; color: #8F959B;" type="number" min="1"  step="1" name="quantidade" id="fpProducao"
                value="1" onchange="alterarQuantidade(${produtos.length - 1}, event)" required />
                <p id="prodValorTotal${json.idProduto}" name="prodValorTotal" class="column2">${json.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <img class="column icon" style="height: 70%; padding: 0%; margin-right: 1%;"
                    src="imgs/trashIcon.png" onclick="deletaProduto('produto${json.idProduto}', ${produtos.length - 1})" />
                        
                    `
                produtoadd.appendChild(itens)
                alteraTotalPedido()
                // if(awaitdocument.getElementById('tabelaProdutos')){calculaProdutoTotal()}
                // console.log(produtos)
                // })
            }
            else
                alert("Produto já foi inserido")
        })
        .catch(err => console.log(err))
}

function editarValor(){
    calculaProdutosTotais()
    const editarValor = document.getElementById('editarValorOverlay')
    let itens = document.createElement("form")
    itens.id = "formEditarValor"
    // itens.className = "containerForm"
    // itens.method = "POST"
    itens.style.gap = "3%"
    itens.innerHTML = `
            <span class="fechar" onclick="document.getElementById('editarValorOverlay').classList.toggle('editarValorOverlay'); mudarShow('editarValorOverlay')">x</span>
            <div class="row">
                <p id="produtosCusto" class="row dadosDB" style="justify-content: center;">Produtos: R$ 10,00</p>
            </div>
            <div class="row">
                <p id="produtosLucro" class="row dadosDB" style="justify-content: center;">Lucro: R$ 10,00</p>
            </div>
            <div class="row">
                <p class="row dadosDB">Desconto %:&nbsp;
                <input id="produtosDesconto" class="row dadosDB" value="0.00" type="number" step="0.01" min="0.00" onchange="calculaProdutosTotais()" style="justify-content: center; text-align:center"></p>
                </p>
                </div>
            <div class="row">   
                <p id="produtosTotal" class="row dadosDB" style="justify-content: center;">Valor Total: R$ 10,00</p>
            </div>
            <div class="row">
            </div>
            <span class="row btn salvar" style="width: 100%; justify-content: center;" onclick="document.getElementById('editarValorOverlay').classList.toggle('editarValorOverlay'); mudarShow('editarValorOverlay'); alteraTotalPedido()">salvar</span>
        `
        let valorForm = document.getElementById('formEditarValor')
    if (valorForm) {
        valorForm.parentNode.removeChild(valorForm);
        editarValor.appendChild(itens)
    } else { { editarValor.appendChild(itens) } }

    mudarShow('editarValorOverlay')
    document.getElementById('editarValorOverlay').classList.toggle("editarValorOverlay");
}



async function atualizaParaPost(pedidoForm){
    pedido = await convertFormToArray(pedidoForm)
    pedido.produtos = []
    pedido.status = document.getElementById('idStatus').value
    pedido.dataPedido = ano+"-"+mes+"-"+dia
    pedido.idPessoa = 2
    pedido.quantidade = parseInt(pedido.quantidade)
    pedido.total = totalpedido
    pedido.desconto = produtosDesconto
    return pedido
}



async function postPedido() {
    pedidoForm = document.getElementById('formPedido')
    // pedido = await convertFormToArray(pedidoForm)
    pedido = await atualizaParaPost(pedidoForm)
    
    // console.log(pedido)
    
    console.log(pedido)
    // console.log(cliente)
    const responsePedido = await fetchApi('/pedidos', 'POST', pedido)
    const jsonPedido = await responsePedido.json()
    await putPedido(jsonPedido.idPedido)
    // overlayOff('novoPedidoOverlay')
    pedidoForm.reset()
    // limpaTodosPedidos()
    //carregaPedidosTodos()
    //location.reload()
    return { jsonPedido }
}



async function putPedido(idPedido) {
    // event.preventDefault
    pedidoForm = document.getElementById('formPedido')
    const pedido = convertFormToArray(pedidoForm)
    produtos.forEach(produtos => produtos.idPedido = idPedido)
    pedido.produtos = produtos
    const responsePedido = await fetchApi('/pedidos/' + idPedido, 'PUT', pedido)
    const jsonPedido = await responsePedido.json()
    // overlayOff('novoPedidoOverlay')
    //limpaListas()
    //pedidoForm.reset()
    return { jsonPedido }
}








function mudarShow(id) {
    document.getElementById(id).classList.toggle("show");
}

function alteraStatus(status, color){
    let item = document.getElementById('idStatus')
    item.value = status
    item.style.backgroundColor = color
    item.style.color = "white"
    document.getElementById("myDropdown").classList.toggle("show");
}

function deletaProduto(idProduto, nameProduto) {
    let item = document.getElementById(idProduto)
    item.parentNode.removeChild(item)
    delete produtos[nameProduto]
    calculaProdutoTotal()
    // console.log(produtos)
}

function alterarQuantidade(posicao, event) {
    produtos[posicao].quantidade = event.target.value
    console.log(posicao)
    calculaProdutoTotal(posicao)
}

function alterarLucro(posicao, event) {
    produtos[posicao].lucro = event.target.value
    calculaProdutoTotal(posicao)
}


async function calculaProdutoTotal(posicao) {
    const total = ((produtos[posicao].precoVenda * produtos[posicao].quantidade))
    produtos[posicao].total = total
    console.log(total)
    const totalProdFinal = document.getElementById('prodValorTotal' + produtos[posicao].idProduto)
    console.log(totalProdFinal)
    totalProdFinal.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })


    produtosSoma = await produtos.filter(x => x.precoVenda > 0)
                                            .reduce((total, numero) => (total+(numero.precoVenda*numero.quantidade)), 0);
    produtosCusto = await produtos.filter(x => x.precoCusto > 0)
                                            .reduce((total, numero) => (total+(numero.precoCusto*numero.quantidade)), 0);
    produtosLucro = produtosSoma-produtosCusto

    totalpedido = produtosSoma

    const valorTotal = document.getElementById('valorTotal')
    valorTotal.innerText = 'Valor Total: '+produtosSoma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const descontoTotal = document.getElementById('descontoTotal')
        produtosDesconto = 0
        descontoTotal.innerText = 'Desconto (%): 0'
        pedidoForm = document.getElementById('formPedido')
}
    

async function calculaProdutosTotais(){

    produtosSoma = await produtos.filter(x => x.precoVenda > 0)
                                            .reduce((total, numero) => (total+(numero.precoVenda*numero.quantidade)), 0);
    produtosCusto = await produtos.filter(x => x.precoCusto > 0)
                                            .reduce((total, numero) => (total+(numero.precoCusto*numero.quantidade)), 0);
    produtosLucro = produtosSoma-produtosCusto

    const totalprodutosCusto = document.getElementById('produtosCusto')
    totalprodutosCusto.innerText = 'Custo: '+ produtosCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const totalprodutosDesconto = document.getElementById('produtosDesconto')
    // totalprodutosDesconto.value = 'Total: '+produtosSoma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const totalprodutosSoma = document.getElementById('produtosTotal')
    totalpedido = (produtosSoma*(1-(totalprodutosDesconto.value/100)))
    totalprodutosSoma.innerText = 'Total: '+(totalpedido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    produtosLucro = (produtosSoma*(1-(totalprodutosDesconto.value/100)))-produtosCusto
    const totalprodutosLucro = document.getElementById('produtosLucro')
    totalprodutosLucro.innerText = 'Lucro: '+produtosLucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    
    pedidoForm = document.getElementById('formPedido')
}

async function alteraTotalPedido(){

    produtosSoma = await produtos.filter(x => x.precoVenda > 0)
                                            .reduce((total, numero) => (total+(numero.precoVenda*numero.quantidade)), 0);
    produtosCusto = await produtos.filter(x => x.precoCusto > 0)
                                            .reduce((total, numero) => (total+(numero.precoCusto*numero.quantidade)), 0);
    if (totalpedido>0){
        const valorTotal = document.getElementById('valorTotal')
        valorTotal.innerText = 'Valor Total: '+totalpedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
    else{
        totalpedido = produtosSoma
        const valorTotal = document.getElementById('valorTotal')
        valorTotal.innerText = 'Valor Total: '+produtosSoma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
    }
        
    if (document.getElementById('produtosDesconto')){
        const descontoTotal = document.getElementById('descontoTotal')
        produtosDesconto = document.getElementById('produtosDesconto').value
        descontoTotal.innerText = 'Desconto (%):  '+(document.getElementById('produtosDesconto').value) 
    }
    else{const descontoTotal = document.getElementById('descontoTotal')
    produtosDesconto = 0
    descontoTotal.innerText = 'Desconto (%): 0'   
    
    pedidoForm = document.getElementById('formPedido')

    }

    
    
}






{/* <input class="column2 margem" style=" font-size: 1.2vw; padding: 0%; margin-bottom: 0%; text-align: center; color: #8F959B;" type="number" min="0.00" step="0.01" name="lucro" id="fpLucro"
                value="${json.lucro}" onchange="alterarLucro(${produtos.length - 1}, event)" required />

                <p class="column2 tabelaCabecalho">Lucro (R$)</p> */}

