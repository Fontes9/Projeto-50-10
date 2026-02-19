// 1. NAVEGAÇÃO ENTRE ABAS
function switchTab(tabId) {
    document.querySelectorAll('.section-view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    const targetSection = document.getElementById(tabId);
    if (targetSection) targetSection.classList.add('active');

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
    
    let hourlyRate = type === 'internal' ? 36 : 45;
    let finalPrice = (hourlyRate * duration) / 60;
    
    document.getElementById('priceDisplay').innerText = finalPrice.toFixed(2);
}

// 3. SUBMISSÃO DE FORMULÁRIO E ADIÇÃO À TABELA
document.getElementById('coachingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studio = document.getElementById('studioSelect').value;
    if(!studio) { alert("Selecione um estúdio!"); return; }

    const coachText = document.getElementById('coachType').options[document.getElementById('coachType').selectedIndex].text;
    const formatText = document.getElementById('classFormat').options[document.getElementById('classFormat').selectedIndex].text;
    
    alert("✅ Pedido enviado!\nAguarde a validação da direção (Máx. 48h).");
    
    const table = document.getElementById('requestTable');
    const newRow = table.insertRow(0);
    const today = new Date().toLocaleDateString('pt-PT');
    
    const uniqueId = 'status-' + Date.now();
    
    newRow.innerHTML = `
        <td>${today}</td>
        <td>Estúdio ${studio}</td>
        <td>${formatText}</td>
        <td>${coachText}</td>
        <td><span class="status-badge status-pending" id="${uniqueId}">Pendente</span></td>
        <td><button class="btn-outline" style="margin:0; padding: 5px;" onclick="confirmCompletion('${uniqueId}', this)">✓ Confirmar Conclusão</button></td>
    `;
});

// 4. DUPLA VALIDAÇÃO
function confirmCompletion(elementId, btnElement) {
    const badge = document.getElementById(elementId);
    if (badge) {
        badge.className = "status-badge status-approved";
        badge.style.backgroundColor = "#ffeaa7";
        badge.style.color = "#d35400";
        badge.innerText = "Aguardando Direção";
    }
    
    if(btnElement) {
        const parentTd = btnElement.parentElement;
        parentTd.innerHTML = '<span style="color: #d35400; font-weight: bold; font-size: 0.85rem;">Validado (Prof/Aluno)</span>';
    }
    
    alert("Aula confirmada por ti!\nNotificação enviada à coordenação para validação final e fecho da faturação.");
}

// 5. EXPORTAR TABELA PARA EXCEL (CSV)
function exportTableToCSV(filename) {
    let csv = [];
    let rows = document.querySelectorAll("#dataTable tr");
    
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");
        let colCount = cols.length - 1; 
        
        for (let j = 0; j < colCount; j++) {
            let text = cols[j].innerText.trim();
            row.push('"' + text + '"');
        }
        csv.push(row.join(";")); 
    }

    let csvFile = new Blob([csv.join("\n")], {type: "text/csv;charset=utf-8;"});
    let downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

// 6. VERIFICAÇÃO DE HORÁRIO (ABERTO/FECHADO)
function checkStatus() {
    const now = new Date();
    const day = now.getDay(); 
    const hour = now.getHours();
    const min = now.getMinutes();
    const timeDec = hour + (min/60); 

    document.querySelectorAll('.day-header').forEach(el => el.classList.remove('today'));
    if (day >= 1 && day <= 6) {
        const header = document.querySelector(`.day-header[data-day="${day}"]`);
        if(header) header.classList.add('today');
    }

    let isOpen = false;
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
    setInterval(checkStatus, 60000); 
};