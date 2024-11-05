// Função para preencher os horários disponíveis
function preencherHorarios() {
    const horarioSelect = document.getElementById('horario');
    const dataSelecionada = document.getElementById('data').value;

    // Limpa os horários existentes
    horarioSelect.innerHTML = '<option value="" disabled selected>Escolha o horário</option>';

    // Consulta ao backend para obter os horários ocupados
    fetch(`/api/horarios-ocupados?data=${dataSelecionada}`)
        .then(response => response.json())
        .then(horariosOcupados => {
            const horariosDisponiveis = [
                '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
                '17:30', '18:00', '18:30', '19:00'
            ];

            horariosDisponiveis.forEach(horario => {
                if (!horariosOcupados.includes(horario)) {
                    const option = document.createElement('option');
                    option.value = horario;
                    option.textContent = horario;
                    horarioSelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Erro ao obter horários ocupados:', error));
}

// Função para agendar um serviço
async function agendar() {
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    const telefone = document.getElementById('telefone').value;

    if (!nome || !data || !horario || !telefone) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const response = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, data, horario, telefone })
    });

    const result = await response.json();
    if (response.ok) {
        document.getElementById('resultado').innerHTML = `<p>${result.message}</p>`;
        preencherHorarios(); // Atualiza os horários
    } else {
        alert(result.error);
    }
}

// Evento para atualizar os horários disponíveis quando a data for alterada
document.getElementById('data').addEventListener('change', preencherHorarios);
