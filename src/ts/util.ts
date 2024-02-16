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
