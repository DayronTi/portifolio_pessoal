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


// BLOCO REFERENTE AO CARROSSEL DE "MEUS PROJETOS" (ARRASTAR COM MOUSE/TOQUE)
const projetosWrapper = document.getElementById("projetos-wrapper");
const projetoCards = Array.from(projetosWrapper.querySelectorAll(".projeto-card"));

let arrastando = false;
let arrastouDeVerdade = false;
let posInicialX = 0;
let scrollInicial = 0;

projetosWrapper.addEventListener("pointerdown", (evento) => {
    if (evento.pointerType !== "mouse") return; // toque já rola nativamente

    arrastando = true;
    arrastouDeVerdade = false;
    posInicialX = evento.clientX;
    scrollInicial = projetosWrapper.scrollLeft;
    projetosWrapper.classList.add("arrastando");
});

projetosWrapper.addEventListener("pointermove", (evento) => {
    if (!arrastando) return;

    const distancia = evento.clientX - posInicialX;

    if (Math.abs(distancia) > 5) {
        arrastouDeVerdade = true;
    }

    projetosWrapper.scrollLeft = scrollInicial - distancia;
});

function pararArraste() {
    arrastando = false;
    projetosWrapper.classList.remove("arrastando");
}

projetosWrapper.addEventListener("pointerup", pararArraste);
projetosWrapper.addEventListener("pointerleave", pararArraste);

// Evita abrir o modal da imagem quando o usuário estava arrastando o carrossel
projetosWrapper.addEventListener("click", (evento) => {
    if (arrastouDeVerdade) {
        evento.preventDefault();
        evento.stopPropagation();
    }
}, true);

// Anima o scrollLeft manualmente via requestAnimationFrame, sem depender do
// "scroll-behavior: smooth" nativo (que alguns navegadores/contextos ignoram).
function animarScrollHorizontal(elemento, destino, duracao) {
    const origem = elemento.scrollLeft;
    const distancia = destino - origem;
    const inicio = performance.now();

    function passo(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const suavizado = 1 - Math.pow(1 - progresso, 3);

        elemento.scrollLeft = origem + distancia * suavizado;

        if (progresso < 1) {
            requestAnimationFrame(passo);
        }
    }

    requestAnimationFrame(passo);
}

// Descobre qual card está mais próximo da posição atual de rolagem
function indiceProjetoAtual() {
    let indiceMaisProximo = 0;
    let menorDistancia = Infinity;

    projetoCards.forEach((card, indice) => {
        const distancia = Math.abs(card.offsetLeft - projetosWrapper.scrollLeft);

        if (distancia < menorDistancia) {
            menorDistancia = distancia;
            indiceMaisProximo = indice;
        }
    });

    return indiceMaisProximo;
}

// Setas do desktop: movem para o card anterior/seguinte
// (usa a posição real de cada card em vez de clientWidth, já que o gap
// entre os cards fazia a rolagem desalinhar a cada clique)
function moverProjeto(direcao) {
    const indiceAtual = indiceProjetoAtual();
    const novoIndice = Math.min(
        Math.max(indiceAtual + direcao, 0),
        projetoCards.length - 1
    );
    const destino = projetoCards[novoIndice].offsetLeft;

    projetosWrapper.style.scrollSnapType = "none";
    animarScrollHorizontal(projetosWrapper, destino, 400);

    setTimeout(() => {
        projetosWrapper.style.scrollSnapType = "";
    }, 450);
}

// Pequeno movimento automático para indicar que os cards podem ser arrastados
let dicaDeArrasteExibida = false;

const observadorProjetos = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting && !dicaDeArrasteExibida) {
            dicaDeArrasteExibida = true;

            // O scroll-snap "puxa" a posição de volta durante movimentos pequenos,
            // então ele é desligado só durante essa animação de dica.
            projetosWrapper.style.scrollSnapType = "none";

            animarScrollHorizontal(projetosWrapper, 60, 350);

            setTimeout(() => {
                animarScrollHorizontal(projetosWrapper, 0, 350);
            }, 450);

            setTimeout(() => {
                projetosWrapper.style.scrollSnapType = "";
            }, 900);
        }
    });
}, { threshold: 0.5 });

observadorProjetos.observe(projetosWrapper);

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










const menuMobile = document.getElementById('mobile-menu');
const menuMobileToggle = document.getElementById('mobile-menu-toggle');
const menuMobileIcon = menuMobileToggle.querySelector('i');

function menuShow() {
    if (menuMobile.classList.contains('open')) {
        fecharMenuMobile();
    } else {
        menuMobile.classList.add('open');
        menuMobileIcon.classList.remove('fa-bars');
        menuMobileIcon.classList.add('fa-xmark');
        menuMobileToggle.setAttribute('aria-expanded', 'true');
    }
}

function fecharMenuMobile() {
    menuMobile.classList.remove('open');
    menuMobileIcon.classList.remove('fa-xmark');
    menuMobileIcon.classList.add('fa-bars');
    menuMobileToggle.setAttribute('aria-expanded', 'false');
}

// Fecha o menu mobile ao clicar em um item de navegação
document.querySelectorAll('.mobile_menu .nav-iten a').forEach((link) => {
    link.addEventListener('click', fecharMenuMobile);
});

// Fecha o menu mobile ao clicar fora dele
document.addEventListener('click', (evento) => {
    const menuAberto = menuMobile.classList.contains('open');
    const cliqueForaDoMenu = !menuMobile.contains(evento.target) && !menuMobileToggle.contains(evento.target);

    if (menuAberto && cliqueForaDoMenu) {
        fecharMenuMobile();
    }
});

// Fecha o menu mobile ao pressionar Esc
document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
        fecharMenuMobile();
    }
});


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