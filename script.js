let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
let genPassLength = document.getElementById('genLength');
let genRange = document.getElementById('genRange');
let genPassText = document.getElementById('genPass');
let num = document.getElementById('Num');
let lower = document.getElementById('Lower');
let upper = document.getElementById('Upper');
let symb = document.getElementById('Symb');
let genButton = document.getElementById('genButton');
let myForm = document.getElementById('myForm');
let copyText = document.getElementById('copy');
let copyTextMsg = document.getElementById('copyText');
let chekkers = document.querySelectorAll('.chekker');
let passReminder = document.getElementById('reminder');

//Change border color on how strong is generated password is...
let passStrength = function () {
    let passLen = genPassText.value.length;
    if (passLen <= 1) {
        genPassText.style.border = '8px solid grey';
    }
    if (passLen > 1 && passLen <= 4) {
        genPassText.style.border = '8px solid firebrick';
    }
    if (passLen > 4 && passLen <= 8) {
        genPassText.style.border = '8px solid coral';
    }
    if (passLen > 8 && passLen <= 12) {
        genPassText.style.border = '8px solid darkseagreen';
    }
    if (passLen > 12) {
        genPassText.style.border = '8px solid green';
    }
    return genPassText.style.border;
};

// changing randomChars by each checkbox function
let symbCheck = function () {
    let newVal;
    if (symb.checked) {
        if (upper.checked || lower.checked) {
            newVal = randomChars.concat('!@#$%^&*()').concat('!@#$%^&*()');
        } else {
            newVal = randomChars.concat('!@#$%^&*()');
        }
    }
    if (!symb.checked) {
        newVal = randomChars.replace(/[!@#$%^&*()]/g, '');
    }
    randomChars = newVal;
    passStrength();
    return randomChars;
};

let numCheck = function () {
    let newVal;
    if (num.checked) {
        if (upper.checked || lower.checked) {
            newVal = randomChars.concat('1234567890').concat('1234567890');
        } else {
            newVal = randomChars.concat('1234567890');
        }
    }
    if (!num.checked) {
        newVal = randomChars.replace(/[0-9]/g, '');
    }
    randomChars = newVal;
    passStrength();
    return randomChars;
};

let upperCheck = function () {
    let newVal;
    if (upper.checked) {
        newVal = randomChars.concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    } else {
        newVal = randomChars.replace('ABCDEFGHIJKLMNOPQRSTUVWXYZ', '');
    }
    randomChars = newVal;
    passStrength();
    return randomChars;
};

let lowerCheck = function () {
    let newVal;
    if (lower.checked) {
        newVal = randomChars.concat('abcdefghijklmnopqrstuvwxyz');
    } else {
        newVal = randomChars.replace('abcdefghijklmnopqrstuvwxyz', '');
    }
    randomChars = newVal;
    passStrength();
    return randomChars;
};

// checkboxes event on check
symb.addEventListener("change", symbCheck);
num.addEventListener("change", numCheck);
upper.addEventListener("change", upperCheck);
lower.addEventListener("change", lowerCheck);

// generate randomly chars from strings
function generatePassword(n) {
    let result = [];
    let symbArr = '!@#$%^&*()';
    let numArr = '1234567890';
    let upperArr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowerArr = 'abcdefghijklmnopqrstuvwxyz';
    let numRegEx = /[0-9]/;
    let symbRegEx = /[!@#$%^&*()]/;
    let upperRegEx = /[A-Z]/;
    let lowerRegEx = /[a-z]/;

    for (let i = 0; i < n; i++) {
        let random = randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        result.push(random);
    }

    let newResult = result.join('');

    if (n >= 4) {
        // if symbol type is checked but not includes - add symbol to password
        if (num.checked && !passContain(result, numRegEx)) {
            let newVal = newResult.replace(newResult[Math.floor(Math.random() * newResult.length)], numArr[Math.floor(Math.random() * numArr.length)]);
            return newVal;
        }

        if (symb.checked && !passContain(result, symbRegEx)) {
            let newVal = newResult.replace(newResult[Math.floor(Math.random() * newResult.length)], symbArr[Math.floor(Math.random() * symbArr.length)]);
            return newVal;
        }

        if (upper.checked && !passContain(result, upperRegEx)) {
            let newResult = result.join('');
            let newVal = newResult.replace(newResult[Math.floor(Math.random() * newResult.length)], upperArr[Math.floor(Math.random() * upperArr.length)]);
            return newVal;
        }

        if (lower.checked && !passContain(result, lowerRegEx)) {
            let newResult = result.join('');
            let newVal = newResult.replace(newResult[Math.floor(Math.random() * newResult.length)], lowerArr[Math.floor(Math.random() * lowerArr.length)]);
            return newVal;
        }
    }
    /*  if (n >= 4) {
         if (lower.checked && upper.checked && symb.checked && num.checked) {
             do {
                 let newResult = result.join('');
                 return newResult;
             } while (!passContain(newResult, lowerRegEx) ||
                 !passContain(newResult, upperRegEx) ||
                 !passContain(newResult, symbRegEx) ||
                 !passContain(newResult, numRegEx));
         }
     } */
    return result.join('');
}

// range and input values merge
function rangeValue() {
    genPassLength.value = genRange.value;
    genPassText.value = generatePassword(genPassLength.value);
    reminder(genPassText.value);
    passStrength();
}

function lengthValue() {
    genRange.value = genPassLength.value;
    genPassText.value = generatePassword(genPassLength.value);
    reminder(genPassText.value);
    passStrength();
}

// tracking range and input values
genRange.addEventListener("input", rangeValue);
genPassLength.addEventListener("input", lengthValue);

// generate password on button click and check if it's not empty
const onGenerateBtn = function (e) {
    e.preventDefault();
    if (!num.checked && !lower.checked && !upper.checked && !symb.checked) {
        return genPassText.placeholder = 'You must to choose the type!';
    }
    genPassText.value = generatePassword(genPassLength.value);
    passStrength();
    reminder(genPassText.value);
    return genPassText.value;
};
genButton.addEventListener('click', onGenerateBtn);

// check if passwords contains one of checkbox values...
function passContain(text, reg) {
    //let regEx = /[0-9]/;
    return reg.test(text);
}

//Copy the generated password functions + message
let copyFunc = function () {
    copyTextMsg.style.display = 'flex';
};

let copyFuncOut = function () {
    copyTextMsg.style.display = 'none';
};

let copyGenPass = function () {
    if (genPassText.value.length != 0) {
        navigator.clipboard.writeText(genPassText.value);
        genPassText.value = 'SUCCESSFULLY COPIED!';
    } else {
        genPassText.placeholder = 'NOTHING TO COPY!';
    }
};

copyText.addEventListener('mouseover', copyFunc);
copyText.addEventListener('mouseout', copyFuncOut);
copyText.addEventListener('click', copyGenPass);

// Reminder words for password:
function reminder(value) {
    let symbAll = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let symbAllArr = symbAll.split('');
    let symbAllWords = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel',
        'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo',
        'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'Xmas', 'Yankee', 'Zulu', 'ALFA', 'BRAVO',
        'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL',
        'INDIA', 'JULIETT', 'KILO', 'LIMA', 'MIKE', 'NOVEMBER', 'OSCAR', 'PAPA', 'QUEBEC', 'ROMEO',
        'SIERRA', 'TANGO', 'UNIFORM', 'VICTOR', 'WHISKEY', 'XMAS', 'YANKEE', 'ZULU'
    ];
    let remindPass = {};

    for (let i = 0; i < symbAllArr.length; i++) {
        remindPass[symbAllArr[i]] = symbAllWords[i];
    }

    let remindValue = [];

    for (let i = 0; i < value.length; i++) {
        if (passContain(value[i], /[a-zA-Z]/g)) {
            remindValue[i] = remindPass[value[i]];
        } else {
            remindValue[i] = value[i];
        }
    }

    passReminder.value = remindValue.join('  ');

    return passReminder.value;
}