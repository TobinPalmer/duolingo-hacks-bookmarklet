import {findReact} from "./reactUtils";
import {
    CompleteReverseTranslationChallenge,
    DialogueChallenge,
    GapFillChallenge,
    ListenTapChallege,
    TapCompleteChallenge
} from "./types/duolingo";
import {sleep, tapCorrectWords} from "./util";


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
        case "dialogue": {
            const correctIndex = (props.currentChallenge as DialogueChallenge).correctIndex;
            const next = document.querySelector('[data-test="player-next"]') as HTMLElement;
            sleep(50).then(() => next.click())
            sleep(50).then(() => next.click())
            const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>;
            choices[correctIndex].click();
            break;
        }
        case "translate":
        case "listenTap": {
            const correctTokens = (props.currentChallenge as ListenTapChallege).correctTokens;
            tapCorrectWords(correctTokens);
            break;
        }
        case "assist":
        case "select":
        case "readComprehension":
        case "listenIsolation":
        case "selectTranscription":
        case "gapFill": {
            const correctIndex = (props.currentChallenge as GapFillChallenge).correctIndex;
            const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>;
            choices[correctIndex].click();
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
    }

    next.click()

    setTimeout(() => {
        next.click()
    }, 100)
}

