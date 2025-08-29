// js/registros.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const listaregistro = document.getElementById("lista-registro");

  // Chave para armazenar os relatórios no localStorage
  const REGISTROS_STORAGE_KEY = "registros";

  // Função para carregar relatórios do localStorage
  function carregarRegistros() {
    const registrosSalvos = localStorage.getItem(REGISTROS_STORAGE_KEY);
    return registrosSalvos ? JSON.parse(registrosSalvos) : [];
  }

  // Função para salvar relatórios no localStorage
  function salvarRegistros(registros) {
    localStorage.setItem(REGISTROS_STORAGE_KEY, JSON.stringify(registros));
  }

  // Array para armazenar os relatórios em memória (inicializado com dados do localStorage)
  let registros = carregarRegistros();

  // Função para renderizar o histórico
  function renderizarHistorico() {
    listaregistro.innerHTML = ""; // Limpa o container
    if (registros.length === 0) {
      listaregistro.innerHTML = "<p>Nenhum relatório registrado ainda.</p>";
      return;
    }
    registros.forEach((registro) => {
      const card = document.createElement("div");
      card.classList.add("registro-card");
      card.innerHTML = `
        <h3>${registro.nome} (ID: ${registro.id})</h3>
        <p><strong>Data:</strong> ${registro.data}</p>
        <p><strong>Descrição:</strong> ${registro.descricao}</p>
      `;
      listaregistro.appendChild(card);
    });
  }

  // Evento de submissão do formulário
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Impede o envio padrão

    // Pega os valores dos inputs
    const nome = document.getElementById("nome").value;
    const id = document.getElementById("id").value;
    const data = document.getElementById("data").value;
    const descricao = document.getElementById("descricao").value;

    // Validação básica (já que o HTML tem required, mas para segurança)
    if (!nome || !id || !data || !descricao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Adiciona o novo relatório ao array
    registros.push({ nome, id, data, descricao });

    // Salva os relatórios atualizados no localStorage
    salvarRegistros(registros);

    // Renderiza o histórico atualizado
    renderizarHistorico();

    // Limpa o formulário
    form.reset();
  });

  // Renderiza o histórico ao carregar a página
  renderizarHistorico();
});
