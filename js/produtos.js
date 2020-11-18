fetchApi('/produto', 'GET')
    .then(response => response.json())
    .then(json => {
        //   for (const produto of json) {
        const produtos = document.getElementById('containerMain')
        console.log(json)
        json.forEach(item => {
            let itens = document.createElement("div")
            itens.className = "itemProduto"
            itens.innerHTML = `
            <img class="icon" src="imgs/productIcon.png" alt="Produto">
            <ul>
                <li><h4>${item.nome}</h4></li>
                <li><p class="descricao">${item.descricao}</p></li>
                <li><strong>Preço:&nbsp</strong><p class="preco">${item.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></li>
            </ul>
            `
            produtos.appendChild(itens)
        })
    })
    .catch(err => console.log(err))

const submitProduto = document.getElementById('submitProduto')

submitProduto.addEventListener('click',(event) => {
    event.preventDefault()
 
})