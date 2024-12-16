
/** Caracteres disponibles, se puede agregar otro tipo de caracteres */
const characteres = [
  ["A","B","C","D","E","F","G","H","J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",],
  ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ["*", "&", "%", "#", "+", "-", "@", "/", ".", "_","=",],
  // ["/","!",";","O","0","i","1","?","¡","(","l",")","<",">"]
];

// Selectores
const pssw = document.querySelector(".areaPssw-pssw")
const textPssw = document.querySelector(".areaPssw-pssw");
const longPssw = document.querySelector("#valor");
const btnGenerate = document.querySelector("#generate");
const btnCopy = document.querySelector("#copy");
const error = document.querySelector(".error");
const securityColor = document.querySelector(".security-color-aply");
const iconOpenSavedPssw = document.querySelector("#iconOpenSavedPssw");
const containerSavedPssw = document.querySelector(".contentListPssw");
const iconCloseContainerSavedPssw = document.querySelector("#iconCloseContainerSavedPssw");
const ulListSavedPssw = document.querySelector(".listPssw");

/** Selectores para los checkbox de html */
const mayus = document.querySelector("#mayus");
const minus = document.querySelector("#minus");
const symbols = document.querySelector("#symbols");
const numbers = document.querySelector("#numbers");
// const special = document.querySelector("#special")

/** Controlador de eventos */
btnGenerate.addEventListener("click", psswGenerate);
document.addEventListener("DOMContentLoaded", psswGenerate);
document.addEventListener("DOMContentLoaded", psswLongSynchronizer);
btnCopy.addEventListener("click", copyText);
iconOpenSavedPssw.addEventListener("click", openContainerSavedPssw);
iconCloseContainerSavedPssw.addEventListener("click", closeContainerSavedPssw);
btnCopy.addEventListener("click", createItemPssw);
ulListSavedPssw.addEventListener("click", copyPsswFromList);
ulListSavedPssw.addEventListener("click", deletePsswFromList);

// Longitud de contraseña
function psswLongSynchronizer() {
  const rangeInput = document.querySelector('input[type="range"]');
  const numberInput = document.querySelector('input[type="number"]');
  
  // Sincronizar el valor del range con el number
  rangeInput.addEventListener('input', function() {
    numberInput.value = rangeInput.value; // Actualizar el number con el valor del range
  });
  
  // Sincronizar el valor del number con el range
  numberInput.addEventListener('input', function() {
    rangeInput.value = numberInput.value; // Actualizar el range con el valor del number
  });
};


/** Funcion para generar contraseñas */
function psswGenerate() {
  /** pssw almacenara la contraseña generada al final del proceso y cWork representa los tpos de caracteres seleccionados */
  let pssw = [];
  let cWork = [];

  /** Validando checkboxes para tipos de caracteres */
  if (mayus.checked === true) cWork.push(characteres[0]);
  if (minus.checked === true) cWork.push(characteres[1]);
  if (numbers.checked === true) cWork.push(characteres[2]);
  if (symbols.checked === true) cWork.push(characteres[3]);
  // if (special.checked === true) cWork.push(characteres[4])

  /** Validando que que almenos una opcion de caracteres este seleccionada */
  function textError() {
    if (error.children.length === 0) {
      const imgAlert = document.createElement("img");
      imgAlert.setAttribute("src", "./icons/notification.svg");

      const textError = document.createElement("span");
      textError.innerText = "Se debe seleccionar almenos un tipo de caracter";

      error.appendChild(imgAlert);
      error.appendChild(textError);
    }
  }

  /** Agrega un mensaje de error si no hay ningun input[type="checkbox"] seleccionado */
  if (cWork.length === 0) return textError();

  /** En caso de que el mensaje de error ya exista y se marque almenos un input[type="checkbox"] entonces al generar la contraseña borrara el mensaje de error*/
  if (cWork.length >= 1) {
    const imgElement = error.querySelector("img");
    const spanElement = error.querySelector("span");

    if (imgElement) error.removeChild(imgElement);
    if (spanElement) error.removeChild(spanElement);
  }

  const valueLongPssw = Number(longPssw.value);

  /** ciclo para elegir elementos al azar */
  for (let i = 0; i < valueLongPssw; i++) {
    let typeCharacter = cWork[Math.floor(Math.random() * cWork.length)];
    if (symbols.checked === true) typeCharacter = cWork[Math.floor(Math.random() * (cWork.length - 1))];

    let indiceElement = Math.floor(Math.random() * typeCharacter.length);

    pssw.push(typeCharacter[indiceElement]);
    // return pssw;
  }

  /** Insertando simbolos segun la longitud de la contraseña, cada 6 caracteres se introduce un simbolo */
  if (symbols.checked === true) {
    const howManySymbols = Math.floor(valueLongPssw / 6);
    for (let i = 0; i < howManySymbols; i++) {
      pssw.pop();
      let newPosition = Math.floor(Math.random() * pssw.length) + 1; //con el +1 se evita que la contraseña inicie con simbolo
      let newElement = characteres[3][Math.floor(Math.random() * characteres[3].length)];

      pssw.splice(newPosition, 0, newElement);
      // return pssw;
    }
  }

  textPssw.value = pssw.join("");

  securityColor.classList.remove("sec-medium-yellow", "sec-high-green", "sec-hightest-green");
  let secColor = undefined;
  if (valueLongPssw <= 12) {
    secColor = "sec-medium-yellow"
  } else if (valueLongPssw <= 17){
    secColor = "sec-high-green"
  } else {
    secColor = "sec-hightest-green"
  }
  securityColor.classList.add(secColor);

  showIconTaskOK ();
}

// Copiar contraseña generada
function copyText() {
  let textToCopy = textPssw.value;
  navigator.clipboard.writeText(textToCopy);

  showIconTaskOK ();
}


// Abre el cuadro de lista de contraseñas copiadas anteriormente
function openContainerSavedPssw () {
  if (containerSavedPssw.classList.contains("inactive") === true) {
    containerSavedPssw.classList.remove("inactive");    
  }
}


// Cierra el cuadro de lista de contraseñas copiadas anteriormente
function closeContainerSavedPssw () {
  if (containerSavedPssw.classList.contains("inactive") === false) {
    containerSavedPssw.classList.add("inactive");
  }
}


// Crea los li.itemPssw en la ul.listPssw => Crea los itemas que conforman la lista de contraseñas guardadas
function createItemPssw (event) {

  // Crea Icono para copiar pssw del ul.listPssw
  const iconCopy = document.createElement("img");
  iconCopy.classList.add("copyItemPssw")
  iconCopy.setAttribute("src", "./icons/copy.svg");

  // Crea Icono para eliminar pssw del ul.listPssw
  const iconDelete = document.createElement("img");
  iconDelete.classList.add("deleteItemPssw")
  iconDelete.setAttribute("src", "./icons/delete.svg");

  // crea div.action que contiene a iconos de copiar y eliminar pssw
  const divActions = document.createElement("div");
  divActions.classList.add("actions");

  // crea span.itemPsswValue
  const spanItemPsswValue = document.createElement("span");
  spanItemPsswValue.classList.add("itemPsswValue");
  spanItemPsswValue.innerText = pssw.value

  // Crea el li.itemPssw
  const liItemPssw = document.createElement("li");
  liItemPssw.classList.add("itemPssw");

  // Anidando elementos
  divActions.appendChild(iconCopy);
  divActions.appendChild(iconDelete);
  liItemPssw.appendChild(spanItemPsswValue);
  liItemPssw.appendChild(divActions);
  ulListSavedPssw.appendChild(liItemPssw);
}


// Copia las contraseñas del ul.listPssw
function copyPsswFromList(event) {
  if (event.target.classList.contains("copyItemPssw")) {
    let textToCopy = event.target.parentElement.parentElement.children[0].textContent;
    navigator.clipboard.writeText(textToCopy);
    showIconTaskOK ();
  }
}


// Elimina las contraseñas del ul.listPssw
function deletePsswFromList (event) {
  if (event.target.classList.contains("deleteItemPssw")){
    let itemPsswToDelete = event.target.parentElement.parentElement
    ulListSavedPssw.removeChild(itemPsswToDelete)
    showIconTaskOK ();
  }
}

// JavaScript para manejar el clic en los botones
function showIconTaskOK() {
  // Agregar la clase para la animación
  const icon = document.getElementById('iconTaskOK');
  icon.classList.remove('taskNone'); // Asegurarse de que se muestre
  icon.classList.add('taskOK'); // Activar la animación

  // Después de 1.4 segundos (el tiempo total de la animación), ocultar el icono
  setTimeout(() => {
    icon.classList.remove('taskOK');
    icon.classList.add('taskNone');
  }, 1050);
};
