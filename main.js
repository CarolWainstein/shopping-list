let listaDeItens = [];
let itemAEditar


const form = document.getElementById('form-itens');
const itensInput = document.getElementById('receber-item');
const ulItens = document.getElementById('lista-de-itens');
const ulItensComprados = document.getElementById('itens-comprados');
const listaRecuperada = localStorage.getItem('listaDeItens'); // "pega o arquivo json do local storage" (passo 3)

function atualizaLocalStorage() { // SALVAR NO LOCAL STORAGE (passao 1)

    localStorage.setItem("listaDeItens",JSON.stringify(listaDeItens))
}

if(listaRecuperada) { // PASSA O JSON PARA OBJETO, assim aparece na tela (passo 4)
    listaDeItens = JSON.parse(listaRecuperada);
    mostrarItem();
} else {
    listaDeItens = [];
}

form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    salvarItem();
    mostrarItem();

    itensInput.focus();
});

function salvarItem() {
    const comprasItem = itensInput.value;
    const checarDuplicados = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase()); // 'some'percorre todos os elementos do array

    if(checarDuplicados){
        alert('Item já existente!');
    } else {
        listaDeItens.push({
            valor: comprasItem,
            checar: false
        })
    }; 

    itensInput.value = '';
};

console.log(listaDeItens)

function mostrarItem() {
    ulItens.innerHTML = '';
    ulItensComprados.innerHTML = '';

    listaDeItens.forEach((elemento, index) => {
        if(elemento.checar) {

        ulItensComprados.innerHTML += `
        <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
            <div>
                <input type="checkbox" checked class="is-danger" />  
                <span class="itens-comprados is-size-5">${elemento.valor}</span>
            </div>
            <div>
                <i class="fa-solid fa-trash is-clickable deletar"></i>
            </div>
        </li>
        `

        } else {
        
        ulItens.innerHTML += `
        <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
            <div>
                <input type="checkbox" class="is-clickable" />
                <input type="text" class="is-size-5" value="${elemento.valor}" ${index != itemAEditar ? 'disabled' : ''}></input>
            </div>

            <div>
                ${ index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                <i class="fa-solid fa-trash is-clickable deletar"></i>
            </div>
        </li>
        `
        }
    });

    const inputsCheck = document.querySelectorAll('input[type="checkbox"]');

    inputsCheck.forEach(input => {
        input.addEventListener('click',(evento) => {
            const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
            listaDeItens[valorDoElemento].checar = evento.target.checked;
            mostrarItem();
        });
    });

    const deletarObjetos = document.querySelectorAll('.deletar');

    deletarObjetos.forEach(i => {
        i.addEventListener('click', (evento) => {
            valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
            listaDeItens.splice(valorDoElemento, 1); // splice serve para deletar, ou substituir elemento (colocando o subtituto como terceiro parametro) ou até mesmo acrescentar (só colocar 0 no segundo parametro).
            
            mostrarItem();
        });
    });

    const editarItens = document.querySelectorAll(".editar");

    editarItens.forEach(i => {
        i.addEventListener('click', (evento) => {
            itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value');

            mostrarItem();
        });
    });

    atualizaLocalStorage(); // chama a funçao de salvar no local storage (passo 2)

};



function salvarEdicao() {
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`);

    listaDeItens[itemAEditar].valor = itemEditado.value;
    itemAEditar = -1;
    
    mostrarItem();
};