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
    },

    "number-addition": {
        name: "Zahlensysteme addieren",
        from: "addition",
        to: "addition"
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


        // ======================================
        // GEMISCHTE AUFGABEN
        // ======================================

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


        // ======================================
        // ZAHLENSYSTEME ADDIEREN
        // ======================================

        if (modeKey === "number-addition") {

            const task =
                generateNumberAdditionTask(
                    usedTasks
                );


            if (!task) {

                continue;

            }


            tasks.push(task);

            continue;

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


        const taskId =
            `${modeKey}-${decimalNumber}`;


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
// ZAHLENSYSTEM-ADDITION ERZEUGEN
// ==========================================

function generateNumberAdditionTask(
    usedTasks
) {

    const formats = [
        "binary",
        "decimal",
        "hex"
    ];


    const firstFormat =
        formats[
        Math.floor(
            Math.random() *
            formats.length
        )
        ];


    const secondFormat =
        formats[
        Math.floor(
            Math.random() *
            formats.length
        )
        ];


    const resultFormat =
        formats[
        Math.floor(
            Math.random() *
            formats.length
        )
        ];


    const firstDecimal =
        Math.floor(
            Math.random() * 246
        ) + 10;


    const secondDecimal =
        Math.floor(
            Math.random() * 246
        ) + 10;


    const sum =
        firstDecimal +
        secondDecimal;


    const taskId =
        `addition-${firstDecimal}-${secondDecimal}-${firstFormat}-${secondFormat}-${resultFormat}`;


    if (usedTasks.has(taskId)) {

        return null;

    }


    usedTasks.add(taskId);


    return {

        mode: "number-addition",

        firstDecimal: firstDecimal,

        secondDecimal: secondDecimal,

        firstFormat: firstFormat,

        secondFormat: secondFormat,

        resultFormat: resultFormat,

        firstValue:
            formatValue(
                firstDecimal,
                firstFormat
            ),

        secondValue:
            formatValue(
                secondDecimal,
                secondFormat
            ),

        sumDecimal: sum,

        answer:
            formatValue(
                sum,
                resultFormat
            )

    };

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


    // ======================================
    // ZAHLENSYSTEM-ADDITION
    // ======================================

    if (
        currentTask.mode === "number-addition"
    ) {

        taskElement.innerHTML = `

            <div class="addition-task-display">

                <div>
                    ${formatNumber(
            currentTask.firstValue,
            currentTask.firstFormat
        )}
                </div>

                <div class="addition-operator">
                    +
                </div>

                <div>
                    ${formatNumber(
            currentTask.secondValue,
            currentTask.secondFormat
        )}
                </div>

                <div class="addition-equals">
                    =
                </div>

                <div class="addition-question">
                    ${formatNumber(
            "?",
            currentTask.resultFormat
        )}
                </div>

            </div>

        `;

    }

    // ======================================
    // NORMALE UMRECHNUNG
    // ======================================

    else {

        taskElement.innerHTML = `

            <div class="conversion-task">

                <div class="number-box source-box">

                    <div class="number-box-label">
                        ${getFormatName(mode.from)}
                    </div>

                    <div class="number-box-value">
                        ${formatNumber(
            currentTask.input,
            mode.from
        )}
                    </div>

                </div>


                <div class="conversion-arrow">
                    →
                </div>


                <div class="number-box target-box">

                    <div class="number-box-label">
                        ${getFormatName(mode.to)}
                    </div>

                    <div class="number-box-value question">
                        ${formatNumber(
            "?",
            mode.to
        )}
                    </div>

                </div>

            </div>

        `;

    }


    scoreElement.innerHTML =
        `Aufgabe ${currentTaskIndex + 1} / 10
        <span class="score-divider">•</span>
        Richtig: ${correctAnswers}`;

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
// ZAHL IN FORMAT UMWANDELN
// ==========================================

function formatValue(
    decimal,
    type
) {

    if (type === "decimal") {

        return decimal.toString();

    }


    if (type === "binary") {

        return decimal.toString(2);

    }


    if (type === "hex") {

        return decimal
            .toString(16)
            .toUpperCase();

    }

}


// ==========================================
// BASIS ANZEIGEN
// ==========================================

function getBaseSymbol(type) {

    if (type === "binary") {

        return "B";

    }


    if (type === "decimal") {

        return "D";

    }


    if (type === "hex") {

        return "H";

    }

}


// ==========================================
// BASISKENNUNG FORMATIEREN
// ==========================================

function formatBase(type) {

    return `<span class="base">${getBaseSymbol(type)}</span>`;

}


// ==========================================
// ZAHL MIT BASISKENNUNG
// ==========================================

function formatNumber(
    value,
    type
) {

    return `${value}${formatBase(type)}`;

}


// ==========================================
// UMRECHNUNGEN
// ==========================================

function convert(
    decimal,
    target
) {

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


    const binaryAnswer =
        currentTask.mode === "number-addition"
            ? currentTask.resultFormat === "binary"
            : mode.to === "binary";


    if (binaryAnswer) {

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
            `Leider falsch. Richtige Antwort: ${formatNumber(
                currentTask.answer,
                currentTask.mode === "number-addition"
                    ? currentTask.resultFormat
                    : mode.to
            )}`;


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

        solutionElement.innerHTML =
            createSolution(
                currentTask
            );


        solutionElement.classList.remove(
            "hidden"
        );


        solutionButton.classList.add(
            "hidden"
        );

    }
);


// ==========================================
// LÖSUNGSWEG
// ==========================================

function createSolution(task) {

    if (
        task.mode === "number-addition"
    ) {

        return createNumberAdditionSolution(
            task
        );

    }


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


        return `

            <div class="solution-title">
                Dezimal → Binär
            </div>

            <div class="solution-section">

                <strong>
                    Ausgangszahl
                </strong>

                <div class="solution-formula">
                    ${formatNumber(
            number,
            "decimal"
        )}
                </div>

            </div>

            <div class="solution-section">

                <strong>
                    Schrittweise teilen
                </strong>

                <div class="solution-list">

                    ${lines.map(
            line => `
                            <div>${line}</div>
                        `
        ).join("")}

                </div>

            </div>

            <div class="solution-result">

                <span>
                    Reste von unten nach oben:
                </span>

                <strong>
                    ${formatNumber(
            task.answer,
            "binary"
        )}
                </strong>

            </div>

        `;

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
                Number(
                    binary[i]
                );


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


        return `

            <div class="solution-title">
                Binär → Dezimal
            </div>

            <div class="solution-section">

                <strong>
                    Stellenwerte einsetzen
                </strong>

                <div class="solution-formula">
                    ${formatNumber(
            binary,
            "binary"
        )}
                </div>

                <div class="solution-formula">
                    = ${parts.join(" + ")}
                </div>

            </div>

            <div class="solution-section">

                <strong>
                    Berechnen
                </strong>

                <div class="solution-formula">
                    = ${values.join(" + ")}
                </div>

            </div>

            <div class="solution-result">

                <span>
                    Ergebnis:
                </span>

                <strong>
                    ${formatNumber(
            task.answer,
            "decimal"
        )}
                </strong>

            </div>

        `;

    }


    // ======================================
    // DEZIMAL → HEX
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


        return `

            <div class="solution-title">
                Dezimal → Hexadezimal
            </div>

            <div class="solution-section">

                <strong>
                    Ausgangszahl
                </strong>

                <div class="solution-formula">
                    ${formatNumber(
            number,
            "decimal"
        )}
                </div>

            </div>

            <div class="solution-section">

                <strong>
                    Schrittweise teilen
                </strong>

                <div class="solution-list">

                    ${lines.map(
            line => `
                            <div>${line}</div>
                        `
        ).join("")}

                </div>

            </div>

            <div class="solution-result">

                <span>
                    Reste von unten nach oben:
                </span>

                <strong>
                    ${formatNumber(
            task.answer,
            "hex"
        )}
                </strong>

            </div>

        `;

    }


    // ======================================
    // HEX → DEZIMAL
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


            const calculation =
                value *
                Math.pow(
                    16,
                    exponent
                );


            parts.push(
                `${digit} · 16^${exponent}`
            );


            if (calculation > 0) {

                values.push(calculation);

            }

        }


        return `

            <div class="solution-title">
                Hexadezimal → Dezimal
            </div>

            <div class="solution-section">

                <strong>
                    Stellenwerte einsetzen
                </strong>

                <div class="solution-formula">
                    ${formatNumber(
            hex,
            "hex"
        )}
                </div>

                <div class="solution-formula">
                    = ${parts.join(" + ")}
                </div>

            </div>

            <div class="solution-section">

                <strong>
                    Berechnen
                </strong>

                <div class="solution-formula">
                    = ${values.join(" + ")}
                </div>

            </div>

            <div class="solution-result">

                <span>
                    Ergebnis:
                </span>

                <strong>
                    ${formatNumber(
            task.answer,
            "decimal"
        )}
                </strong>

            </div>

        `;

    }


    // ======================================
    // BINÄR → HEX
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


                    const hexValue =
                        value
                            .toString(16)
                            .toUpperCase();


                    return `

                        <div>
                            ${formatNumber(
                        group,
                        "binary"
                    )}
                            =
                            ${formatNumber(
                        value,
                        "decimal"
                    )}
                            =
                            ${formatNumber(
                        hexValue,
                        "hex"
                    )}
                        </div>

                    `;

                }
            );


        return `

            <div class="solution-title">
                Binär → Hexadezimal
            </div>

            <div class="solution-section">

                <strong>
                    In Vierergruppen aufteilen
                </strong>

                <div class="solution-list">

                    ${conversions.join("")}

                </div>

            </div>

            <div class="solution-result">

                <span>
                    Ergebnis:
                </span>

                <strong>
                    ${formatNumber(
            task.answer,
            "hex"
        )}
                </strong>

            </div>

        `;

    }


    // ======================================
    // HEX → BINÄR
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


                    return `

                        <div>
                            ${formatNumber(
                        digit,
                        "hex"
                    )}
                            =
                            ${formatNumber(
                        binary,
                        "binary"
                    )}
                        </div>

                    `;

                }
            );


        return `

            <div class="solution-title">
                Hexadezimal → Binär
            </div>

            <div class="solution-section">

                <strong>
                    Jede Hexadezimalstelle entspricht vier Bits
                </strong>

                <div class="solution-list">

                    ${conversions.join("")}

                </div>

            </div>

            <div class="solution-result">

                <span>
                    Ergebnis:
                </span>

                <strong>
                    ${formatNumber(
            task.answer,
            "binary"
        )}
                </strong>

            </div>

        `;

    }

}


// ==========================================
// ZAHLENSYSTEM-ADDITION – LÖSUNGSWEG
// ==========================================

function createNumberAdditionSolution(task) {

    const firstBinary =
        task.firstDecimal.toString(2);


    const secondBinary =
        task.secondDecimal.toString(2);


    const binaryResult =
        task.sumDecimal.toString(2);


    const firstOriginal =
        formatNumber(
            task.firstValue,
            task.firstFormat
        );


    const secondOriginal =
        formatNumber(
            task.secondValue,
            task.secondFormat
        );


    let html = `

        <div class="solution-title">
            Zahlensysteme addieren
        </div>

        <div class="solution-section">

            <strong>
                1. Ausgangszahlen
            </strong>

            <div class="solution-formula">
                ${firstOriginal}
                +
                ${secondOriginal}
            </div>

        </div>

    `;


    // ======================================
    // ERSTE ZAHL → BINÄR
    // ======================================

    if (
        task.firstFormat !== "binary"
    ) {

        html += `

            <div class="solution-section">

                <strong>
                    ${firstOriginal} in Binär umwandeln
                </strong>

                <div class="solution-formula">
                    ${firstOriginal}
                    =
                    ${formatNumber(
            firstBinary,
            "binary"
        )}
                </div>

            </div>

        `;

    }


    // ======================================
    // ZWEITE ZAHL → BINÄR
    // ======================================

    if (
        task.secondFormat !== "binary"
    ) {

        html += `

            <div class="solution-section">

                <strong>
                    ${secondOriginal} in Binär umwandeln
                </strong>

                <div class="solution-formula">
                    ${secondOriginal}
                    =
                    ${formatNumber(
            secondBinary,
            "binary"
        )}
                </div>

            </div>

        `;

    }


    // ======================================
    // BINÄR ADDIEREN
    // ======================================

    html += `

        <div class="solution-section">

            <strong>
                2. Binär addieren
            </strong>

            ${createBinaryCalculation(
        firstBinary,
        secondBinary,
        binaryResult
    )}

        </div>

    `;


    // ======================================
    // BINÄRES ERGEBNIS
    // ======================================

    if (
        task.resultFormat === "binary"
    ) {

        html += `

            <div class="solution-result">

                <span>
                    Ergebnis:
                </span>

                <strong>
                    ${formatNumber(
            binaryResult,
            "binary"
        )}
                </strong>

            </div>

        `;

    }


    // ======================================
    // DEZIMALES ERGEBNIS
    // ======================================

    else if (
        task.resultFormat === "decimal"
    ) {

        const decimalParts = [];

        const decimalValues = [];


        for (
            let i = 0;
            i < binaryResult.length;
            i++
        ) {

            const bit =
                Number(
                    binaryResult[i]
                );


            const exponent =
                binaryResult.length - 1 - i;


            const value =
                bit *
                Math.pow(
                    2,
                    exponent
                );


            decimalParts.push(
                `${bit} · 2^${exponent}`
            );


            if (value > 0) {

                decimalValues.push(value);

            }

        }


        html += `

            <div class="solution-section">

                <strong>
                    3. Binäres Ergebnis in Dezimal umwandeln
                </strong>

                <div class="solution-formula">
                    ${formatNumber(
            binaryResult,
            "binary"
        )}
                </div>

                <div class="solution-formula">
                    = ${decimalParts.join(" + ")}
                </div>

                <div class="solution-formula">
                    = ${decimalValues.join(" + ")}
                </div>

                <div class="solution-formula">
                    =
                    ${formatNumber(
            task.sumDecimal,
            "decimal"
        )}
                </div>

            </div>

            <div class="solution-result">

                <span>
                    Ergebnis:
                </span>

                <strong>
                    ${formatNumber(
            task.sumDecimal,
            "decimal"
        )}
                </strong>

            </div>

        `;

    }


    // ======================================
    // HEXADEZIMALES ERGEBNIS
    // ======================================

    else if (
        task.resultFormat === "hex"
    ) {

        const paddedBinary =
            binaryResult.padStart(
                Math.ceil(
                    binaryResult.length / 4
                ) * 4,
                "0"
            );


        const groups =
            paddedBinary.match(
                /.{4}/g
            );


        const hexConversions =
            groups.map(
                group => {

                    const decimalValue =
                        parseInt(
                            group,
                            2
                        );


                    const hexValue =
                        decimalValue
                            .toString(16)
                            .toUpperCase();


                    return `

                        <div>
                            ${formatNumber(
                        group,
                        "binary"
                    )}
                            =
                            ${formatNumber(
                        decimalValue,
                        "decimal"
                    )}
                            =
                            ${formatNumber(
                        hexValue,
                        "hex"
                    )}
                        </div>

                    `;

                }
            );


        const resultValue =
            formatValue(
                task.sumDecimal,
                "hex"
            );


        html += `

            <div class="solution-section">

                <strong>
                    3. Binäres Ergebnis in Hexadezimal umwandeln
                </strong>

                <div class="solution-formula">
                    ${formatNumber(
            binaryResult,
            "binary"
        )}
                </div>

                <div class="solution-formula">
                    In Vierergruppen aufteilen:
                </div>

                <div class="solution-list">

                    ${hexConversions.join("")}

                </div>

                <div class="solution-formula">
                    =
                    ${formatNumber(
            resultValue,
            "hex"
        )}
                </div>

            </div>

            <div class="solution-result">

                <span>
                    Ergebnis:
                </span>

                <strong>
                    ${formatNumber(
            resultValue,
            "hex"
        )}
                </strong>

            </div>

        `;

    }


    return html;

}


// ==========================================
// BINÄR-ADDITION DARSTELLEN
// ==========================================

function createBinaryCalculation(
    first,
    second,
    result
) {

    const maxLength =
        Math.max(
            first.length,
            second.length
        );


    const displayWidth =
        maxLength + 1;


    const firstPadded =
        first.padStart(
            maxLength,
            "0"
        );


    const secondPadded =
        second.padStart(
            maxLength,
            "0"
        );


    const firstDisplay =
        firstPadded.padStart(
            displayWidth,
            "0"
        );


    const secondDisplay =
        secondPadded.padStart(
            displayWidth,
            "0"
        );


    const resultDisplay =
        result.padStart(
            displayWidth,
            "0"
        );


    // ======================================
    // ÜBERTRÄGE
    // ======================================

    const carries =
        new Array(
            displayWidth
        ).fill("");


    let carry = 0;


    for (
        let i = maxLength - 1;
        i >= 0;
        i--
    ) {

        const a =
            Number(
                firstPadded[i]
            );


        const b =
            Number(
                secondPadded[i]
            );


        const sum =
            a +
            b +
            carry;


        if (sum >= 2) {

            carries[i] = "1";

            carry = 1;

        }

        else {

            carry = 0;

        }

    }


    // ======================================
    // ZELLEN
    // ======================================

    function createCells(
        value,
        className = ""
    ) {

        return value
            .split("")
            .map(
                bit => `

                    <span class="binary-cell ${className}">
                        ${bit}
                    </span>

                `
            )
            .join("");

    }


    // ======================================
    // DARSTELLUNG
    // ======================================

    return `

        <div
            class="binary-calculation"
            style="--binary-columns: ${displayWidth};"
        >

            <div class="binary-row binary-carry-row">

                ${createCells(
        carries.join(""),
        "carry"
    )}

            </div>


            <div class="binary-row binary-number-row">

                ${createCells(
        firstDisplay
    )}

            </div>


            <div class="binary-row binary-number-row binary-second-row">

                ${createCells(
        secondDisplay
    )}

                <span class="binary-plus">
                    +
                </span>

            </div>


            <div class="binary-divider"></div>


            <div class="binary-row binary-number-row binary-result">

                ${createCells(
        resultDisplay
    )}

            </div>

        </div>

    `;

}


// ==========================================
// FORMATNAME
// ==========================================

function getFormatName(type) {

    if (type === "binary") {

        return "Binär";

    }


    if (type === "decimal") {

        return "Dezimal";

    }


    if (type === "hex") {

        return "Hexadezimal";

    }

}


// ==========================================
// STATISTIK AKTUALISIEREN
// ==========================================

function updateScore() {

    scoreElement.innerHTML =
        `Aufgabe ${currentTaskIndex + 1} / 10
        <span class="score-divider">•</span>
        Richtig: ${correctAnswers}`;

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
// ANDEREN ÜBUNGSMODUS
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


    solutionElement.innerHTML = "";

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