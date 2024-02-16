import {findReact} from "./reactUtils";
import {
    AssistChallenge,
    CompleteReverseTranslationChallenge,
    DialogueChallenge,
    ListenTapChallege,
    SelectTranscriptionChallenge,
    TapCompleteChallenge,
    TranslateChallenge
} from "./types/duolingo";


function getWordsMap(): [string, HTMLElement][] {
    const wordBank = document.querySelector("[data-test=word-bank]") as HTMLElement;
    const words: [string, HTMLElement][] = [];

    for (let i = 0; i < wordBank.childElementCount; i++) {
        words.push([wordBank.children[i].textContent ?? "", wordBank.children[i] as HTMLElement])
    }

    return words
}

function tapCorrectWords(correctTokens: string[]) {
    const words = getWordsMap();
    for (const token of correctTokens) {
        const word = words.find(x => x[0] === token);
        (word?.[1].querySelector("button") as HTMLElement).click()
        words.splice(words.findIndex(x => x[0] === token), 1);
    }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const next = document.querySelector('[data-test="player-next"]') as HTMLElement;
const isDisabled = next.getAttribute("aria-disabled");
if (isDisabled === "false") {
    next.click();
} else {
    setInterval(solve, 100);
}


function solve() {
    const props = findReact(document.getElementsByClassName('_3FiYg')[0], 0);
    if (props === undefined) {
        throw new Error("Could not find react props")
    }
    switch (props?.currentChallenge.type) {
        case "translate": {
            const correctTokens = (props.currentChallenge as TranslateChallenge).correctTokens;

            tapCorrectWords(correctTokens);

            break;
        }
        case "dialogue": {
            const correctIndex = (props.currentChallenge as DialogueChallenge).correctIndex;
            const next = document.querySelector('[data-test="player-next"]') as HTMLElement;
            sleep(50).then(() => next.click())
            sleep(50).then(() => next.click())
            const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>;
            choices[correctIndex].click();
            break;
        }
        case "select": {
            const correctIndex = (props.currentChallenge as DialogueChallenge).correctIndex;
            const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>;
            choices[correctIndex].click();
            break;
        }
        case "assist": {
            const correctIndex = (props.currentChallenge as AssistChallenge).correctIndex;
            const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>;
            choices[correctIndex].click();
            break;
        }
        case "listenTap": {
            const correctTokens = (props.currentChallenge as ListenTapChallege).correctTokens;
            tapCorrectWords(correctTokens);
            break;
        }
        case "tapComplete": {
            const correctIndices = (props.currentChallenge as TapCompleteChallenge).correctIndices;
            const wordBank = document.querySelector('[data-test*="word-bank"]') as HTMLElement;
            const choices = wordBank.querySelectorAll('button[data-test*="challenge-tap-token"]') as NodeListOf<HTMLElement>;
            for (const index of correctIndices) {
                choices[index].click();
            }
            break;
        }
        case "listenComplete":
        case "completeReverseTranslation": {
            const currentlyDone = (props.currentChallenge as CompleteReverseTranslationChallenge).displayTokens
            const input = document.querySelectorAll('[data-test="challenge-text-input"]')[0] as HTMLInputElement;
            const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
            nativeValueSetter?.call(input, currentlyDone.find(x => x.isBlank)?.text);
            const inputEvent = new Event("input", {
                bubbles: true
            });
            input.dispatchEvent(inputEvent);

            break;
        }
        case "selectTranscription": {
            const correctIndex = (props.currentChallenge as SelectTranscriptionChallenge).correctIndex;
            const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>;
            choices[correctIndex].click();
            break;
        }
    }

    next.click()

    setTimeout(() => {
        next.click()
    }, 100)
}

