const cardFluxo = document.getElementById('fluxoCanvas').getContext('2d');
const cardPedidos = document.getElementById('pedidosCanvas').getContext('2d');
const cardProdutos1 = document.getElementById('produtos1Canvas').getContext('2d');
const cardProdutos2 = document.getElementById('produtos2Canvas').getContext('2d');
const cardMateriais = document.getElementById('materiaisCanvas').getContext('2d');
const cardClientes = document.getElementById('clientesCanvas').getContext('2d');

fluxoChart(cardFluxo);
pedidosChart(cardPedidos);
produtos1Chart(cardProdutos1);
produtos2Chart(cardProdutos2);
materiaisChart(cardMateriais);
clientesChart(cardClientes);


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
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return 'R$ '+ value.toFixed(2);
                    }
                }
            }
        }
    });
}


function pedidosChart(canvas) {
    new Chart(canvas, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Pedidos',
                    data: [0, 0, 10, 15, 10, 14],
                    borderColor: '#74B5F7',
                    backgroundColor: '#74B5F7',
                }],
            labels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out']
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Total de Pedidos'
            },
            legend: {
                display: false,
            }
        }
    });
}



function produtos1Chart(canvas) {
    new Chart(canvas, {
        type: 'horizontalBar',
        data: {
            datasets: [
                {
                    data: [31, 23, 17, 7, 3],
                    backgroundColor: '#2580DB',
                }],
            labels: ['Produto1', 'Produto2', 'Produto3', 'Produto4', 'Produto5']
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Margem de contribuição'
            },
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return value + '%';
                    }
                }
            }
        }
    });
}


function produtos2Chart(canvas) {
    new Chart(canvas, {
        type: 'pie',
        data: {
            datasets: [
                {
                    data: [31, 23, 17, 7, 3],
                    backgroundColor: ['#D9042B', '#2580DB', '#F56E07', '#03A62C', '#9C3BC2'],
                }],
            labels: ['Produto1', 'Produto2', 'Produto3', 'Produto4', 'Produto5']
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Produtos mais vendidos'
            },
            legend: {
                display: true,
                position: 'left'
            }
        }
    });
}

function materiaisChart(canvas) {
    new Chart(canvas, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Disponível',
                    data: [98, 96, 90, 90, 75, 50],
                    backgroundColor: '#144575',
                },
                {
                    label: 'Utilizado',
                    data: [2, 4, 10, 10, 25, 50],
                    backgroundColor: '#74B5F7',
                }
            ],
            labels: ['material1', 'material2', 'material3','material4', 'material5', 'material6']
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Materiais não utilizados'
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return value + '%';
                    }
                }
            }
        }

    });
}


function clientesChart(canvas) {
    new Chart(canvas, {
        type: 'horizontalBar',
        data: {
            datasets: [
                {
                    data: [3100, 2300, 1750, 700.90, 300.99],
                    backgroundColor: '#2580DB',
                }],
            labels: ['Cliente1', 'Cliente2', 'Cliente3', 'Cliente4', 'Cliente5']
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Principais clientes'
            },
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return 'R$ '+ value.toFixed(2);
                    }
                }
            }
        }
    });
}

const materiaisDB = [
    {
        id_material: 0,
        nome: "Material 0",
        quantidade: 0,
        unidade: "m",
    }
]

for (let index = 0; index < 10; index++) materiaisDB.push(materiaisDB[0])

const materiaisList = document.getElementById("materiaisData")

materiaisDB.forEach(material => {
    let tr = document.createElement("tr")
    tr.innerHTML = `   
    <td>${material.nome}</td>
    <td>${material.quantidade + material.unidade}</td>
    `
    materiaisList.appendChild(tr)
});