const slider = document.getElementById("numero");
const output = document.getElementById("valor");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
};

const characteres = [
    ["a","b","c","d","e","f","g","h","j","k","m","n","p","q","r","s","t","u","v","w","x","y","z"],
    ["A","B","C","D","E","F","G","H","J","K","L","M","N",,"P","Q","R","S","T","U","V","W","X","Y","Z"],
    [1,2,3,4,5,6,7,8,9],
    ["/","*","&","%","$",".","!","#","+","-",";"]
]

const textPssw = document.querySelector(".areaPssw-pssw")
const longPssw = document.querySelector("#valor")
const btnGenerate = document.querySelector("#generate");
btnGenerate.addEventListener("click", psswGenerate)

function psswGenerate(){
    let pssw = [];

    for(let i = 0; i <= Number(longPssw.textContent); i++){
        let typeCharacter = Math.ceil((Math.random()*4)) -1

        if(typeCharacter === 0){
            let element = Math.ceil(Math.random()*23) - 1
            pssw.push(characteres[0][element])
        }

        if(typeCharacter === 1){
            let element = Math.ceil(Math.random()*23) - 1
            pssw.push(characteres[1][element])
        }

        if(typeCharacter === 2){
            let element = Math.ceil(Math.random()*9) - 1
            pssw.push(characteres[2][element])
        }

        if(typeCharacter === 3){
            let element = Math.ceil(Math.random()*11) - 1
            pssw.push(characteres[3][element])
        }
    }

    textPssw.value = pssw.join("")
}