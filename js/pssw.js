/**
 * Minimalist Enterprise Password Generator
 * Refactorizado aplicando arquitectura limpia y convenciones BEM/Stitch.
 */

// ==========================================
// 1. DOM SELECTORS
// ==========================================
const outputInput = document.getElementById("passwordOutput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const copyIcon = document.getElementById("copyIcon");
const securityBar = document.getElementById("securityBar");

const lengthRange = document.getElementById("lengthRange");
const lengthDisplay = document.getElementById("lengthDisplay");

const checkUppercase = document.getElementById("checkUppercase");
const checkLowercase = document.getElementById("checkLowercase");
const checkSymbols = document.getElementById("checkSymbols");
const checkNumbers = document.getElementById("checkNumbers");

const errorMessageContainer = document.getElementById("errorMessage");

const openSavedBtn = document.getElementById("openSavedBtn");
const closeSavedBtn = document.getElementById("closeSavedBtn");
const savedModal = document.getElementById("savedModal");
const savedList = document.getElementById("savedList");

const toastTaskOK = document.getElementById("toastTaskOK");
const toastText = document.getElementById("toastText");

// ==========================================
// 2. STATE & CONSTANTS
// ==========================================
/** 
 * Caracteres disponibles, la fuente de verdad. 
 * Estructura original mantenida: [Mayúsculas, Minúsculas, Números, Símbolos]
 */
const characteres = [
  ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ["*", "&", "%", "#", "+", "-", "@", "/", ".", "_", "="]
];

let lastGeneratedPassword = "";

// ==========================================
// 3. EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  synchronizeLengthInputs();
  generatePassword();
});

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", () => {
  if (outputInput.value && outputInput.value !== "Cargando...") {
    copyToClipboard(outputInput.value);
    savePasswordToList(outputInput.value);
    animateCopyFeedback();
  }
});

if (openSavedBtn) openSavedBtn.addEventListener("click", openSavedModal);
if (closeSavedBtn) closeSavedBtn.addEventListener("click", closeSavedModal);

// Delegación de eventos para la lista dinámica de contraseñas guardadas
savedList.addEventListener("click", handleSavedListClick);

// ==========================================
// 4. FUNCTIONS
// ==========================================

/**
 * Sincroniza el input range con el span de visualización.
 */
function synchronizeLengthInputs() {
  lengthRange.addEventListener("input", () => {
    lengthDisplay.textContent = lengthRange.value;
    generatePassword(); // Generar automáticamente al mover el slider para feedback en tiempo real
  });
}

/**
 * Muestra el mensaje de error si no hay checkboxes seleccionados.
 */
function renderError(show) {
  // Limpieza segura sin innerHTML
  while (errorMessageContainer.firstChild) {
    errorMessageContainer.removeChild(errorMessageContainer.firstChild);
  }

  if (show) {
    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined";
    icon.textContent = "error";
    
    const text = document.createElement("span");
    text.textContent = "Selecciona al menos un tipo de carácter";
    
    errorMessageContainer.append(icon, text);
    outputInput.value = "";
    updateSecurityMeter("");
  }
}

/**
 * Genera la contraseña basada en las opciones seleccionadas.
 * Mantiene la lógica matemática original.
 */
function generatePassword() {
  let password = [];
  let charPools = [];

  // Recolectar pools de caracteres seleccionados
  if (checkUppercase.checked) charPools.push(characteres[0]);
  if (checkLowercase.checked) charPools.push(characteres[1]);
  if (checkNumbers.checked) charPools.push(characteres[2]);
  if (checkSymbols.checked) charPools.push(characteres[3]);

  if (charPools.length === 0) {
    renderError(true);
    return;
  }

  renderError(false);

  const length = Number(lengthRange.value);

  // Ciclo para elegir elementos al azar
  for (let i = 0; i < length; i++) {
    let selectedPool = charPools[Math.floor(Math.random() * charPools.length)];
    
    // Original logic: Si hay símbolos, se reduce temporalmente el pool 
    if (checkSymbols.checked) {
      selectedPool = charPools[Math.floor(Math.random() * (charPools.length - 1))];
      // Manejo de edge case si el único pool seleccionado es el de símbolos
      if (!selectedPool) selectedPool = charPools[0]; 
    }

    let charIndex = Math.floor(Math.random() * selectedPool.length);
    password.push(selectedPool[charIndex]);
  }

  // Insertar símbolos (1 cada 6 caracteres)
  if (checkSymbols.checked) {
    const symbolCount = Math.floor(length / 6);
    for (let i = 0; i < symbolCount; i++) {
      password.pop(); // Quita el último para mantener longitud
      let newPosition = Math.floor(Math.random() * password.length) + 1; // Evita símbolo al inicio
      let newSymbol = characteres[3][Math.floor(Math.random() * characteres[3].length)];
      password.splice(newPosition, 0, newSymbol);
    }
  }

  lastGeneratedPassword = password.join("");
  outputInput.value = lastGeneratedPassword;
  updateSecurityMeter(lastGeneratedPassword);
}

/**
 * Calcula y visualiza el nivel de seguridad de la contraseña.
 */
function updateSecurityMeter(password) {
  if (!securityBar) return;
  
  let score = 0;
  if (!password) {
    securityBar.style.width = "0%";
    return;
  }

  // Factor longitud (hasta 40 puntos)
  score += Math.min(password.length * 2, 40);

  // Variedad (15 puntos c/u)
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;

  securityBar.style.width = `${score}%`;

  // Colores dinámicos basados en CSS Variables
  if (score < 45) {
    securityBar.style.backgroundColor = "var(--error)";
  } else if (score < 75) {
    securityBar.style.backgroundColor = "var(--warning)";
  } else {
    securityBar.style.backgroundColor = "var(--success)";
  }
}

/**
 * Copia texto al portapapeles y muestra confirmación.
 * @param {string} text 
 */
function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast("Contraseña copiada");
  });
}

/**
 * Animación de feedback para el botón de copiar.
 */
function animateCopyFeedback() {
  copyBtn.classList.add("is-copied");
  const originalIcon = copyIcon.textContent;
  copyIcon.textContent = "check_circle";

  setTimeout(() => {
    copyBtn.classList.remove("is-copied");
    copyIcon.textContent = originalIcon;
  }, 2000);
}

/**
 * Agrega la contraseña a la lista del modal.
 * @param {string} passwordText 
 */
function savePasswordToList(passwordText) {
  if (!passwordText) return;

  const li = document.createElement("li");
  li.className = "modal__item";
  
  const spanValue = document.createElement("span");
  spanValue.className = "modal__item-value";
  spanValue.textContent = passwordText;
  
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "modal__item-actions";
  
  // Botón copiar en el modal
  const copyBtnModal = document.createElement("button");
  copyBtnModal.className = "action-copy";
  copyBtnModal.setAttribute("aria-label", "Copiar");
  copyBtnModal.title = "Copiar";
  
  const copyIconModal = document.createElement("span");
  copyIconModal.className = "material-symbols-outlined";
  copyIconModal.textContent = "content_copy";
  copyBtnModal.append(copyIconModal);
  
  // Botón eliminar en el modal
  const deleteBtnModal = document.createElement("button");
  deleteBtnModal.className = "action-delete";
  deleteBtnModal.setAttribute("aria-label", "Eliminar");
  deleteBtnModal.title = "Eliminar";
  
  const deleteIconModal = document.createElement("span");
  deleteIconModal.className = "material-symbols-outlined";
  deleteIconModal.textContent = "delete";
  deleteBtnModal.append(deleteIconModal);
  
  actionsDiv.append(copyBtnModal, deleteBtnModal);
  li.append(spanValue, actionsDiv);
  
  savedList.prepend(li); // Agregar al inicio de la lista
}

/**
 * Maneja los clics en la lista de contraseñas guardadas (delegación).
 * @param {Event} event 
 */
function handleSavedListClick(event) {
  const target = event.target;
  const button = target.closest("button");
  if (!button) return;

  const listItem = button.closest(".modal__item");
  const passwordValueSpan = listItem.querySelector(".modal__item-value");
  const passwordText = passwordValueSpan ? passwordValueSpan.textContent : "";

  if (button.classList.contains("action-copy")) {
    copyToClipboard(passwordText);
  } else if (button.classList.contains("action-delete")) {
    listItem.remove();
    showToast("Contraseña eliminada");
  }
}

/**
 * Abre el modal de contraseñas guardadas.
 */
function openSavedModal() {
  savedModal.classList.remove("modal--hidden");
  savedModal.setAttribute("aria-hidden", "false");
}

/**
 * Cierra el modal de contraseñas guardadas.
 */
function closeSavedModal() {
  savedModal.classList.add("modal--hidden");
  savedModal.setAttribute("aria-hidden", "true");
}

/**
 * Muestra el toast de confirmación temporalmente.
 * @param {string} message - El mensaje a mostrar.
 */
function showToast(message) {
  if (toastText) toastText.textContent = message;
  toastTaskOK.classList.add("toast--show");
  
  // Limpiar timeout anterior si existe
  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  
  window.toastTimeout = setTimeout(() => {
    toastTaskOK.classList.remove("toast--show");
  }, 2000);
}
