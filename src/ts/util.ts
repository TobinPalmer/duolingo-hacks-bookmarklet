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

export function typeIntoInput(input: HTMLInputElement, text: string) {
    const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    nativeValueSetter?.call(input, text);
    const inputEvent = new Event("input", {
        bubbles: true
    });
    input.dispatchEvent(inputEvent);
}

export function typeIntoSpan(input: HTMLElement, text: string) {
    const nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent")?.set;
    nativeInputNodeTextSetter?.call(input, text)
    input.dispatchEvent(new Event("input", {
        bubbles: true
    }));

}

export function typeIntoTextArea(input: HTMLTextAreaElement | HTMLElement, text: string) {
    function setNativeValue(element: HTMLElement, value: String) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter?.call(element, value);
        } else {
            valueSetter?.call(element, value);
        }
    }

    setNativeValue(input, text);
    input.dispatchEvent(new Event('input', {bubbles: true}));
    // const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
    // nativeValueSetter?.call(input, text);
    // const inputEvent = new Event("input", {
    //     bubbles: true
    // });
    // input.dispatchEvent(inputEvent);
}
