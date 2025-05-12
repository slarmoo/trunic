import { HTML } from "imperative-html";
import { RuneHasDot, RuneCount, TrunicText } from "./config.ts";

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

const runeLinks: string[] = [];
const runeTranslations: string[] = JSON.parse(localStorage.getItem("translation") || "{}") || [];
const occurrences: HTMLSpanElement[] = [];
const ocmap: Map<string|number, number> = new Map();
const text: HTMLParagraphElement = p({ class: "paragraph" });

for (let i: number = 0; i < TrunicText.length; i++) {
    ocmap.set(TrunicText[i], (ocmap.get(TrunicText[i]) || 0) + 1);
}

for (let i: number = 0x0; i <= RuneCount; i++) {
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
        for (let i: number = 0; i < RuneCount; i++) {
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
        hasDots.sort((a: number, b: number) => +RuneHasDot[b] - +RuneHasDot[a]);
        for (const val in hasDots) {
            createRuneViewer(hasDots[val]);
        }
    }
    for (let i: number = 0; i < occurrences.length; i++) {
        occurrences[i].innerText = ocmap.get(i) + " times,\n" + (Math.round(ocmap.get(i)! / TrunicText.length * 10000) / 100) + "%";
    }
}

updateParagraph();

function updateParagraph(): void {
    text.innerHTML = "";

    runes.forEach((_, index) => runes[index].childrenNodes = []);

    for (let i: number = 0; i < TrunicText.length; i++) {
        if (typeof TrunicText[i] == "number") {
            const runeIndex: number = TrunicText[i] as number;
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
            const textSnippet: string = TrunicText[i] as string;
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
