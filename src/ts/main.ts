import {findReact} from "./reactUtils";
import {
    CompleteReverseTranslationChallenge,
    DialogueChallenge,
    GapFillChallenge,
    ListenChallenge,
    ListenComprehensionChallenge,
    ListenTapChallege,
    PartialReverseTranslateChallenge,
    TapCompleteChallenge,
    TranslateChallenge,
    TypeClozeChallenge
} from "./types/duolingo";
import {sleep, tapCorrectWords, typeIntoInput, typeIntoSpan, typeIntoTextArea} from "./util";


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
        case "tapCloze": {
            const choices = document.querySelectorAll('[data-test="word-bank"] > div') as NodeListOf<HTMLElement>;
            const correctIndicies = (props.currentChallenge as TapCompleteChallenge).correctIndices;
            for (const index of correctIndicies) {
                (choices[index].querySelector("button") as HTMLButtonElement).click();
            }
            break;
        }
        case "translate": {
            const correctTokens = (props.currentChallenge as TranslateChallenge).correctTokens;
            const correctSolutions = (props.currentChallenge as TranslateChallenge).correctSolutions;
            if (correctTokens) {
                tapCorrectWords(correctTokens);
            } else if (correctSolutions) {
                typeIntoTextArea(document.querySelector('[data-test="challenge-translate-input"]') as HTMLTextAreaElement, correctSolutions[0])
            }
            break;
        }
        case "listenTap": {
            const correctTokens = (props.currentChallenge as ListenTapChallege).correctTokens;
            tapCorrectWords(correctTokens);
            break;
        }
        case "typeCloze": {
            const tokens = (props.currentChallenge as TypeClozeChallenge).displayTokens
            let i = 0;
            const inputs = document.querySelectorAll("span._1O_I2 ._3bKcr input") as NodeListOf<HTMLInputElement>;
            const startingTexts: string[] = (Array.from(document.querySelectorAll("span._1O_I2 span._1FEiz") as NodeListOf<HTMLElement>)).map(x => x.textContent) as string[];
            for (const token of tokens) {
                if (token.damageStart) {
                    alert(inputs[i] + "startingText" + startingTexts[i] + token.text)


                    typeIntoInput(inputs[i], token.text.substring(startingTexts[i].length));
                    i++
                    break;
                }
            }
            break;
        }
        case "listenMatch": {
            /*
            Explanation: Ok, this challenge is weird. It gives 4 audios and 4 words. You have to match the sound to the word. This is weird already.
            Heres how we win it. The divs have a data-test attribute that has THE TRANSLATED WORD. Meaning that we will have a list of sounds that have
            an attribute that has the word they represent on it. Then we sinply match from there.
             */
            const words = Array.from(document.querySelectorAll('button[data-test*="challenge-tap-token"]') as NodeListOf<HTMLElement>)
            const map = new Map<string, HTMLElement[]>();
            for (const word of words) {
                const dataTest = word.getAttribute("data-test") as string
                if (map.has(dataTest)) {
                    const words = (map.get(dataTest) ?? [])
                    words.push(word)
                    map.set(dataTest, words)
                } else {
                    map.set(dataTest, [word])
                }
            }
            for (const [audio, selection] of map.values()) {
                audio.click()
                selection.click()
            }
            break;
        }
        case "partialReverseTranslate": {
            const displayTokens = (props.currentChallenge as PartialReverseTranslateChallenge).displayTokens
            let solution = ""

            for (const token of displayTokens) {
                if (token.isBlank) {
                    solution += token.text
                }
            }

            const inputElm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]") as HTMLElement;
            typeIntoSpan(inputElm, solution)
        }
        case "listen": {
            const prompt = (props.currentChallenge as ListenChallenge).prompt;
            // const input = document.querySelectorAll('[data-test="challenge-text-input"]')[0] as HTMLInputElement;
            const input = document.querySelector("[data-test*='challenge'] textarea") as HTMLTextAreaElement;

            typeIntoTextArea(input, prompt);
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
        case "listenComprehension": {
            const correctIndex = (props.currentChallenge as ListenComprehensionChallenge).correctIndex;
            const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>;
            choices[correctIndex].click();
            break;
        }
        case "listenComplete":
        case "completeReverseTranslation": {
            const currentlyDone = (props.currentChallenge as CompleteReverseTranslationChallenge).displayTokens
            const input = document.querySelectorAll('[data-test="challenge-text-input"]')[0] as HTMLInputElement;
            typeIntoInput(input, currentlyDone.find(x => x.isBlank)?.text ?? "");
            // const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
            // nativeValueSetter?.call(input, currentlyDone.find(x => x.isBlank)?.text);
            // const inputEvent = new Event("input", {
            //     bubbles: true
            // });
            // input.dispatchEvent(inputEvent);
            //
            break;
        }
    }

    next.click()

    setTimeout(() => {
        next.click()
    }, 100)
}

