export type Rule = 'color' | 'shape' | 'number'

export interface CardSpec {
  color: 'red' | 'green' | 'blue' | 'yellow'
  shape: 'flower' | 'butterfly' | 'mushroom' | 'leaf'
  number: 1 | 2 | 3 | 4
}

export interface TrialLogEntry {
  participant_id: string
  session_id: string
  trial_index: number
  trial_within_category: number
  deck_card: CardSpec
  selected_key_index: number
  correct: boolean

  // Heaton classification
  is_perseverative_response: boolean  // PR (response, not just error)
  is_perseverative_error: boolean      // PE (subset of PR)
  is_non_perseverative_error: boolean  // NPE
  is_conceptual_response: boolean      // CLR component
  set_maintenance_error: boolean

  // Rule tracking
  rule_in_force: Rule
  prev_rule: Rule | null
  color_match: boolean
  shape_match: boolean
  number_match: boolean
  no_attribute_match: boolean

  // Category progress
  categories_completed: number
  consecutive_correct: number
  is_shift_trial: boolean
  category_index: number

  // Metadata
  response_time_ms: number
  timestamp_utc: string
  seed: number
  device_info: string
  app_version: string
}

export interface SessionSummary {
  // Basic
  total_trials: number
  total_correct: number
  total_errors: number
  categories_completed: number

  // Heaton scores
  perseverative_responses: number          // PR
  perseverative_errors: number             // PE
  non_perseverative_errors: number         // NPE
  conceptual_level_responses: number       // CLR
  failure_to_maintain_set: number

  // Category performance
  trials_to_complete_first_category: number
  trials_per_category: number[]

  // Learning indices
  learning_to_learn: number
  shift_efficiency_mean: number

  // Timing
  mean_rt: number
  mean_rt_correct: number
  mean_rt_error: number
}
