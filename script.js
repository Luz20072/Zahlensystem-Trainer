// ==========================================
// ELEMENTE
// ==========================================

const menu =
    document.getElementById("menu");

const training =
    document.getElementById("training");

const taskType =
    document.getElementById("taskType");

const taskElement =
    document.getElementById("task");

const answerInput =
    document.getElementById("answerInput");

const checkButton =
    document.getElementById("checkButton");

const nextButton =
    document.getElementById("nextButton");

const solutionButton =
    document.getElementById("solutionButton");

const solutionElement =
    document.getElementById("solution");

const feedback =
    document.getElementById("feedback");

const scoreElement =
    document.getElementById("score");

const backButton =
    document.getElementById("backButton");

const resultButtons =
    document.getElementById("resultButtons");

const restartButton =
    document.getElementById("restartButton");

const menuButton =
    document.getElementById("menuButton");


// ==========================================
// SPIELSTATUS
// ==========================================

let currentMode = null;

let currentTask = null;

let correctAnswers = 0;

let totalAnswers = 0;

let tasks = [];

let currentTaskIndex = 0;


// ==========================================
// MODI
// ==========================================

const modes = {

    "decimal-binary": {
        name: "Dezimal → Binär",
        from: "decimal",
        to: "binary"
    },

    "binary-decimal": {
        name: "Binär → Dezimal",
        from: "binary",
        to: "decimal"
    },

    "decimal-hex": {
        name: "Dezimal → Hexadezimal",
        from: "decimal",
        to: "hex"
    },

    "hex-decimal": {
        name: "Hexadezimal → Dezimal",
        from: "hex",
        to: "decimal"
    },

    "binary-hex": {
        name: "Binär → Hexadezimal",
        from: "binary",
        to: "hex"
    },

    "hex-binary": {
        name: "Hexadezimal → Binär",
        from: "hex",
        to: "binary"
    }

};


// ==========================================
// MODUS AUSWÄHLEN
// ==========================================

document
    .querySelectorAll(".mode-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentMode =
                    button.dataset.mode;

                startTraining();

            }

        );

    });


// ==========================================
// TRAINING STARTEN
// ==========================================

function startTraining() {

    correctAnswers = 0;

    totalAnswers = 0;

    currentTaskIndex = 0;

    generateTasks();

    menu.classList.add("hidden");

    training.classList.remove("hidden");

    showTask();

}


// ==========================================
// 10 AUFGABEN GENERIEREN
// ==========================================

function generateTasks() {

    tasks = [];

    const usedTasks = new Set();


    while (tasks.length < 10) {

        let modeKey =
            currentMode;


        // Bei gemischten Aufgaben
        // zufälligen Modus auswählen

        if (modeKey === "mixed") {

            const availableModes =
                Object.keys(modes);


            modeKey =
                availableModes[
                Math.floor(
                    Math.random() *
                    availableModes.length
                )
                ];

        }


        const mode =
            modes[modeKey];


        const decimalNumber =
            generateRandomNumber();


        let inputValue;


        if (mode.from === "decimal") {

            inputValue =
                decimalNumber;

        }

        else if (mode.from === "binary") {

            inputValue =
                decimalNumber.toString(2);

        }

        else if (mode.from === "hex") {

            inputValue =
                decimalNumber
                    .toString(16)
                    .toUpperCase();

        }


        const correctAnswer =
            convert(
                decimalNumber,
                mode.to
            );


        // Aufgabe eindeutig identifizieren

        const taskId =
            `${modeKey}-${decimalNumber}`;


        // Keine identische Aufgabe doppelt

        if (usedTasks.has(taskId)) {

            continue;

        }


        usedTasks.add(taskId);


        tasks.push({

            mode: modeKey,

            decimal: decimalNumber,

            input: inputValue,

            answer: correctAnswer

        });

    }

}


// ==========================================
// AUFGABE ANZEIGEN
// ==========================================

function showTask() {

    resetInterface();


    currentTask =
        tasks[currentTaskIndex];


    const mode =
        modes[currentTask.mode];


    taskType.textContent =
        mode.name;


    taskElement.textContent =
        formatNumber(
            currentTask.input,
            mode.from
        ) + " → ?";


    scoreElement.textContent =
        `Aufgabe ${currentTaskIndex + 1} / 10 | Richtig: ${correctAnswers}`;

}


// ==========================================
// ZUFALLSZAHL
// ==========================================

function generateRandomNumber() {

    const MIN = 10;

    const MAX = 0xFFF;


    return Math.floor(
        Math.random() *
        (MAX - MIN + 1)
    ) + MIN;

}


// ==========================================
// UMRECHNUNGEN
// ==========================================

function convert(decimal, target) {

    if (target === "decimal") {

        return decimal.toString();

    }


    if (target === "binary") {

        return decimal.toString(2);

    }


    if (target === "hex") {

        return decimal
            .toString(16)
            .toUpperCase();

    }

}


// ==========================================
// ANTWORT PRÜFEN
// ==========================================

checkButton.addEventListener(
    "click",
    checkAnswer
);


answerInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            checkAnswer();

        }

    }
);


function checkAnswer() {

    if (
        answerInput.value.trim() === ""
    ) {

        return;

    }


    const mode =
        modes[currentTask.mode];


    let userAnswer =
        normalizeAnswer(
            answerInput.value
        );


    let correctAnswer =
        normalizeAnswer(
            currentTask.answer
        );


    // ======================================
    // FÜHRENDE BINÄRNULLEN IGNORIEREN
    // ======================================

    if (mode.to === "binary") {

        userAnswer =
            userAnswer.replace(
                /^0+(?=1)/,
                ""
            );


        correctAnswer =
            correctAnswer.replace(
                /^0+(?=1)/,
                ""
            );

    }


    totalAnswers++;


    // ======================================
    // RICHTIG
    // ======================================

    if (
        userAnswer === correctAnswer
    ) {

        correctAnswers++;


        feedback.textContent =
            "Richtig!";


        feedback.style.color =
            "#16a34a";


        nextButton.classList.remove(
            "hidden"
        );


        checkButton.classList.add(
            "hidden"
        );


        answerInput.disabled = true;

    }


    // ======================================
    // FALSCH
    // ======================================

    else {

        feedback.textContent =
            `Leider falsch. Richtige Antwort: ${currentTask.answer}`;


        feedback.style.color =
            "#dc2626";


        solutionButton.classList.remove(
            "hidden"
        );


        nextButton.classList.remove(
            "hidden"
        );


        checkButton.classList.add(
            "hidden"
        );


        answerInput.disabled = true;

    }


    updateScore();

}


// ==========================================
// ANTWORT NORMALISIEREN
// ==========================================

function normalizeAnswer(answer) {

    return answer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "");

}


// ==========================================
// NÄCHSTE AUFGABE
// ==========================================

nextButton.addEventListener(
    "click",
    () => {

        currentTaskIndex++;


        if (
            currentTaskIndex >= 10
        ) {

            showResult();

            return;

        }


        showTask();

    }
);


// ==========================================
// LÖSUNGSWEG ANZEIGEN
// ==========================================

solutionButton.addEventListener(
    "click",
    () => {

        solutionElement.textContent =
            createSolution(currentTask);


        solutionElement.classList.remove(
            "hidden"
        );


        solutionButton.classList.add(
            "hidden"
        );

    }
);


// ==========================================
// LÖSUNGSWEG ERSTELLEN
// ==========================================

function createSolution(task) {

    const mode =
        modes[task.mode];


    const number =
        task.decimal;


    // ======================================
    // DEZIMAL → BINÄR
    // ======================================

    if (
        mode.from === "decimal" &&
        mode.to === "binary"
    ) {

        let value = number;

        const lines = [];


        while (value > 0) {

            const quotient =
                Math.floor(
                    value / 2
                );


            const remainder =
                value % 2;


            lines.push(
                `${value} ÷ 2 = ${quotient} Rest ${remainder}`
            );


            value = quotient;

        }


        return (
            `${number}₁₀\n\n` +

            lines.join("\n") +

            `\n\nReste von unten nach oben:\n\n` +

            `${task.answer}₂`
        );

    }


    // ======================================
    // BINÄR → DEZIMAL
    // ======================================

    if (
        mode.from === "binary" &&
        mode.to === "decimal"
    ) {

        const binary =
            task.input;


        const parts = [];

        const values = [];


        for (
            let i = 0;
            i < binary.length;
            i++
        ) {

            const exponent =
                binary.length - 1 - i;


            const bit =
                Number(binary[i]);


            const value =
                bit *
                Math.pow(
                    2,
                    exponent
                );


            parts.push(
                `${bit} · 2^${exponent}`
            );


            if (value > 0) {

                values.push(value);

            }

        }


        return (
            `${binary}₂\n\n` +

            `= ${parts.join(" + ")}\n\n` +

            `= ${values.join(" + ")}\n\n` +

            `= ${task.answer}₁₀`
        );

    }


    // ======================================
    // DEZIMAL → HEXADEZIMAL
    // ======================================

    if (
        mode.from === "decimal" &&
        mode.to === "hex"
    ) {

        let value = number;

        const lines = [];


        while (value > 0) {

            const quotient =
                Math.floor(
                    value / 16
                );


            const remainder =
                value % 16;


            const hexRemainder =
                remainder
                    .toString(16)
                    .toUpperCase();


            lines.push(
                `${value} ÷ 16 = ${quotient} Rest ${hexRemainder}`
            );


            value = quotient;

        }


        return (
            `${number}₁₀\n\n` +

            lines.join("\n") +

            `\n\nReste von unten nach oben:\n\n` +

            `${task.answer}₁₆`
        );

    }


    // ======================================
    // HEXADEZIMAL → DEZIMAL
    // ======================================

    if (
        mode.from === "hex" &&
        mode.to === "decimal"
    ) {

        const hex =
            task.input;


        const parts = [];

        const values = [];


        for (
            let i = 0;
            i < hex.length;
            i++
        ) {

            const digit =
                hex[i];


            const value =
                parseInt(
                    digit,
                    16
                );


            const exponent =
                hex.length - 1 - i;


            const result =
                value *
                Math.pow(
                    16,
                    exponent
                );


            parts.push(
                `${digit} · 16^${exponent}`
            );


            if (result > 0) {

                values.push(result);

            }

        }


        return (
            `${hex}₁₆\n\n` +

            `= ${parts.join(" + ")}\n\n` +

            `= ${values.join(" + ")}\n\n` +

            `= ${task.answer}₁₀`
        );

    }


    // ======================================
    // BINÄR → HEXADEZIMAL
    // ======================================

    if (
        mode.from === "binary" &&
        mode.to === "hex"
    ) {

        const binary =
            task.input;


        const padded =
            binary.padStart(
                Math.ceil(
                    binary.length / 4
                ) * 4,
                "0"
            );


        const groups =
            padded.match(
                /.{4}/g
            );


        const conversions =
            groups.map(
                group => {

                    const value =
                        parseInt(
                            group,
                            2
                        );


                    return (
                        `${group} = ` +
                        `${value.toString(16).toUpperCase()}`
                    );

                }
            );


        return (
            `${binary}₂\n\n` +

            `In Vierergruppen aufteilen:\n\n` +

            conversions.join("\n") +

            `\n\nErgebnis:\n\n` +

            `${task.answer}₁₆`
        );

    }


    // ======================================
    // HEXADEZIMAL → BINÄR
    // ======================================

    if (
        mode.from === "hex" &&
        mode.to === "binary"
    ) {

        const hex =
            task.input;


        const conversions =
            [...hex].map(
                digit => {

                    const binary =
                        parseInt(
                            digit,
                            16
                        )
                            .toString(2)
                            .padStart(
                                4,
                                "0"
                            );


                    return (
                        `${digit} = ${binary}`
                    );

                }
            );


        return (
            `${hex}₁₆\n\n` +

            `Jede Hexadezimalstelle entspricht vier Bits:\n\n` +

            conversions.join("\n") +

            `\n\nErgebnis:\n\n` +

            `${task.answer}₂`
        );

    }

}


// ==========================================
// ZAHLEN FORMATIEREN
// ==========================================

function formatNumber(value, type) {

    if (type === "decimal") {

        return `${value}₁₀`;

    }


    if (type === "binary") {

        return `${value}₂`;

    }


    if (type === "hex") {

        return `${value}₁₆`;

    }

}


// ==========================================
// STATISTIK AKTUALISIEREN
// ==========================================

function updateScore() {

    scoreElement.textContent =
        `Aufgabe ${currentTaskIndex + 1} / 10 | Richtig: ${correctAnswers}`;

}


// ==========================================
// ERGEBNIS
// ==========================================

function showResult() {

    const percentage =
        Math.round(
            (correctAnswers / 10) * 100
        );


    taskType.textContent =
        "Training abgeschlossen";


    taskElement.textContent =
        `${correctAnswers} / 10 richtig`;


    feedback.textContent =
        `Trefferquote: ${percentage} %`;


    feedback.style.color =
        "#16a34a";


    answerInput.classList.add(
        "hidden"
    );


    checkButton.classList.add(
        "hidden"
    );


    solutionButton.classList.add(
        "hidden"
    );


    nextButton.classList.add(
        "hidden"
    );


    resultButtons.classList.remove(
        "hidden"
    );


    scoreElement.textContent =
        "10 Aufgaben abgeschlossen";

}


// ==========================================
// NOCHMAL 10 AUFGABEN
// ==========================================

restartButton.addEventListener(
    "click",
    () => {

        startTraining();

    }
);


// ==========================================
// ANDEREN ÜBUNGSMODUS WÄHLEN
// ==========================================

menuButton.addEventListener(
    "click",
    () => {

        training.classList.add(
            "hidden"
        );


        menu.classList.remove(
            "hidden"
        );


        currentTask = null;

        tasks = [];

        currentTaskIndex = 0;

    }
);


// ==========================================
// INTERFACE ZURÜCKSETZEN
// ==========================================

function resetInterface() {

    answerInput.value = "";

    answerInput.disabled = false;


    answerInput.classList.remove(
        "hidden"
    );


    feedback.textContent = "";


    solutionElement.textContent = "";

    solutionElement.classList.add(
        "hidden"
    );


    solutionButton.classList.add(
        "hidden"
    );


    nextButton.classList.add(
        "hidden"
    );


    resultButtons.classList.add(
        "hidden"
    );


    checkButton.classList.remove(
        "hidden"
    );


    answerInput.focus();

}


// ==========================================
// ZURÜCK ZUM MENÜ
// ==========================================

backButton.addEventListener(
    "click",
    () => {

        training.classList.add(
            "hidden"
        );


        menu.classList.remove(
            "hidden"
        );


        currentTask = null;

        tasks = [];

        currentTaskIndex = 0;

    }
);