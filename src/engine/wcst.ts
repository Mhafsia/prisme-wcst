import { mulberry32 } from './rng'
import type { CardSpec, Rule } from '../types'

export const COLORS: CardSpec['color'][] = ['red', 'green', 'blue', 'yellow']
export const SHAPES: CardSpec['shape'][] = ['flower', 'butterfly', 'mushroom', 'leaf']
export const NUMBERS: CardSpec['number'][] = [1, 2, 3, 4]

export const KEY_CARDS: CardSpec[] = [
  { color: 'red', shape: 'flower', number: 1 },
  { color: 'green', shape: 'butterfly', number: 2 },
  { color: 'yellow', shape: 'mushroom', number: 3 },
  { color: 'blue', shape: 'leaf', number: 4 },
]

export interface WCSTConfig {
  seed: number
  maxTrials?: number
  correctToShift?: number
  categoriesToComplete?: number
}

export interface WCSTState {
  rng: () => number
  deck: CardSpec[]
  trialIndex: number
  ruleIndex: number
  rules: Rule[]
  consecutiveCorrect: number
  categoriesCompleted: number
  prevRule: Rule | null
  trialWithinCategory: number
  conceptualSequenceLength: number
}

export function createDeck(): CardSpec[] {
  const singleDeck: CardSpec[] = []
  for (const color of COLORS) {
    for (const shape of SHAPES) {
      for (const number of NUMBERS) {
        singleDeck.push({ color, shape, number })
      }
    }
  }
  // Standard WCST = 2 full decks = 128 cards
  return [...singleDeck, ...singleDeck]
}

function shuffle<T>(arr: T[], rng: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

export function initWCST(cfg: WCSTConfig): WCSTState {
  const rng = mulberry32(cfg.seed)
  const deck = createDeck()
  shuffle(deck, rng)
  return {
    rng,
    deck,
    trialIndex: 0,
    ruleIndex: 0,
    rules: ['color', 'shape', 'number'],
    consecutiveCorrect: 0,
    categoriesCompleted: 0,
    prevRule: null,
    trialWithinCategory: 0,
    conceptualSequenceLength: 0,
  }
}

export function currentRule(state: WCSTState): Rule {
  return state.rules[state.ruleIndex]
}

export function getDeckCard(state: WCSTState): CardSpec {
  return state.deck[state.trialIndex % state.deck.length]
}

export interface EvalResult {
  correct: boolean

  // Heaton classification
  isPerseverativeResponse: boolean
  isPerseverativeError: boolean
  isNonPerseverativeError: boolean
  isConceptualResponse: boolean
  setMaintenanceError: boolean

  // Attribute matches
  colorMatch: boolean
  shapeMatch: boolean
  numberMatch: boolean
  noAttributeMatch: boolean

  // Shift tracking
  isShiftTrial: boolean
  trialWithinCategory: number

  nextState: WCSTState
}

export function evaluateSelection(state: WCSTState, keyIndex: number): EvalResult {
  const deckCard = getDeckCard(state)
  const keyCard = KEY_CARDS[keyIndex]
  const rule = currentRule(state)

  // Check attribute matches
  const colorMatch = deckCard.color === keyCard.color
  const shapeMatch = deckCard.shape === keyCard.shape
  const numberMatch = deckCard.number === keyCard.number
  const noAttributeMatch = !colorMatch && !shapeMatch && !numberMatch

  // Correctness
  const matchByRule = (r: Rule) => deckCard[r] === keyCard[r]
  const correct = matchByRule(rule)

  // Heaton: Perseverative Response (PR)
  // Any response matching the previous rule (regardless of correctness)
  let isPerseverativeResponse = false
  if (state.prevRule) {
    isPerseverativeResponse = deckCard[state.prevRule] === keyCard[state.prevRule]
  }

  // Heaton: Perseverative Error (PE) - subset of PR that are incorrect
  const isPerseverativeError = !correct && isPerseverativeResponse

  // Heaton: Non-Perseverative Error (NPE)
  const isNonPerseverativeError = !correct && !isPerseverativeResponse

  // Heaton: Conceptual Response (part of CLR)
  // Correct response that is part of a run of 3+ correct
  let isConceptualResponse = false
  if (correct) {
    // Will be true if this extends conceptual sequence to 3+
    isConceptualResponse = state.conceptualSequenceLength >= 2
  }

  // Heaton: Set-Maintenance Error (strict)
  // Error after 5-9 consecutive correct (before reaching category threshold)
  const setMaintenanceError = !correct && state.consecutiveCorrect >= 5 && state.consecutiveCorrect < 10

  const next: WCSTState = { ...state }
  let isShiftTrial = false

  if (correct) {
    // Standard WCST: Ambiguous trials ARE counted as correct for the purpose of the run of 10.
    // The previous implementation filtered them out, making the test too hard.
    // We now count every correct response.
    next.consecutiveCorrect += 1

    next.trialWithinCategory += 1
    next.conceptualSequenceLength += 1

    // Shift after 10 correct
    if (next.consecutiveCorrect >= 10) {
      next.prevRule = next.rules[next.ruleIndex]
      next.ruleIndex = (next.ruleIndex + 1) % next.rules.length
      next.categoriesCompleted += 1
      next.consecutiveCorrect = 0
      next.trialWithinCategory = 0
      isShiftTrial = true
    }
  } else {
    next.consecutiveCorrect = 0
    next.trialWithinCategory += 1
    next.conceptualSequenceLength = 0
  }

  next.trialIndex += 1

  return {
    correct,
    isPerseverativeResponse,
    isPerseverativeError,
    isNonPerseverativeError,
    isConceptualResponse,
    setMaintenanceError,
    colorMatch,
    shapeMatch,
    numberMatch,
    noAttributeMatch,
    isShiftTrial,
    trialWithinCategory: state.trialWithinCategory,
    nextState: next,
  }
}
