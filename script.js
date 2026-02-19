// 1. NAVEGAÇÃO ENTRE ABAS
function switchTab(tabId) {
    // Esconder todas as secções
    document.querySelectorAll('.section-view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    // Mostrar a selecionada
    const targetSection = document.getElementById(tabId);
    if (targetSection) targetSection.classList.add('active');

    // Ativar botão correto
    let btnIndex = 0;
    if (tabId === 'schedule') btnIndex = 1;
    if (tabId === 'inventory') btnIndex = 2;
    
    const btns = document.querySelectorAll('.nav-btn');
    if (btns[btnIndex]) btns[btnIndex].classList.add('active');
}

// 2. CÁLCULO DE PREÇO COACHING
function calculatePrice() {
    const type = document.getElementById('coachType').value;
    const duration = parseInt(document.getElementById('duration').value);
    
    // 36€ interno, 45€ externo
    let hourlyRate = type === 'internal' ? 36 : 45;
    
    // Regra de três simples para minutos
    let finalPrice = (hourlyRate * duration) / 60;
    
    document.getElementById('priceDisplay').innerText = finalPrice.toFixed(2);
}

// 3. SUBMISSÃO DE FORMULÁRIO (SIMULAÇÃO)
document.getElementById('coachingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studio = document.getElementById('studioSelect').value;
    if(!studio) { alert("Selecione um estúdio!"); return; }

    alert("✅ Pedido enviado!\nAguarde a validação da direção (Máx. 48h).");
    
    // Adicionar visualmente à tabela
    const table = document.getElementById('requestTable');
    const newRow = table.insertRow(0);
    const today = new Date().toLocaleDateString('pt-PT');
    
    newRow.innerHTML = `
        <td>${today}</td>
        <td>Estúdio ${studio}</td>
        <td>${document.getElementById('coachType').options[document.getElementById('coachType').selectedIndex].text}</td>
        <td><span class="status-badge status-pending">Pendente Direção</span></td>
    `;
});

// 4. VERIFICAÇÃO DE HORÁRIO (ABERTO/FECHADO) & DESTAQUE NA GRELHA
function checkStatus() {
    const now = new Date();
    const day = now.getDay(); // 0=Dom, 1=Seg...
    const hour = now.getHours();
    const min = now.getMinutes();
    const timeDec = hour + (min/60); // Ex: 14h30 = 14.5

    // -- A. Destacar dia na Grelha --
    document.querySelectorAll('.day-header').forEach(el => el.classList.remove('today'));
    if (day >= 1 && day <= 6) {
        const header = document.querySelector(`.day-header[data-day="${day}"]`);
        if(header) header.classList.add('today');
    }

    // -- B. Verificar se a Escola está Aberta Agora --
    let isOpen = false;
    
    // Seg-Sex: 14:00 - 21:30 | Sab: 08:30 - 20:00
    if (day >= 1 && day <= 5) {
        if (timeDec >= 14 && timeDec < 21.5) isOpen = true;
    } else if (day === 6) {
        if (timeDec >= 8.5 && timeDec < 20) isOpen = true;
    }

    const badge = document.getElementById('currentStatus');
    if (isOpen) {
        badge.innerText = "Aberto Agora";
        badge.className = "status-badge status-approved";
    } else {
        badge.innerText = "Encerrado";
        badge.className = "status-badge status-closed";
    }
}

// INICIALIZAÇÃO
window.onload = function() {
    calculatePrice();
    checkStatus();
    // Atualizar o badge "Aberto/Fechado" a cada minuto
    setInterval(checkStatus, 60000);
};