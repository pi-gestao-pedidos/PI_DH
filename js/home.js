const cardProdutos = document.getElementById('canvasProdutos').getContext('2d');
const cardMateriais = document.getElementById('canvasMateriais').getContext('2d');
const cardFluxo = document.getElementById('canvasFluxo').getContext('2d');

const produtosMax = document.getElementById('produtosChartMax').getContext('2d');
const materiaisMax = document.getElementById('materiaisChartMax').getContext('2d');
const fluxoMax = document.getElementById('fluxoChartMax').getContext('2d');

produtosChart(cardProdutos);
materiaisChart(cardMateriais);
fluxoChart(cardFluxo);

produtosChart(produtosMax);
materiaisChart(materiaisMax);
fluxoChart(fluxoMax);

function produtosChart(canvas) {
    new Chart(canvas, {
        type: 'pie',
        data: {
            datasets: [
                {
                    data: [10, 20, 30, 4],
                    backgroundColor: ['#FF0000', '#FFFF00', '#2580DB', '#FF0DEF'],
                }],
            labels: [
                'Produto1',
                'Produto2',
                'Produto3',
                'Produto4'
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Produtos'
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
                    label: 'Utilizado',
                    data: [10, 90, 50],
                    backgroundColor: '#FF0000',
                },
                {
                    label: 'Disponível',
                    data: [90, 10, 50],
                    backgroundColor: '#42B72A',
                }
            ],
            labels: ['material1', 'material1', 'material1']
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Materiais Disponíveis'
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }

    });
}

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
                    borderColor: '#42B72A',
                    backgroundColor: '#42B72A',
                },
                {
                    label: 'Saídas',
                    data: [0, 0, -1000, -1500, -1000, -1450],
                    borderColor: '#FF0000',
                    backgroundColor: '#FF0000',
                }],
            labels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out']
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Fluxo de caixa'
            }
        }
    });
}