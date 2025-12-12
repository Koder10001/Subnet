function update(){

    let ipDOM = document.querySelectorAll("#ip > input");
    let ipBinary = document.querySelectorAll("#ipBinary > input");
    let ipClass = document.querySelector("#ipClass")


    // update class, subnet mask and disable correct subnet mask

    let classBit = getClassBit();

    switch (classBit){
        case 8:
            ipClass.innerText = "Class A, 8 bit for network";
            break;
        case 16:
            ipClass.innerText = "Class B, 16 bit for network"
            break;
        case 24:
            ipClass.innerText = "Class C, 24 bit for network";
            break;
        default:
            ipClass.innerText = "IDK what to do here brother";
            break;
    }
    

    //to binary
    for(let i = 0 ; i < 4 ; i++){ // because 4 octet
        ipBinary[i].value = toBinary(parseInt(ipDOM[i].value));
    }

    
    updateSubnetMask(classBit, true)


}

function listSubnets(){
    let ipBinaryDOM = document.querySelectorAll("#ipBinary > input");
    let subnetMaskBinaryDOM = document.querySelectorAll("#subnetMaskBinary > input");

    let numOfClassBits = getClassBit()
    let numOfSubnetBits = getSubnetBits() - numOfClassBits;

    let ipBinary = "";
    let subnetMaskBinary = "";


    for(let i = 0 ; i < 4; i++ ){

        ipBinary += ipBinaryDOM[i].value;
        subnetMaskBinary += subnetMaskBinaryDOM[i].value;

    }

    let classBits = ipBinary.slice(0, numOfClassBits);
    
    for ( let i = 0 ; i < Math.pow(2,numOfSubnetBits); i++){

        let subnetBits = toBinary(i, numOfSubnetBits);

        let networkIDBits = ""
        let broadcastIPBits = ""

        for(let remainingBits = 0; remainingBits < 32 - numOfClassBits - numOfSubnetBits; remainingBits++){
            networkIDBits += "0";
            broadcastIPBits += "1";
        }

        let networkBits = classBits + subnetBits;

        let min = networkIDBits
        let max = broadcastIPBits
        min = min.split("");
        max = max.split("");
        min[min.length - 1] = "1"
        max[max.length - 1] = "0"
        min = min.join("")
        max = max.join("")

        console.log(networkBits + min);
        
        appendTable(networkBits + networkIDBits, networkBits + broadcastIPBits, networkBits + min, networkBits + max)
        
    }

}

function removeBits(bin, numOfBitsToKeep){

    bin = bin + "";
    let str = "";

    for(let i = 0; i < numOfBitsToKeep; i++){

        str = bin[7-i] + str;

    }   

    return str;
}

function getClassBit(){

    let ipDOM = document.querySelector("#ip > input");
    let classBit;

    if(ipDOM.value > 0 && ipDOM.value < 127 ){ // class A
        classBit = 8;
    }
    else if (ipDOM.value > 127 && ipDOM.value < 192){ //class B
        classBit = 16;
    }
    else if (ipDOM.value < 224){
        classBit = 24;
    }
    else {
        classBit = 32;
    }

    return classBit;

}

function getSubnetBits(){
    let subnetMaskBinary = document.querySelectorAll("#subnetMaskBinary > input");

    let numOfBits = 0;

    for(let i = 0 ; i < 4; i++){

        let str = subnetMaskBinary[i].value + "";
        for(let j = 0 ; j < 8; j++){
            numOfBits += parseInt(str[j])
        }

    }

    return numOfBits;

}

function updateSubnetMask(bit, isDisable = false){
    
    let subnetMask = document.querySelectorAll("#subnetMask > select");
    let subnetMaskBinary = document.querySelectorAll("#subnetMaskBinary > input");

    let i;
    for(i = 0; i < 4; i++){
        if(bit >= 0){
            if(bit >= 8){
                subnetMask[i].selectedIndex = 8;
                if(isDisable){
                    subnetMask[i].disabled = true;
                }
            }
            else{
                subnetMask[i].selectedIndex = bit;
                subnetMask[i].disabled = false;
            }
        }
        else {
            subnetMask[i].selectedIndex = 0;
            subnetMask[i].disabled = false;
        }
        subnetMaskBinary[i].value = toBinary(subnetMask[i].value);
        bit -= 8;
    }

    clearTable();
    listSubnets()

}

function toBinary(num, len = 8){
    let bin = "";
    // let flag = [128,64,32,16,8,4,2,1];

    for(let i = 0; i < len; i++){ // because 8 bit

        bitValue = Math.pow(2, len - i - 1)
        if(num >= bitValue){
            // num -= flag[i];
            num -= bitValue
            bin += "1"
        }
        else {
            bin += 0;
        }
    }
    return bin;
}

function toDecimal(bin){
    bin = bin + "";
    let num = 0;
    for(let i = 0; i < 8; i++){
        num += parseInt(bin[i]) * Math.pow( 2 , 7 - i );
    }
    return num;
}

function bitsToIP(bits){
    let ip = "";
    for(let i = 0; i < 4;i++){
        ip += toDecimal(bits.slice(i*8, 8+i*8));
        if(i!=3){
            ip += "."
        }
        
    }
    return ip;
}

function appendTable(network, broadcast, min, max){
    let table = document.querySelector("#IPTable");


    let tr = document.createElement("tr");
    let networkCell = document.createElement("td");
    networkCell.innerText = bitsToIP(network);
    let broadcastCell = document.createElement("td");
    broadcastCell.innerText = bitsToIP(broadcast);
    let rangeCell = document.createElement("td");
    rangeCell.innerText = bitsToIP(min) + " - " + bitsToIP(max);

    tr.appendChild(networkCell);
    tr.appendChild(broadcastCell);
    tr.appendChild(rangeCell);
    table.appendChild(tr);
}

function clearTable(){
    let table = document.querySelector("#IPTable");

    let tr = document.querySelectorAll("#IPTable > tr")
    for(let i = 0 ; i < tr.length; i++){
        table.removeChild(tr[i]);
    }
}

window.onload = ()=>{
    update();
}