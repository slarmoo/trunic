import { SVG } from "imperative-html";

export class RuneEditor {
    readonly rune: Rune;
    readonly fadedStrokes: (SVGLineElement | SVGCircleElement)[] = []
    private readonly _editorWidth: number = 72;
    private readonly _editorHeight: number = 40;

    private readonly _svg: SVGSVGElement = SVG.svg({ style: `background-color:rgb(192, 179, 140)}; touch-action: none; cursor: crosshair;`, width: "100%", height: "100%", viewBox: "0 0 " + this._editorWidth + " " + this._editorHeight, preserveAspectRatio: "none" })

    constructor() {
        this.rune = new Rune()
        const filled: runeStrokes = new runeStrokes();
        filled.fill(this.rune.runeStrokes);
        for (const child of filled.svgStrokes()) {
            const fadedChild = child;
            fadedChild.style = "stroke:" + "#555555" + ";stroke-width:" + 2;
            this.fadedStrokes.push(child);
        }
    }

    render() {
        this._svg.innerHTML = "";
        for (const child of this.rune.runeStrokes.svgStrokes()) {
            this._svg.appendChild(child);
        }
        for (const child of this.fadedStrokes) {
            this._svg.appendChild(child);
        }
    }
}

export class Rune {
    private readonly _editorWidth: number = 72;
    private readonly _editorHeight: number = 40;
    
    public runeStrokes: runeStrokes = new runeStrokes();
    public nickname: string = "";

    private readonly _svg: SVGSVGElement = SVG.svg({ style: `background-color:rgb(192, 179, 140)}; touch-action: none; cursor: crosshair;`, width: "100%", height: "100%", viewBox: "0 0 " + this._editorWidth + " " + this._editorHeight, preserveAspectRatio: "none" })

    constructor(strokes?: runeStrokes) {
        this.render();
        this.runeStrokes.reset(strokes);
    }

    public setStrokes(strokes: runeStrokes) {
        this.runeStrokes.reset(strokes);
    }

    render() {
        this._svg.innerHTML = "";
        for (const child of this.runeStrokes.svgStrokes()) {
            this._svg.appendChild(child);
        }
    }
}

class runeStrokes {
    public wall: boolean = false;
    public dot: boolean = false;
    public frontColumn: boolean = false;
    public backColumn: boolean = false;
    public hatTL: boolean = false;
    public hatTR: boolean = false;
    public hatBL: boolean = false;
    public hatBR: boolean = false;
    public footTL: boolean = false;
    public footTR: boolean = false;
    public footBL: boolean = false;
    public footBR: boolean = false;

    private static readonly strokeColor: string = "#222222";
    private static readonly strokeThickness: number = 2;

    reset(strokes?: runeStrokes) {
        if (strokes) {
            this.wall = strokes.wall;
            this.dot = strokes.dot;
            this.frontColumn = strokes.frontColumn;
            this.backColumn = strokes.backColumn;
            this.hatTL = strokes.hatTL;
            this.hatTR = strokes.hatTR;
            this.hatBL = strokes.hatBL;
            this.hatBR = strokes.hatBR;
            this.footTL = strokes.footTL;
            this.footTR = strokes.footTR;
            this.footBL = strokes.footBL;
            this.footBR = strokes.footBR;
        } else {
            this.wall = false;
            this.dot = false;
            this.frontColumn = false;
            this.backColumn = false;
            this.hatTL = false;
            this.hatTR = false;
            this.hatBL = false;
            this.hatBR = false;
            this.footTL = false;
            this.footTR = false;
            this.footBL = false;
            this.footBR = false;
        }
    }

    fill(strokes?: runeStrokes) {
        this.wall = !strokes?.wall;
        this.dot = !strokes?.dot;
        this.frontColumn = !strokes?.frontColumn;
        this.backColumn = !strokes?.backColumn;
        this.hatTL = !strokes?.hatTL;
        this.hatTR = !strokes?.hatTR;
        this.hatBL = !strokes?.hatBL;
        this.hatBR = !strokes?.hatBR;
        this.footTL = !strokes?.footTL;
        this.footTR = !strokes?.footTR;
        this.footBL = !strokes?.footBL;
        this.footBR = !strokes?.footBR;
    }

    * svgStrokes(): Generator<SVGLineElement | SVGCircleElement> {
        if (this.wall) yield SVG.line({ x1: 2, y1: 12, x2: 2, y2: 43, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.dot) yield SVG.circle({ cx: 20, cy: 60, r: 3, stroke: runeStrokes.strokeColor, strokeWidth: runeStrokes.strokeThickness, fill: "none" });
        if (this.frontColumn) yield SVG.line({ x1: 20, y1: 2, x2: 20, y2: 36, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.backColumn) yield SVG.line({ x1: 20, y1: 20, x2: 20, y2: 50, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.hatTL) yield SVG.line({ x1: 2, y1: 12, x2: 20, y2: 2, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.hatTR) yield SVG.line({ x1: 38, y1: 12, x2: 20, y2: 2, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.hatBL) yield SVG.line({ x1: 2, y1: 12, x2: 20, y2: 20, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.hatBR) yield SVG.line({ x1: 38, y1: 12, x2: 20, y2: 20, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.footTL) yield SVG.line({ x1: 2, y1: 43, x2: 20, y2: 36, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.footTR) yield SVG.line({ x1: 38, y1: 43, x2: 20, y2: 36, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.footBL) yield SVG.line({ x1: 2, y1: 43, x2: 20, y2: 50, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
        if (this.footBR) yield SVG.line({ x1: 38, y1: 43, x2: 20, y2: 50, style: "stroke:" + runeStrokes.strokeColor + ";stroke-width:" + runeStrokes.strokeThickness });
    }
}