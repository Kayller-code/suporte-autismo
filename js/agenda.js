// js/agenda.js

const horariosBase = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const dataInput = document.getElementById("data");
const horariosDiv = document.getElementById("horarios");
const horarioSelecionado = document.getElementById("horarioSelecionado");
const formAgendamento = document.getElementById("form-agendamento");
const listaConsultas = document.getElementById("lista-consultas");

// Chaves para armazenar no localStorage
const CONSULTAS_STORAGE_KEY = "consultasAgendadas";
const AGENDA_STORAGE_KEY = "agendaHorariosOcupados";

// Função para carregar consultas do localStorage
function carregarConsultas() {
  const consultasSalvas = localStorage.getItem(CONSULTAS_STORAGE_KEY);
  return consultasSalvas ? JSON.parse(consultasSalvas) : [];
}

// Função para salvar consultas no localStorage
function salvarConsultas(consultas) {
  localStorage.setItem(CONSULTAS_STORAGE_KEY, JSON.stringify(consultas));
}

// Função para carregar a agenda de horários ocupados do localStorage
function carregarAgenda() {
  const agendaSalva = localStorage.getItem(AGENDA_STORAGE_KEY);
  return agendaSalva ? JSON.parse(agendaSalva) : {};
}

// Função para salvar a agenda de horários ocupados no localStorage
function salvarAgenda(agenda) {
  localStorage.setItem(AGENDA_STORAGE_KEY, JSON.stringify(agenda));
}

// Consultas agendadas (inicializado com dados do localStorage)
let consultas = carregarConsultas();

// Armazena horários ocupados (dinâmico por data, inicializado com dados do localStorage)
let agenda = carregarAgenda();

// Função para gerar horários ocupados aleatoriamente (se não houver dados para a data)
function gerarHorariosOcupados(data) {
  if (!agenda[data]) {
    const qtd = Math.floor(Math.random() * 4); // até 3 horários ocupados
    const ocupados = [];

    while (ocupados.length < qtd) {
      const randomHora =
        horariosBase[Math.floor(Math.random() * horariosBase.length)];
      if (!ocupados.includes(randomHora)) {
        ocupados.push(randomHora);
      }
    }
    agenda[data] = ocupados;
    salvarAgenda(agenda); // Salva a nova agenda gerada
  }
  return agenda[data];
}

// Carregar horários
function carregarHorarios(data) {
  horariosDiv.innerHTML = "";

  const ocupados = gerarHorariosOcupados(data);

  horariosBase.forEach((hora) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = hora;

    if (ocupados.includes(hora)) {
      btn.classList.add("ocupado");
      btn.disabled = true;
    } else {
      btn.classList.add("livre");
      btn.addEventListener("click", () => selecionarHorario(btn, hora));
    }

    horariosDiv.appendChild(btn);
  });
}

// Selecionar horário
function selecionarHorario(botao, hora) {
  document
    .querySelectorAll(".horarios button")
    .forEach((b) => b.classList.remove("selecionado"));
  botao.classList.add("selecionado");
  horarioSelecionado.value = hora;
}

// Renderizar lista de consultas
function renderizarConsultas() {
  listaConsultas.innerHTML = "";

  if (consultas.length === 0) {
    listaConsultas.innerHTML = "<p>Nenhuma consulta agendada ainda.</p>";
    return;
  }

  consultas.forEach((c) => {
    const div = document.createElement("div");
    div.classList.add("consulta-card");
    div.innerHTML = `
      <p><strong>Paciente:</strong> ${c.nome} (ID: ${c.id})</p>
      <p><strong>Data:</strong> ${c.data}</p>
      <p><strong>Horário:</strong> ${c.horario}</p>
      <p><strong>Obs:</strong> ${c.observacoes || "Nenhuma"}</p>
    `;
    listaConsultas.appendChild(div);
  });
}

// Evento: mudar data
dataInput.addEventListener("change", (e) => {
  carregarHorarios(e.target.value);
});

// Evento: enviar formulário
formAgendamento.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const id = document.getElementById("id").value;
  const data = dataInput.value;
  const observacoes = document.getElementById("observacoes").value;
  const horario = horarioSelecionado.value;

  if (!horario) {
    alert("Selecione um horário antes de confirmar!");
    return;
  }

  // Adiciona consulta no array
  const novaConsulta = { nome, id, data, horario, observacoes };
  consultas.push(novaConsulta);
  salvarConsultas(consultas); // Salva as consultas atualizadas

  // Marca horário como ocupado
  if (!agenda[data]) agenda[data] = [];
  agenda[data].push(horario);
  salvarAgenda(agenda); // Salva a agenda atualizada

  // Atualiza tela
  carregarHorarios(data);
  renderizarConsultas();

  // Reset
  formAgendamento.reset();
  horarioSelecionado.value = "";
  horariosDiv.innerHTML = "";
});

// Renderiza as consultas ao carregar a página
renderizarConsultas();
