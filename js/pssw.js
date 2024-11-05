const slider = document.getElementById("numero");
const output = document.getElementById("valor");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
};

/** Caracteres disponibles, se puede agregar otro tipo de caracteres */
const characteres = [
  ["A","B","C","D","E","F","G","H","J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",],
  ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ["*", "&", "%", "#", "+", "-", "@", "/", ".", "_"],
  // ["/",".","!",";","o","O","0","i","1","?","¡","(","l",")","<",">","=","_"]
];

const textPssw = document.querySelector(".areaPssw-pssw");
const longPssw = document.querySelector("#valor");
const btnGenerate = document.querySelector("#generate");
const btnCopy = document.querySelector("#copy");
const error = document.querySelector(".error");
const securityColor = document.querySelector(".security-color-aply");

/** Selectores para los checkbox de html */
const mayus = document.querySelector("#mayus");
const minus = document.querySelector("#minus");
const symbols = document.querySelector("#symbols");
const numbers = document.querySelector("#numbers");
// const special = document.querySelector("#special")

/** Controlador de eventos */
btnGenerate.addEventListener("click", psswGenerate);
document.addEventListener("DOMContentLoaded", psswGenerate);
btnCopy.addEventListener("click", copyText);

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
      imgAlert.setAttribute(
        "src",
        "./icons/emergency_home_FILL0_wght400_GRAD0_opsz24.svg"
      );

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

  console.log(cWork);
  const valueLongPssw = Number(longPssw.textContent);

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
      let newPosition = Math.floor(Math.random() * pssw.length) - 2;
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
  securityColor.classList.add(secColor)
}

function copyText() {
  let textToCopy = textPssw.value;
  navigator.clipboard.writeText(textToCopy);
}
