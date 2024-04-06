import type { ReactPropsOuterWrapper } from './duolingo'

interface ReactChildrenPropElement {
  _owner: {
    stateNode: {
      props: ReactPropsOuterWrapper
    }
  }

  // There are many useless props
  [key: string]: any
}

export interface ReactPropsOuter {
  children: ReactChildrenPropElement[] | ReactChildrenPropElement
}

// declare global {
//     export interface Window {
//         sol: FinishChatChallenge | MultipleChoiceChallenge | SelectOneChallenge | TapCompleteChallenge;
//         findReact: (dom: HTMLElement, traverseUp?: number) => ReactProps;
//         ss: () => void;
//     }
// }
