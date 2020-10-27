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





const produtosDB = [
    {
        id_produto: 1,
        nome: "nome do produto",
        preco_venda: 0,
        quantidade: 0,
        total: 0
    }
]

for (let index = 0; index < 10; index++) produtosDB.push(produtosDB[0])

const pedidosDB = [
    {
        id_pedido: 0,
        cliente: "Nome do Cliente",
        total: 0,
        entrega: "00/00/0000",
        status: "Pendente"
    }
]

for (let index = 0; index < 10; index++) pedidosDB.push(pedidosDB[0])

const pedidosList = document.getElementById("pedidosData")

pedidosDB.forEach(pedido => {
    let tr = document.createElement("tr")
    tr.setAttribute("onclick", "overlayOn('pedidoOverlay')")
    //tr.onclick = overlayOn('pedidoOverlay')
    tr.innerHTML = `   
    <td>${pedido.id_pedido}</td>
    <td>${pedido.cliente}</td>
    <td>R$ ${(pedido.total/100).toFixed(2)}</td>
    <td>${pedido.entrega}</td>
    <td>${pedido.status}</td>
    `
    pedidosList.appendChild(tr)
});

const produtosList = document.getElementById("produtoData")

produtosDB.forEach(produto => {
    let tr = document.createElement("tr")
    tr.innerHTML=`
    <td>${produto.id_produto}</td>
    <td>${produto.nome}</td>
    <td>R$ ${(produto.preco_venda/100).toFixed(2)}</td>
    <td>${produto.quantidade}</td>
    <td>R$ ${(produto.total/100).toFixed(2)}</td>
    `
    produtosList.appendChild(tr)
});