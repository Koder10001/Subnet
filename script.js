function update(){

    let ipDOM = document.querySelectorAll("#ip > input");
    let convertedDOM = document.querySelectorAll("#binary > input");
    let ipClass = document.querySelector("#ipClass")

    // update IP class
    if(ipDOM[0].value > 0 && ipDOM[0].value < 127 ){ // class A
        ipClass.innerText = "Class A, 8 bit for network"
    }
    else if (ipDOM[0].value > 127 && ipDOM[0].value < 192){ //class B
        ipClass.innerText = "Class B, 16 bit for network"
    }
    else if (ipDOM[0].value < 224){
        ipClass.innerText = "Class C, 24 bit for network";
    }
    else {
        ipClass.innerText = "IDK what to do here brother";
    }

    //to binary
    

    for(let i = 0 ; i < 4 ; i++){ // because 4 octet
        convertedDOM[i].value = toBinary(parseInt(ipDOM[i].value));
    }

}

function toBinary(num){
    let bin = "";
    let flag = [128,64,32,16,8,4,2,1];

    for(let i = 0; i < 8; i++){ // because 8 bit

        if(num >= flag[i]){
            num -= flag[i];
            bin += "1"
        }
        else {
            bin += 0;
        }
    }
    return bin;
}

window.onload = ()=>{
    update();
}