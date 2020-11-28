const cardFluxo = document.getElementById('canvasFluxo').getContext('2d');

fluxoChart(cardFluxo);

function fluxoChart(canvas) {
    new Chart(canvas, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Saldo',
                    data: [0, 0, -800, 200, 1000, 450],
                    borderColor: '#2B92F6',
                    backgroundColor: '#2B92F6',
                    fill: false,
                    type: 'line'
                },
                {
                    label: 'Entradas',
                    data: [0, 0, 200, 1700, 2000, 1900],
                    borderColor: '#74B5F7',
                    backgroundColor: '#74B5F7',
                },
                {
                    label: 'Saídas',
                    data: [0, 0, -1000, -1500, -1000, -1450],
                    borderColor: '#144575',
                    backgroundColor: '#144575',
                }],
            labels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out']
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Fluxo de caixa'
            },
            legend: {
                display: true,
                position: 'right'
            }
        }
    });
}

const pedidosList = document.getElementById("pedidosData")

let pedidos

fetchApi('/pedidos', 'GET').then(res => res.json())
    .then(json => {
        pedidos = json
        pedidos.forEach(pedido => {
            let tr = document.createElement("tr")
            tr.setAttribute("onclick", "getProdutos(" + pedido.idPedido + ")")
            tr.innerHTML = `   
                <td>${pedido.idPedido}</td>
                <td>${pedido.pessoa.nome}</td>
                <td>R$ ${(pedido.total / 100).toFixed(2)}</td>
                <td>${pedido.entrega}</td>
                <td>${pedido.status}</td>
                `
            pedidosList.appendChild(tr)
        });
    })
    .catch(err => console.log(err))


function getProdutos(id) {
    overlayOn('pedidoOverlay')
    const pedido = pedidos[id - 1]
    const pedidoHeader = document.getElementById('pedidoHeader')
    const ulOld = document.getElementById('pedidoData')

    const produtosTotal = document.getElementById('produtosTotal')
    const descontoTotal = document.getElementById('descontoTotal')
    const pedidoTotal = document.getElementById('pedidoTotal')
    let sumProdutos = 0

    const ul = document.createElement('ul')
    ul.setAttribute('id', "pedidoData")
    ul.setAttribute('class', "w100")
    ul.innerHTML = `
            <li class="w100">
                <h5 class="">Pedido:</h5>
                <p id="idPedido">${pedido.idPedido}</p>
            </li>
            <li class="w50">
                <h5>Cliente:</h5>
                <p id="nomeCliente">${pedido.pessoa.nome}</p>
            </li>
            <li class="w50">
                <h5>CPF:</h5>
                <p id="indexCliente">${pedido.pessoa.cpf}</p>
            </li>
            <li class="w50">
                <h5>Email:</h5>
                <p id="emailCliente">${pedido.pessoa.email}</p>
            </li>
            <li class="w50">
                <h5>Telefone:</h5>
                <p id="telefoneCliente">${phonesHTML(pedido.pessoa.telefones)}</p>
            </li>
            <li class="w100">
                <h5>Endereço:</h5>
                ${adressesHTML(pedido.pessoa.enderecos)}
            </li>
            <li class="w50">
                <h5>Data do pedido:</h5>
                <p id="dataPedido">${pedido.pessoa.dataPedido}</p>
            </li>
            <li class="w50">
                <h5>Data de Entrega:</h5>
                <p id="dataEntrega">${pedido.pessoa.dataEntrega}</p>
            </li>           
        `
    //pedidoHeader.appendChild(ul)
    pedidoHeader.replaceChild(ul, ulOld)

    const detailsTable = document.getElementById('detailsTable')
    const oldprodutosList = document.getElementById("produtoData")
    const produtosList = document.createElement('tbody')
    produtosList.id = "produtoData"

    if (oldprodutosList) {
        detailsTable.replaceChild(produtosList, oldprodutosList)
    }

    pedido.produtos.forEach(item => {
        sumProdutos += item.quantidade * item.produto.precoVenda

        const tr = document.createElement("tr")
        tr.innerHTML = `
                    <td>${item.produto.idProduto}</td>
                    <td>${item.produto.nome}</td>
                    <td>R$ ${(item.produto.precoVenda)}</td>
                    <td>${item.quantidade}</td>
                    <td>R$ ${(item.quantidade * item.produto.precoVenda).toFixed(2)}</td>
                    `
        produtosList.appendChild(tr)
    });

    produtosTotal.textContent = "R$ " + sumProdutos.toFixed(2)
    if (pedido.desconto != null) descontoTotal.textContent = "R$ " + pedido.desconto.toFixed(2)
    if (pedido.total != null) pedidoTotal.textContent = "R$ " + pedido.total.toFixed(2)
}

function phonesHTML(phones) {
    if (phones.length == 0) return 'null'
    let list = ""
    for (let phone in phones) {
        list += "<p>"
        for (let key in phones[phone]) {
            if (!(key.includes('idPessoa') || key.includes('idTelefone'))) {
                if (key.includes('ddd')) {
                    list += "(" + phones[phone][key] + ") "
                } else {
                    list += phones[phone][key]
                }
            }
        }
        list += "</p>"
    }
    return list
}

function adressesHTML(adresses) {
    if (adresses.length == 0) return 'null'
    let list = ""
    for (let address in adresses) {
        list += "<p>"
        for (let key in adresses[address]) {
            if (!(key.includes('idEndereco') || key.includes('idPessoa') ||
                key.includes('cep') || key.includes('uf') || key == null))
                list += ", " + adresses[address][key]
            if (key.includes('cep'))
                list += "CEP: " + adresses[address][key]
            if (key.includes('uf'))
                list += " – " + adresses[address][key] + "."
        }
        list += "</p>"
    }
    return list
}