// js/main.js
import { getCurrentUser, logoutUser, isAuthenticated } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const accountCircle = document.querySelector(".material-symbols-outlined");
  const header = document.querySelector("header");
  let dropdownMenu = null; // Variável para armazenar o elemento do dropdown

  // Redirecionar se não estiver autenticado (exceto nas páginas de login/cadastro)
  const currentPage = window.location.pathname.split("/").pop();
  const authPages = ["login.html", "cadastrar.html"];

  if (!isAuthenticated() && !authPages.includes(currentPage)) {
    window.location.href = "login.html";
    return; // Interrompe a execução para evitar erros
  }

  // Esconder o ícone de perfil nas páginas de login/cadastro
  if (authPages.includes(currentPage)) {
    if (accountCircle) {
      accountCircle.style.display = "none";
    }
    return; // Não precisa configurar o dropdown nessas páginas
  }

  // Configurar o dropdown do perfil
  if (accountCircle) {
    accountCircle.style.cursor = "pointer"; // Adiciona cursor de ponteiro
    accountCircle.addEventListener("click", (event) => {
      event.stopPropagation(); // Impede que o clique se propague para o documento
      toggleDropdown();
    });

    // Fechar dropdown ao clicar fora
    document.addEventListener("click", (event) => {
      if (dropdownMenu && dropdownMenu.contains(event.target)) {
        return; // Não fecha se o clique for dentro do dropdown
      }
      if (dropdownMenu && dropdownMenu.classList.contains("show")) {
        dropdownMenu.classList.remove("show");
      }
    });
  }

  function toggleDropdown() {
    if (!dropdownMenu) {
      dropdownMenu = createDropdownMenu();
      header.appendChild(dropdownMenu); // Adiciona ao header para posicionamento
    }
    dropdownMenu.classList.toggle("show");
    updateDropdownContent();
  }

  function createDropdownMenu() {
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown-menu");
    dropdown.innerHTML = `
            <div class="dropdown-header"></div>
            <ul>
                <li><a href="#" id="logout-btn">Sair</a></li>
            </ul>
        `;

    // Adiciona evento de logout
    const logoutBtn = dropdown.querySelector("#logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        logoutUser();
        window.location.href = "login.html"; // Redireciona para a página de login
      });
    }
    return dropdown;
  }

  function updateDropdownContent() {
    const user = getCurrentUser();
    if (user && dropdownMenu) {
      const dropdownHeader = dropdownMenu.querySelector(".dropdown-header");
      if (dropdownHeader) {
        dropdownHeader.textContent = `Olá, ${user.name}!`;
      }
    }
  }

  // Posicionar o dropdown (opcional, pode ser feito via CSS também)
  // Se você quiser que ele apareça logo abaixo do ícone:
  if (accountCircle && dropdownMenu) {
    const rect = accountCircle.getBoundingClientRect();
    dropdownMenu.style.position = "absolute";
    dropdownMenu.style.top = `${rect.bottom + 5}px`; // 5px abaixo do ícone
    dropdownMenu.style.right = `${window.innerWidth - rect.right}px`; // Alinha à direita
  }
});
