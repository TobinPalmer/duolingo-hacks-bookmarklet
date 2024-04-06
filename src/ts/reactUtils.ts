import { ReactPropsOuter } from './types/types'
import { ReactPropsOuterWrapper } from './types/duolingo'

function isProps(x: unknown): x is ReactPropsOuter {
  return typeof (x as ReactPropsOuter).children !== 'undefined'
}

// This kindof recursivly looks up a subtree of elements and looks for something called __reactProps$RANDOMSTRING.
// Then we basically go into the secret duolingo stuff that has the answer and return it.
// The props contain a correct answer and a list of tokens that are the words in the answer.
// eslint-disable-next-line consistent-return
export function findReact(dom: Element): ReactPropsOuterWrapper | undefined {
  const reactProps = Object.keys(dom as HTMLElement).find((key) => key.startsWith('__reactProps$')) ?? ''

  const props = dom?.[reactProps as keyof Element]
  // If it works, it works :)
  // eslint-disable-next-line @typescript-eslint/no-use-before-define,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (isProps(props)) return props.children._owner.stateNode.props
}
