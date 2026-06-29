// BLOCO RESPONSÁVEL PELA ANIMAÇÃO DE DIGITAÇÃO DO TEXTO NA HOME
const textos = [
    "Desenvolvedor RPA",
    "Desenvolvedor Python"
];

let textoAtual = 0;
let letraAtual = 0;
let apagando = false;

const elemento = document.getElementById("texto-digitando");

function digitar() {
    const texto = textos[textoAtual];

    if (!apagando) {
        elemento.innerHTML = texto.substring(0, letraAtual + 1);
        letraAtual++;

        if (letraAtual === texto.length) {
            apagando = true;
            setTimeout(digitar, 2000);
            return;
        }
    } else {
        elemento.innerHTML = texto.substring(0, letraAtual - 1);
        letraAtual--;

        if (letraAtual === 0) {
            apagando = false;
            textoAtual++;

            if (textoAtual >= textos.length) {
                textoAtual = 0;
            }
        }
    }

    setTimeout(digitar, apagando ? 50 : 100);
}

digitar();


// BLOCO REFERENTE A ANIMAÇÃO DE CARROSSEL EM "MEUS PROJETOS"
let projetoAtual = 0;

const projetos = document.querySelectorAll(".projeto-card");

function mostrarProjeto(index) {
    projetos.forEach((projeto) => {
        projeto.classList.remove("ativo");
    });

    if (index >= projetos.length) {
        projetoAtual = 0;
    } else if (index < 0) {
        projetoAtual = projetos.length - 1;
    } else {
        projetoAtual = index;
    }

    projetos[projetoAtual].classList.add("ativo");
}

function mudarProjeto(direcao) {
    mostrarProjeto(projetoAtual + direcao);
}

// ANIMAÇÃO DE POPUP
const modal = document.getElementById("modal-imagem");
const imagemModal = document.getElementById("imagem-modal");
const fechar = document.querySelector(".fechar-modal");

function abrirImagem(src) {
    modal.style.display = "flex";
    imagemModal.src = src;
}

fechar.onclick = function () {
    modal.style.display = "none";
};

modal.onclick = function (e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};










function menuShow() {
    const menuMobile = document.querySelector('.mobile_menu');
    const icon = document.querySelector('.fa-solid','.fa-bars');

    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        icon.classList.remove('fa-solid','fa-xmark')
        icon.classList.add('fa-solid','fa-bars');
    } else {
        menuMobile.classList.add('open');
        icon.classList.add('fa-solid','fa-xmark');
    }
}


function sobreMim() {
    // Selecionar elementos DOM uma única vez
    const divExperiencia = document.querySelectorAll('.experience_content div');
    const liExperiencia = document.querySelectorAll('.experience_content ul li');
    const divEducation = document.querySelectorAll('.education_content div');
    const liEducation = document.querySelectorAll('.education_content ul li');

    divExperiencia[0].classList.add('ativo');
    liExperiencia[0].classList.add('ativo');
    divEducation[0].classList.add('ativo');
    liEducation[0].classList.add('ativo');

    // Função genérica para alternar classes ativas em um conjunto de elementos
    function toggleActiveClass(elements, index) {
        elements.forEach((element) => {
            element.classList.remove('ativo');
        });
        elements[index].classList.add('ativo');
    }

    // Função para lidar com a experiência
    function slideShowExperience(index) {
        toggleActiveClass(divExperiencia, index);
        toggleActiveClass(liExperiencia, index);
    }

    // Função para lidar com a educação
    function slideShowEducation(index) {
        toggleActiveClass(divEducation, index);
        toggleActiveClass(liEducation, index);
    }

    // Adicionar ouvintes de evento aos itens da experiência
    liExperiencia.forEach((event, index) => {
        event.addEventListener('click', () => {
            slideShowExperience(index);
        });
    });

    // Adicionar ouvintes de evento aos itens de educação
    liEducation.forEach((event, index) => {
        event.addEventListener('click', () => {
            slideShowEducation(index);
        });
    });
}

sobreMim();

//Código pra aparecer e sumir sobre mim
var button = document.querySelector('.lerMais');

button.addEventListener('click', function() {
    var textoSobre = document.querySelector('.sobre_texto');
    textoSobre.classList.toggle('active');

    if (textoSobre.classList.contains('active')) {
        return button.textContent = 'Saber menos';
    } 

    button.textContent = 'Saber mais';
});







// CHATBOT
async function enviarPergunta() {

    const mensagens = document.getElementById("chat-mensagens");
    const input = document.getElementById("pergunta");

    const pergunta = input.value;

    if (!pergunta) return;

    mensagens.innerHTML += `
        <div class="user">
            ${pergunta}
        </div>
    `;

    input.value = "";

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/chat/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: pergunta
                })
            }
        );

        const data = await response.json();

        mensagens.innerHTML += `
            <div class="bot">
                ${data.resposta}
            </div>
        `;

        mensagens.scrollTop =
            mensagens.scrollHeight;

    } catch (erro) {

        mensagens.innerHTML += `
            <div class="bot">
                Não consegui me conectar ao servidor 😥
            </div>
        `;

        console.log(erro);
    }
}

function abrirFecharChat() {
    const chat = document.getElementById("chat-widget");
    chat.classList.toggle("ativo");
}