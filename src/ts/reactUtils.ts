import {ReactPropsOuter} from "./types/types";
import {ReactPropsOuterWrapper} from "./types/duolingo";
// This kindof recursivly looks up a subtree of elements and looks for something called __reactProps$RANDOMSTRING.
// Then we basically go into the secret duolingo stuff that has the answer and return it.
// The props contain a correct answer and a list of tokens that are the words in the answer.
export function findReact(dom: Element, traverseUp = 0): ReactPropsOuterWrapper | undefined {
    let reactProps = Object.keys(dom.parentElement as HTMLElement).find((key) => key.startsWith("__reactProps$")) ?? ""

    while (traverseUp-- > 0 && dom.parentElement) {
        dom = dom.parentElement;
        reactProps = Object.keys(dom.parentElement as HTMLElement).find((key) => key.startsWith("__reactProps$")) ?? ""
    }

    const props = dom.parentElement?.[reactProps as keyof HTMLElement]
    if (isProps(props)) return props.children[0]._owner.stateNode.props
}

function isProps(x: unknown): x is ReactPropsOuter {
    return (x as ReactPropsOuter).children !== undefined;
}

