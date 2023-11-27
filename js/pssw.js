const slider = document.getElementById("numero");
const output = document.getElementById("valor");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
};

/** Caracteres disponibles, se puede agregar otro tipo de caracteres */
const characteres = [
    ["A","B","C","D","E","F","G","H","J","K","L","M","N",,"P","Q","R","S","T","U","V","W","X","Y","Z"],
    ["a","b","c","d","e","f","g","h","j","k","m","n","p","q","r","s","t","u","v","w","x","y","z"],
    ["/","*","&","%","$",".","!","#","+","-",";"],
    [1,2,3,4,5,6,7,8,9],
]

const textPssw = document.querySelector(".areaPssw-pssw")
const longPssw = document.querySelector("#valor")
const btnGenerate = document.querySelector("#generate");

/** Selectores para los checkbox de html */
const mayus = document.querySelector("#mayus");
const minus = document.querySelector("#minus");
const symbols = document.querySelector("#symbols");
const numbers = document.querySelector("#numbers")

/** Controlador de eventos */
btnGenerate.addEventListener("click", psswGenerate)

/** Funcion para generar contraseñas */
function psswGenerate(){
    
    /** pssw almacenara la contraseña generada al final del proceso y cWork representa los tpos de caracteres seleccionados */
    let pssw = [];
    let cWork = [];

    /** Validando checkboxes para tipos de caracteres */
    if(mayus.checked === true){
        cWork.push(characteres[0])
    }    
    
    if (minus.checked === true){
        cWork.push(characteres[1])
    }

    if(symbols.checked === true){
        cWork.push(characteres[2])
    }

    if(numbers.checked === true){
        cWork.push(characteres[3])
    }

    /** ciclo para elegir elementos al azar */
    let digit = 0
    while (digit < Number(longPssw.textContent)) {
        let typeCharacter = cWork[Math.floor(Math.random()*cWork.length)]
        let element = Math.floor(Math.random()*typeCharacter.length)

        digit++
        pssw.push(typeCharacter[element])
    }

    /** Insercion de contraseña generada hacia html */
    textPssw.value = pssw.join("")
}