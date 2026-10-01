const characterSets = {
    Upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    Lower: 'abcdefghijklmnopqrstuvwxyz',
    Num: '1234567890',
    Symb: '!@#$%^&*()'
};

const passwordInput = document.querySelector('#genPass');
const reminderInput = document.querySelector('#reminder');
const lengthInput = document.querySelector('#genLength');
const lengthRange = document.querySelector('#genRange');
const passwordForm = document.querySelector('.myForm');
const copyControls = [
    {
        button: document.querySelector('#copy'),
        input: passwordInput,
        message: document.querySelector('#copyText')
    },
    {
        button: document.querySelector('#copyReminder'),
        input: reminderInput,
        message: document.querySelector('#copyReminderText')
    }
];
const strengthLabel = document.querySelector('#strengthLabel');
const typeInputs = [...document.querySelectorAll('.chekker')];

const reminderLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const reminderWords = [
    'Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel',
    'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa',
    'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'Xmas',
    'Yankee', 'Zulu', 'ALFA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT',
    'GOLF', 'HOTEL', 'INDIA', 'JULIETT', 'KILO', 'LIMA', 'MIKE', 'NOVEMBER',
    'OSCAR', 'PAPA', 'QUEBEC', 'ROMEO', 'SIERRA', 'TANGO', 'UNIFORM', 'VICTOR',
    'WHISKEY', 'XMAS', 'YANKEE', 'ZULU'
];
const reminderWordByLetter = new Map(
    [...reminderLetters].map((letter, index) => [letter, reminderWords[index]])
);

function getSelectedCharacterSets() {
    return typeInputs
        .filter((input) => input.checked)
        .map((input) => characterSets[input.id]);
}

function secureRandomIndex(max) {
    const range = 0x100000000;
    const limit = range - (range % max);
    const value = new Uint32Array(1);

    do {
        crypto.getRandomValues(value);
    } while (value[0] >= limit);

    return value[0] % max;
}

function generatePassword(length, selectedSets) {
    const characterPool = selectedSets.join('');
    const characters = [];

    if (length >= selectedSets.length) {
        selectedSets.forEach((set) => {
            characters.push(set[secureRandomIndex(set.length)]);
        });
    }

    while (characters.length < length) {
        characters.push(characterPool[secureRandomIndex(characterPool.length)]);
    }

    for (let index = characters.length - 1; index > 0; index--) {
        const swapIndex = secureRandomIndex(index + 1);
        [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
    }

    return characters.join('');
}

function updatePasswordStrength() {
    const length = passwordInput.value.length;
    if (length === 0) {
        passwordInput.style.borderColor = 'grey';
        strengthLabel.textContent = '';
        strengthLabel.hidden = true;
        return;
    }

    const password = [...passwordInput.value];
    const usedSets = Object.values(characterSets).filter((set) =>
        password.some((character) => set.includes(character))
    );
    const alphabetSize = usedSets.reduce((total, set) => total + set.length, 0);
    const estimatedBits = length * Math.log2(alphabetSize);
    const levels = [
        { maxBits: 20, label: 'Very weak password', color: 'grey' },
        { maxBits: 36, label: 'Weak password', color: 'firebrick' },
        { maxBits: 60, label: 'Fair password', color: 'coral' },
        { maxBits: 80, label: 'Good password', color: 'darkseagreen' },
        { maxBits: Infinity, label: 'Strong password', color: 'green' }
    ];
    const level = levels.find(({ maxBits }) => estimatedBits < maxBits);

    passwordInput.style.borderColor = level.color;
    strengthLabel.textContent = level.label;
    strengthLabel.style.color = level.color;
    strengthLabel.hidden = false;
}

function updateReminder(password) {
    reminderInput.value = [...password]
        .map((character) => reminderWordByLetter.get(character) ?? character)
        .join('  ');
}

function generateAndDisplayPassword() {
    const selectedSets = getSelectedCharacterSets();

    if (selectedSets.length === 0) {
        passwordInput.value = '';
        passwordInput.placeholder = 'Select at least one character type';
        updateReminder('');
        updatePasswordStrength();
        return;
    }

    passwordInput.placeholder = 'Generate password';
    passwordInput.value = generatePassword(Number(lengthInput.value), selectedSets);
    updateReminder(passwordInput.value);
    updatePasswordStrength();
}

function syncLengthAndGenerate(event) {
    const min = Number(lengthInput.min);
    const max = Number(lengthInput.max);
    const requestedLength = Number(event.currentTarget.value);
    const length = Math.min(max, Math.max(min, requestedLength || min));

    lengthInput.value = length;
    lengthRange.value = length;
    generateAndDisplayPassword();
}

function handleGenerate(event) {
    event.preventDefault();
    generateAndDisplayPassword();
}

async function copyValue(input, message) {
    if (!input.value) {
        message.textContent = 'NOTHING TO COPY';
        return;
    }

    try {
        await navigator.clipboard.writeText(input.value);
        message.textContent = 'COPIED!';
    } catch {
        message.textContent = 'COPY FAILED';
    }
}

typeInputs.forEach((input) => input.addEventListener('change', updatePasswordStrength));
lengthInput.addEventListener('input', syncLengthAndGenerate);
lengthRange.addEventListener('input', syncLengthAndGenerate);
passwordForm.addEventListener('submit', handleGenerate);
copyControls.forEach(({ button, input, message }) => {
    button.addEventListener('click', () => copyValue(input, message));
    button.addEventListener('mouseover', () => {
        message.style.display = 'flex';
    });
    button.addEventListener('mouseout', () => {
        message.style.display = 'none';
        message.textContent = 'COPY!';
    });
});

updatePasswordStrength();