import { HTML } from "imperative-html";

const { p, img, div, input, span, br } = HTML;

const runes: Rune[] = [];

class Rune {
    // private imageLink;
    public readonly thisNode: HTMLImageElement;
    public childrenNodes: HTMLImageElement[] = [];
    private highlight: boolean = false;
    private readonly thisNumber: number;

    constructor(thisNode: HTMLImageElement, thisNumber: number) {
        this.thisNode = thisNode;
        this.thisNumber = thisNumber;
        this.thisNode.addEventListener("mousedown", () => {
            runes[this.thisNumber].toggleHighlight(); 
        });
    }

    toggleHighlight(): void {
        this.highlight = !this.highlight;
        const runes = document.getElementsByClassName("rune" + this.thisNumber);
        for (let i = 0; i < runes.length; i++) {
            runes[i].classList.toggle("highlight", this.highlight);
        }
    }
}

const runeCount: number = 0x5d;
const runeLinks: string[] = [];
const runeTranslations: string[] = JSON.parse(localStorage.getItem("translation") || "{}") || [];
// const inputTranslations = [];
const occurrences: HTMLSpanElement[] = [];
const runeHasDot: boolean[] = [false, false, false, false, false, false, false, false,
    false, false, false, true, false, false, false, false, //0f
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, true,  //1f
    false, false, false, false, false, true, false, false,
    false, true, false, false, false, false, false, true,  //2f
    false, false, false, false, false, true, true, false,
    false, true, true, true, true, false, false, false, //3f
    false, false, false, false, true, false, false, true,
    false, true, false, false, false, false, false, true,  //4f
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false,

];

const ocmap: Map<string|number, number> = new Map();
const text: HTMLParagraphElement = p({ class: "paragraph" });

const trunicText: (string | number)[] = [
    0x17, " ", 0x04, 0x08, 0x16, " ", 0x01, " ", "Civilization", " ", 0x2f, " ", 0x05, 0x2a, 0x03, " ", 0x2d, 0x02, ".\n",
    0x07, " ", 0x09, 0x06, 0x03, " ", 0x01, " ", 0x2c, 0x23, ", ", 0x0b, 0x16, " ", 0x28, 0x22, 0x0c, " ", 0x15, 0x03, " ", 0x2c, 0x23, " ", 0x07, " ", 0x09, 0x06, 0x03, "\n",
    0x01, " ", 0x0e, 0x04, 0x2e, ". ", 0x07, " ", 0x13, 0x06, 0x16, " ", 0x0d, 0x14, 0x24, 0x16, " ", 0x0a, " ", 0x21, 0x14, 0x24, 0x03, 0x2e, " ", 0x2f, "\n",
    0x0a, " ", "Holy Cross", ", ", 0x0b, 0x16, " ", 0x29, 0x1e, " ", 0x2e, 0x12, 0x16, " ", 0x0a, " ", 0x30, 0x11, 0x27, "\n",
    0x10, 0x20, " ", 0x2f, 0x1d, 0x1f, 0x25, 0x1a, ". ", 0x07, " ", 0x19, 0x0c, 0x20, 0x16, " ", 0x2b, " ", 0x0a, " ", 0x0f, " ", 0x26, "\n",
    0x0b, 0x16, " ", 0x1b, 0x03, " ", 0x2d, 0x02, " ", 0x1c, 0x31, 0x00, " ", 0x0a, " ", 0x2e, 0x32, 0x2c, 0x33, " ", 0x34, 0x03, 0x18, 0x0c, ". ",
    "\p",
    0x35, " ", 0x36, " ", 0x37, 0x38, 0x39, ", ", 0x0b, " ", 0x1f, 0x3a, 0x3b, " ", 0x3c, 0x16, " ", 0x2d, 0x02, " ", 0x3d, 0x33, " ", 0x3e, 0x2e, 0x3f, 0x40, 0x16, ". ", "\n",
    0x41, 0x42, 0x06, 0x33, " ", 0x2f, " ", 0x43, 0x06, 0x1c, ", ", 0x29, 0x44, 0x16, " ", 0x45, 0x46, 0x0c, 0x33, " ", 0x2f, " ", 0x0a, " ", 0x1c, 0x37, 0x20, ", ", "\n",
    0x47, 0x2b, 0x00, 0x16, " ", 0x0b, 0x16, " ", 0x48, 0x2e, 0x03, " ", 0x49, 0x2b, " ", 0x4a, 0x4b, 0x4c, 0x4d, " ", 0x0b, 0x16, " ", 0x4e, 0x4f, ". ", "\n",
    0x01, " ", 0x50, 0x40, " ", 0x49, " ", 0x0a, 0x48, 0x53, 0x51, 0x52, 0x06, " ", 0x30, 0x11, 0x0c, ", ", 0x01, " ", 0x2e, 0x54, 0x55, " ", 0x2f, "\n",
    0x56, 0x57, 0x0c, 0x58, 0x06, ". ", 0x59, 0x5a, 0x30, 0x2e, " ", 0x25, " ", 0x36, " ", 0x0a, " ", 0x5b, 0x5c, 0x06, 0x16, " ", 0x30, 0x5d, 0x33, ", ", "\n",
    "The Power To Defy Death. ",
    "\p",
];

for (let i: number = 0; i < trunicText.length; i++) {
    ocmap.set(trunicText[i], (ocmap.get(trunicText[i]) || 0) + 1);
}

for (let i: number = 0x0; i <= runeCount; i++) {
    runeLinks.push("./trunes/runes/" + decimalToHex(i) + ".png");
}

const savedSortMethod: string | null = localStorage.getItem("sort");
const sortBySelector: HTMLSelectElement | null = document.getElementById('sort') as HTMLSelectElement;
if (savedSortMethod != null) {
    if (sortBySelector != null) {
        sortBySelector.value = savedSortMethod;
        createRuneViewers(savedSortMethod);
    }
} else {
    createRuneViewers("numerical");
}
sortBySelector.addEventListener("change", (event) => {
    const self: HTMLSelectElement = event.target as HTMLSelectElement;
    createRuneViewers(self.value); localStorage.setItem('sort', self.value)
});

function createRuneViewers(sort: string): void {
    const runeHolder: HTMLDivElement = document.getElementById("runes") as HTMLDivElement;
    runeHolder.innerHTML = ""; //empty it before remaking internals based on sorting method

    function createRuneViewer(index: number): void {
        //image
        const rune: Rune = new Rune(img({
            width: 100, src: runeLinks[index], class: "image rune" + index, title: decimalToHex(index),
            style: "border-right: 3px solid black; margin-right: 3px"
        }), index);

        runes[index] = rune;

        //syllable input
        const translationGuess: HTMLInputElement = input({ type: "text", class: "inputTest", id: index, value: runeTranslations[index] || "" });

        translationGuess.addEventListener("input", (event) => {
            const tg: HTMLInputElement = event.target as HTMLInputElement;
            runeTranslations[parseInt(tg.id)] = tg.value;
            localStorage.setItem("translation", JSON.stringify(runeTranslations));
            updateParagraph(); //TODO: only update appropriate nodes
        });
        //occurence
        const occurrence: HTMLSpanElement = span();
        occurrences[index] = occurrence;
        //info
        const info: HTMLDivElement = div({ class: "info" }, occurrence, translationGuess);
        //border
        const runeBorder: HTMLDivElement = div({ class: "holder" }, rune.thisNode, info);

        //append children
        runeHolder.appendChild(runeBorder);
    }
    if (sort == "numerical") {
        for (let i: number = 0; i < runeCount; i++) {
            createRuneViewer(i);
        }
    } else if (sort == "uses") {
        const uses: number[] = [];
        ocmap.forEach((_, key) => {
            if (typeof key == "number") {
                uses.push(key);
            }
        })
        uses.sort((a: number, b: number) => ocmap.get(b)! - ocmap.get(a)!);
        for (const val in uses) {
            createRuneViewer(uses[val]);
        }
    } else if (sort = "dots") {
        const hasDots: number[] = [];
        runeLinks.forEach((_, index: number) => { hasDots[index] = index });
        hasDots.sort((a: number, b: number) => +runeHasDot[b] - +runeHasDot[a]);
        for (const val in hasDots) {
            createRuneViewer(hasDots[val]);
        }
    }
    for (let i: number = 0; i < occurrences.length; i++) {
        occurrences[i].innerText = ocmap.get(i) + " times,\n" + (Math.round(ocmap.get(i)! / trunicText.length * 10000) / 100) + "%";
    }
}

updateParagraph();

function updateParagraph(): void {
    text.innerHTML = "";

    runes.forEach((_, index) => runes[index].childrenNodes = []);

    for (let i: number = 0; i < trunicText.length; i++) {
        if (typeof trunicText[i] == "number") {
            const runeIndex: number = trunicText[i] as number;
            if (!runeTranslations[runeIndex]) {
                const image = img({ width: 20, src: runeLinks[runeIndex], class: "image rune" + runeIndex });
                runes[runeIndex].childrenNodes.push(image);

                const imageWrapper = span({ class: "span" }, image);
                text.appendChild(imageWrapper);
            } else {
                const runeText = span({ class: "rune" + runeIndex }, runeTranslations[runeIndex]);
                text.appendChild(runeText);
            }
        } else {
            const textSnippet: string = trunicText[i] as string;
            if (textSnippet.includes("\n")) { //new line
                text.appendChild(br());
            } else if (textSnippet.includes("\p")) { //new paragraph
                for (let j = 0; j < 3; j++) {
                    text.appendChild(br());
                }
            } else {
                text.innerHTML += textSnippet;
                if (textSnippet + "".includes(" ")) { //create enough space
                    const space: HTMLSpanElement = span({style: "padding: 3px"});
                    text.appendChild(space);
                }
            }
        }
    }
}

document.getElementById("paragraphs")!.appendChild(text);

function decimalToHex(decimal: number): string {
    const hexVals: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    let hex: string = "";
    while (decimal > 0) {
        hex = hexVals[decimal % 16] + hex;
        decimal = Math.floor(decimal / 16);
    }
    return "0x" + (hex.length < 2 ? "0" : "") + (hex.length < 1 ? "0" : "") + hex;
}
