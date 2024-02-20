export function getWordsMap(): [string, HTMLElement][] {
    const wordBank = document.querySelector("[data-test=word-bank]") as HTMLElement;
    const words: [string, HTMLElement][] = [];

    for (let i = 0; i < wordBank.childElementCount; i++) {
        words.push([wordBank.children[i].textContent ?? "", wordBank.children[i] as HTMLElement])
    }

    return words
}

export function tapCorrectWords(correctTokens: string[]) {
    const words = getWordsMap();
    for (const token of correctTokens) {
        const word = words.find(x => x[0] === token);
        (word?.[1].querySelector("button") as HTMLElement).click()
        words.splice(words.findIndex(x => x[0] === token), 1);
    }
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function setNativeValue(element: HTMLElement, value: string, type: string) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, type)?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, type)?.set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter?.call(element, value);
    } else {
        valueSetter?.call(element, value);
    }
}

export function type(input: HTMLElement, text: string, type = "value") {
    if (!input) return;
    setNativeValue(input, text, type);
    input.dispatchEvent(new Event('input', {bubbles: true}));
}

export function typeSpan(input: HTMLElement, text: string) {
    let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent")?.set;
    nativeInputNodeTextSetter?.call(input, text)
    let inputEvent = new Event("input", {
        bubbles: true
    });
    input.dispatchEvent(inputEvent);
}
