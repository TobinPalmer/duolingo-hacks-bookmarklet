import { findReact } from './reactUtils'
import {
  CompleteReverseTranslationChallenge,
  DialogueChallenge,
  GapFillChallenge,
  ListenChallenge,
  ListenComprehensionChallenge,
  ListenTapChallege,
  MatchChallenge,
  NameChallenge,
  PartialReverseTranslateChallenge,
  TapCompleteChallenge,
  TranslateChallenge,
  TypeClozeChallenge,
} from './types/duolingo'
import { tapCorrectWords, type, typeSpan } from './util'
import { addLogger, log } from './logger'

function checkURL() {
  const url = window.location.href
  if (url.includes('learn')) {
    window.location.href = 'practice'
  }
}

checkURL()

// _3FiYg OLD
const mainReactElemClassName = 'wqSzE'

// eslint-disable-next-line complexity,max-statements
function main() {
  addLogger()

  let startingTime = new Date().getTime()
  let next = document.querySelector('[data-test="player-next"]') as HTMLElement
  let isDisabled = next.getAttribute('aria-disabled')
  // eslint-disable-next-line init-declarations
  if (isDisabled === 'false') {
    next.click()
  } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define,no-magic-numbers
    setInterval(solve, 250)
  }
  let levelOverCount = 0

  let props = findReact(document.getElementsByClassName(mainReactElemClassName)[0])
  if (typeof props === 'undefined') {
    throw new Error('Could not find react props')
  }

  log(`Weekly XP: ${props.user.weeklyXp}`)

  // eslint-disable-next-line complexity,max-statements
  function solve() {
    checkURL()
    if (levelOverCount > 2) {
      const SECOND = 1000
      log(`Lesson Took: ${(new Date().getTime() - startingTime) / SECOND} seconds`)
      const playAgain = document.querySelector('[data-test="player-practice-again"]') as HTMLElement
      if (playAgain) {
        playAgain.click()
        levelOverCount = 0
        startingTime = new Date().getTime()
      }
      // clearInterval(interval ?? 0);
      return
    }

    const skipSpeaking = document.querySelector('[data-test="player-skip"]') as HTMLElement

    if (skipSpeaking && (skipSpeaking.querySelector('._4iKvM') as HTMLElement).textContent !== 'Skip') {
      skipSpeaking.click()
    }

    //   if (skipSpeaking)
    //     if (
    //       skipSpeaking?.querySelector('._1fHYG') &&
    //       (skipSpeaking?.querySelector('._1fHYG') as HTMLElement)?.textContent !== 'Skip'
    //     ) {
    //       skipSpeaking.click()
    //     }
    // }

    next = document.querySelector('[data-test="player-next"]') as HTMLElement
    isDisabled = next.getAttribute('aria-disabled')
    if (isDisabled === 'false') {
      next.click()
    }

    props = findReact(document.getElementsByClassName(mainReactElemClassName)[0])
    if (typeof props === 'undefined') {
      throw new Error('Could not find react props')
    }

    log(`Solving ${props?.currentChallenge.type}`)
    if (document.querySelector('[data-test="player-next"]')?.textContent === 'Continue') {
      levelOverCount++
    } else {
      levelOverCount = 0
    }

    switch (props?.currentChallenge.type) {
      case 'dialogue': {
        const { correctIndex } = props.currentChallenge as DialogueChallenge
        next = document.querySelector('[data-test="player-next"]') as HTMLElement
        next.click()
        next.click()
        // sleep(50).then(() => next.click())
        // sleep(50).then(() => next.click())
        const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>
        if (typeof correctIndex !== 'undefined') {
          choices[correctIndex].click()
        }
        break
      }
      case 'tapCloze': {
        const choices = document.querySelectorAll('[data-test="word-bank"] > div') as NodeListOf<HTMLElement>
        const correctIndicies = (props.currentChallenge as TapCompleteChallenge).correctIndices
        for (const index of correctIndicies) {
          ;(choices[index].querySelector('button') as HTMLButtonElement).click()
        }
        break
      }
      case 'match': {
        const { pairs } = props.currentChallenge as MatchChallenge
        const map = new Map<string, HTMLElement>()
        const elems = Array.from(
          document.querySelectorAll('button[data-test*="challenge-tap-token"]') as NodeListOf<HTMLElement>,
        )
        for (const elem of elems) {
          const text = elem.querySelector('[data-test]') as HTMLElement
          map.set(text.textContent ?? '', elem)
        }
        for (const pair of pairs) {
          ;(() => {
            setTimeout(() => {
              map.get(pair.learningToken)?.click()
              map.get(pair.fromToken)?.click()
              // eslint-disable-next-line no-magic-numbers
            }, 80)
          })()
        }
        break
      }
      case 'translate': {
        const { correctTokens } = props.currentChallenge as TranslateChallenge
        const { correctSolutions } = props.currentChallenge as TranslateChallenge
        if (correctTokens) {
          tapCorrectWords(correctTokens)
        } else if (correctSolutions) {
          type(
            document.querySelector('[data-test="challenge-translate-input"]') as HTMLTextAreaElement,
            correctSolutions[0],
          )
        }
        break
      }
      case 'listenTap': {
        const { correctTokens } = props.currentChallenge as ListenTapChallege
        tapCorrectWords(correctTokens)
        break
      }
      case 'name': {
        const buttons = document.querySelectorAll('[data-test="challenge-judge-text"]')
        if (buttons.length > 0) {
          log('Name challenge with buttons')
          const [startingSolution] = (props.currentChallenge as NameChallenge).correctSolutions
          const buttonTexts: string[] = []
          for (const button of buttons) {
            buttonTexts.push(button.textContent ?? '')
          }
          let correctIndex = -1
          for (let i = 0; i < buttonTexts.length; i++) {
            const text = buttonTexts[i]
            if (startingSolution[0].startsWith(text)) {
              correctIndex = i
              ;(buttons[i] as HTMLElement).click()
              break
            }
          }
          type(
            document.querySelector('input[data-test="challenge-text-input"]') as HTMLTextAreaElement,
            startingSolution[0].substring(buttonTexts[correctIndex].length),
          )
        } else {
          log('Name challenge WITHOUT buttons')
          log(`Typing : ${(props.currentChallenge as NameChallenge).correctSolutions}`)
          const [correctSolution] = (props.currentChallenge as NameChallenge).correctSolutions
          type(
            document.querySelector('input[data-test="challenge-text-input"]') as HTMLTextAreaElement,
            correctSolution,
          )
        }
        break
      }
      case 'typeCloze': {
        const tokens = (props.currentChallenge as TypeClozeChallenge).displayTokens
        let i = 0
        const inputs = document.querySelectorAll('span._1O_I2 ._3bKcr input') as NodeListOf<HTMLInputElement>
        const startingTexts: string[] = Array.from(
          document.querySelectorAll('span._1O_I2 span._1FEiz') as NodeListOf<HTMLElement>,
        ).map((x) => x.textContent) as string[]
        for (const token of tokens) {
          if (token.damageStart) {
            type(inputs[i], token.text.substring(startingTexts[i].length))
            i++
            break
          }
        }
        break
      }
      case 'listenMatch': {
        /*
                                                                                                                                                                                                                                                    Explanation: Ok, this challenge is weird. It gives 4 audios and 4 words. You have to match the sound to the word. This is weird already.
                                                                                                                                                                                                                                                    Heres how we win it. The divs have a data-test attribute that has THE TRANSLATED WORD. Meaning that we will have a list of sounds that have
                                                                                                                                                                                                                                                    an attribute that has the word they represent on it. Then we sinply match from there.
                                                                                                                                                                                                                                                     */
        const words = Array.from(
          document.querySelectorAll('button[data-test*="challenge-tap-token"]') as NodeListOf<HTMLElement>,
        )
        const map = new Map<string, HTMLElement[]>()
        for (const word of words) {
          const dataTest = word.getAttribute('data-test') as string
          if (map.has(dataTest)) {
            const wds = map.get(dataTest) ?? []
            wds.push(word)
            map.set(dataTest, wds)
          } else {
            map.set(dataTest, [word])
          }
        }
        for (const [audio, selection] of map.values()) {
          audio.click()
          selection.click()
        }
        break
      }
      case 'partialReverseTranslate': {
        const { displayTokens } = props.currentChallenge as PartialReverseTranslateChallenge
        let solution = ''

        for (const token of displayTokens) {
          if (token.isBlank) {
            solution += token.text
          }
        }

        const inputElm = document
          .querySelector('[data-test*="challenge-partialReverseTranslate"]')
          ?.querySelector('span[contenteditable]') as HTMLElement
        if (inputElm === null) break
        typeSpan(inputElm, solution)
        break
      }
      case 'listen': {
        const { prompt } = props.currentChallenge as ListenChallenge
        // const input = document.querySelectorAll('[data-test="challenge-text-input"]')[0] as HTMLInputElement;
        const input = document.querySelector("[data-test*='challenge'] textarea") as HTMLTextAreaElement
        type(input, prompt)
        break
      }
      case 'assist':
      case 'select':
      case 'readComprehension':
      case 'listenIsolation':
      case 'selectTranscription':
      case 'gapFill': {
        const { correctIndex } = props.currentChallenge as GapFillChallenge
        const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>
        if (typeof correctIndex !== 'undefined') {
          choices[correctIndex].click()
        }
        break
      }
      case 'tapComplete': {
        const { correctIndices } = props.currentChallenge as TapCompleteChallenge
        const wordBank = document.querySelector('[data-test*="word-bank"]') as HTMLElement
        const choices = wordBank.querySelectorAll('button[data-test*="challenge-tap-token"]') as NodeListOf<HTMLElement>
        for (const index of correctIndices) {
          choices[index].click()
        }
        break
      }
      case 'listenComprehension': {
        const { correctIndex } = props.currentChallenge as ListenComprehensionChallenge
        const choices = document.querySelectorAll('[data-test="challenge-choice"]') as NodeListOf<HTMLElement>
        if (typeof correctIndex !== 'undefined') {
          choices[correctIndex].click()
        }
        break
      }
      case 'listenComplete':
      case 'completeReverseTranslation': {
        const currentlyDone = (props.currentChallenge as CompleteReverseTranslationChallenge).displayTokens
        const input = document.querySelectorAll('[data-test="challenge-text-input"]')[0] as HTMLInputElement
        type(input, currentlyDone.find((x) => x.isBlank)?.text ?? '')
        // const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        // nativeValueSetter?.call(input, currentlyDone.find(x => x.isBlank)?.text);
        // const inputEvent = new Event("input", {
        //     bubbles: true
        // });
        // input.dispatchEvent(inputEvent);
        //
        break
      }
      default: {
        log(`Unknown challenge type: ${props.currentChallenge.type}`)
      }
    }

    next.click()

    setTimeout(() => {
      next.click()
      // eslint-disable-next-line no-magic-numbers
    }, 5)
  }
}

const id = setInterval(() => {
  if (typeof document.getElementsByClassName(mainReactElemClassName)[0] !== 'undefined') {
    clearInterval(id)
    main()
  }
})
