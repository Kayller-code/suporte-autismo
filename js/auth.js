// js/auth.js

const USER_STORAGE_KEY = "currentUser";
const USERS_STORAGE_KEY = "registeredUsers";

// Função para obter o usuário logado
export function getCurrentUser() {
  const user = localStorage.getItem(USER_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
}

// Função para fazer login
export function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return true;
  }
  return false;
}

// Função para registrar um novo usuário
export function registerUser(
  name,
  lastname,
  email,
  password,
  birthdate,
  gender
) {
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
  const userExists = users.some((u) => u.email === email);

  if (userExists) {
    return false; // Usuário já existe
  }

  const newUser = { name, lastname, email, password, birthdate, gender };
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return true;
}

// Função para fazer logout
export function logoutUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

// Função para verificar se o usuário está logado
export function isAuthenticated() {
  return getCurrentUser() !== null;
}
