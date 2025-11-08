// Alternar entre tema claro e escuro
function alterarTema() {
    const html = document.documentElement;
    const temaAtual = html.getAttribute('data-theme');
    const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', novoTema);
    
    const botaoTema = document.querySelector('.theme-toggle');
    botaoTema.textContent = novoTema === 'dark' ? '☀️' : '🌙';
}

// Funcionalidade de filtros de projeto
const botoesFiltr = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

botoesFiltr.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active de todos os botões
        botoesFiltr.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Pega o filtro selecionado
        const filtroSelecionado = btn.getAttribute('data-filter');
        
        // Filtra os projetos
        projectCards.forEach(card => {
            // Remove a classe animate para resetar animação
            card.classList.remove('animate');
            
            if (filtroSelecionado === 'all') {
                card.style.display = 'block';
                // Reaplica animação após um pequeno delay
                setTimeout(() => card.classList.add('animate'), 50);
            } else {
                const categorias = card.getAttribute('data-category');
                if (categorias && categorias.includes(filtroSelecionado)) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('animate'), 50);
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Pausar carrossel ao passar o mouse
const carrossel = document.querySelector('#socialCarousel');
if (carrossel) {
    carrossel.addEventListener('mouseenter', () => {
        bootstrap.Carousel.getInstance(carrossel).pause();
    });
    carrossel.addEventListener('mouseleave', () => {
        bootstrap.Carousel.getInstance(carrossel).cycle();
    });
}

// Função para enviar email e mostrar modal
function enviarEmail(evento) {
    evento.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const modal = document.getElementById('modalConfirmacao');
    
    // Simular envio de email (adicionar lógica real aqui)
    if (emailInput.value) {
        // Mostrar modal
        modal.classList.add('mostrar');
        
        // Limpar campo de email
        emailInput.value = '';
        
        // Esconder modal após 3 segundos
        setTimeout(() => {
            modal.classList.remove('mostrar');
        }, 3000);
    }
}

// Animação on scroll para cards de projetos
function animarCardsOnScroll() {
    const cards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adiciona delay progressivo para cada card
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Inicializar animação quando o DOM carregar
document.addEventListener('DOMContentLoaded', animarCardsOnScroll);

// Scroll suave para links âncora
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const destino = document.querySelector(this.getAttribute('href'));
        if (destino) {
            destino.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});