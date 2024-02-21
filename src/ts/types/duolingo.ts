interface UnknownProperty {
    [key: string]: any;
}

export interface ReactPropsOuterWrapper {
    history: UnknownProperty;
    location: UnknownProperty;
    path: Path[];
    user: { weeklyXp: number; /* Incomplete */ };
    match: UnknownProperty;
    staticContext: any | undefined;
    children: any | null;
    challengeToggleState: UnknownProperty;
    correctChalleges: any[];
    course: UnknownProperty;
    player: { isFinalLevel: boolean /* Incomplete */ };
    currentChallenge: AllChallenges
    currentCourseHistory: UnknownProperty;
}

export type AllChallenges =
    DialogueChallenge
    | AssistChallenge
    | CompleteReverseTranslationChallenge
    | GapFillChallenge
    | ListenChallenge
    | ListenCompleteChallenge
    | ListenComprehensionChallenge
    | ListenIsolationChallenge
    | ListenTapChallege
    | PartialReverseTranslateChallenge
    | ReadComprehensionChallenge
    | NameChallenge
    | SelectChallenge
    | MatchChallenge
    | SelectOneChallenge
    | SelectTranscriptionChallenge
    | TapClozeChallenge
    | TapCompleteChallenge
    | TranslateChallenge
    | TypeClozeChallenge
    | ListenMatchChallenge

export type DuolingoChallengeTypes =
    "dialogue"
    | "assist"
    | "completeReverseTranslation"
    | "gapFill"
    | "listen"
    | "listenComplete"
    | "listenComprehension"
    | "listenIsolation"
    | "listenMatch"
    | "listenTap"
    | "match"
    | "name"
    | "partialReverseTranslate"
    | "readComprehension"
    | "select"
    | "selectTranscription"
    | "tapCloze"
    | "tapComplete"
    | "translate"
    | "typeCloze"

export interface AbstractBaseChallenge {
    challengeGeneratorIdentifier: ChallengeGeneratorIdentifier;
    challengeResponseTrackingProperties: ChallengeResponseTrackingProperties;
    choices?: (ChoicesEntity)[] | null | (string)[];
    id: string;
    metadata: Metadata;
    progressUpdates?: (null)[] | null;
    startTime: number;
    type: DuolingoChallengeTypes;
}

export interface CorrectIndexChallenge extends AbstractBaseChallenge {
    correctIndex: number
}

export interface TypeClozeChallenge extends AbstractBaseChallenge {
    displayTokens: DisplayToken[]
    tokens: TokensEntity[]
    newWords: any[]
    sentenceId: string
    explanation: Explanation
    indicatorType: string
}

export interface MatchChallenge extends AbstractBaseChallenge {
    pairs: MatchPair[]
    newWords: any[]
}

export interface NameChallenge extends AbstractBaseChallenge {
    prompt: string
    correctSolutions: string[]
    images: any[]
    solutionTts: string
    grader: Grader
    svgs: string[]
    newWords: any[]
}

export interface PartialReverseTranslateChallenge extends AbstractBaseChallenge {
    prompt: string
    displayTokens: DisplayToken[]
    grader: Grader
    weakWordPromptRanges: any[]
    tokens: TokensEntity[]
    tts: string
    character: Character
    isSpeakerUniversal: boolean
    newWords: any[]
    worldCharacterShown: boolean
}

export interface ListenMatchChallenge extends AbstractBaseChallenge {
    pairs: Pair[]
}

interface Pair {
    tts: string
    translation: string
    learningWord: string
}

interface MatchPair {
    learningToken: string
    fromToken: string
    tts: string
}

export interface ListenComprehensionChallenge extends CorrectIndexChallenge {
    prompt: string
    tts: string
    slowTts: string
    question: string
    questionTokens: QuestionToken[]
}

export interface ListenChallenge extends AbstractBaseChallenge {
    prompt: string
    solutionTranslation: string
    tts: string
    slowTts: string
    grader: Grader
    newWords: any[]
    sentenceId: string
    explanation: Explanation
    indicatorType: string
}

export interface Explanation {
    url: string
    title: string
}

export interface TapClozeChallenge extends AbstractBaseChallenge {
    correctIndices: number[]
    displayTokens: DisplayToken[]
    tokens: TokensEntity[]
    newWords: any[]
    sentenceId: string
    explanation: Explanation
    indicatorType: string
}

export interface SelectChallenge extends CorrectIndexChallenge {
    prompt: string
    newWords: any[]
}

export interface ReadComprehensionChallenge extends CorrectIndexChallenge {
    passage: string
    passageTokens: PassageToken[]
    question: string
    questionTokens: QuestionToken[]
    tts: string
}

export interface GapFillChallenge extends CorrectIndexChallenge {
    displayTokens: DisplayToken[]
    tokens: TokensEntity[]
    solutionTranslation: string
    isSpeakerUniversal: boolean
    newWords: any[]
}

export interface PassageToken {
    value: string
    tts?: string
    hintTable?: HintTable
}

export interface QuestionToken {
    value: string
    tts?: string
}

export interface SelectTranscriptionChallenge extends CorrectIndexChallenge {
    tts: string
}

export interface ListenCompleteChallenge extends AbstractBaseChallenge {
    character: Character
    displayTokens: DisplayToken[]
    grader: Grader
    slowTts: string
    solutionTranslation: string
    tts: string
    sentenceId: string
    prompt: string
    worldCharacterShown: boolean
}

export interface ListenIsolationChallenge extends CorrectIndexChallenge {
    blankRangeEnd: number
    blankRangeStart: number
    character: Character
    options: Option[]
    solutionTranslation: string
    tokens: TokensEntity[]
    tts: string
    sentenceId: string
    worldCharacterShown: boolean
}

export interface ListenTapChallege extends CorrectIndexChallenge {
    prompt: string
    correctTokens: string[]
    wrongTokens: string[]
    correctIndices: number[]
    solutionTranslation: string
    tts: string
    slowTts: string
    grader: Grader
    newWords: any[]
    sentenceId: string
}

export interface AssistChallenge extends CorrectIndexChallenge {
    character: Character
    prompt: string
    options: Option[]
    newWords: any[]
    worldCharacterShown: boolean
}

export interface CompleteReverseTranslationChallenge extends AbstractBaseChallenge {
    prompt: string
    displayTokens: DisplayToken[]
    taggedKcIds?: (TaggedKcIdsEntity)[] | null;
    grader: Grader
    weakWordPromptRanges: any[]
    tokens?: (TokensEntity)[] | null;
    tts: string
    character: Character
    isSpeakerUniversal: boolean
    newWords: any[]
    sentenceId: string
    worldCharacterShown: boolean
}

export interface SelectOneChallenge extends CorrectIndexChallenge {
    dialogue?: (DialogueEntity)[] | null;
    solutionTranslation: string;
}

export interface DisplayToken {
    text: string;
    isBlank: boolean;
    damageStart?: number | null;
}

export interface TapCompleteChallenge extends AbstractBaseChallenge {
    correctIndices: number[]
    displayTokens: DisplayToken[]
    tokens?: (TokensEntity)[] | null;
    solutionTranslation: string
    newWords: any[]
}

export interface DialogueChallenge extends CorrectIndexChallenge {
    dialogue: Dialogue[]
    solutionTranslation: string
}

interface Dialogue {
    character: Character
    displayTokens?: (DisplayTokensEntity)[] | null;
    hintTokens?: (HintTokensEntity)[] | null;
    speaker: string
    tts: string
}

export interface TranslateChallenge extends AbstractBaseChallenge {
    prompt: string;
    correctSolutions?: (string)[] | null;
    compactTranslations?: (string)[] | null;
    correctTokens: string[]
    wrongTokens?: (string)[] | null;
    correctIndices?: (number)[] | null;
    sourceLanguage: string;
    targetLanguage: string;
    grader: Grader;
    taggedKcIds?: (TaggedKcIdsEntity)[] | null;
    weakWordPromptRanges?: (null)[] | null;
    tokens?: (TokensEntity)[] | null;
    tts: string;
    character: Character;
    isSpeakerUniversal: boolean;
    newWords?: (null)[] | null;
    sentenceId: string;
    worldCharacterShown: boolean;
}

interface ChoicesEntity {
    text: string;
}

interface Grader {
    version: number;
    vertices?: ((EntityOrVerticesEntityEntity | null)[] | null)[] | null;
    language: string;
    whitespaceDelimited: boolean;
}

interface EntityOrVerticesEntityEntity {
    to: number;
    lenient: string;
    type?: string | null;
    orig?: string | null;
}

interface TaggedKcIdsEntity {
    legacyId: string;
    kcTypeStr: string;
}

interface TokensEntity {
    value: string;
    tts?: string | null;
    damageStart?: number | null;
}

interface Character {
    avatarIconImage: ImageOrAvatarIconImage;
    correctAnimation: string;
    gender: string;
    idleAnimation: string;
    image: ImageOrAvatarIconImage;
    incorrectAnimation: string;
    name: string;
    riveAnimation: RiveAnimation;
    url: string;
}

interface ImageOrAvatarIconImage {
    pdf: string;
    svg: string;
}

interface RiveAnimation {
    artBoardName: string;
    correctStateName: string;
    incorrectStateName: string;
    notSetStateName: string;
    outfitInputName: string;
    stateMachineName: string;
    url: string;
}

interface ChallengeResponseTrackingProperties {
    path_uses_unit_vision: boolean;
    best_solution: string;
    level_session_index: number;
    grading_graph_size: number;
    num_tap_distractors: number;
    highlighted_l1_weak_word_in_prompt: boolean;
    num_correct_answer_tokens: number;
    generation_timestamp: number;
    session_type: string;
    is_v2: boolean;
    tagged_kc_ids?: (string)[] | null;
}

interface ChallengeConstructionInsights {
    num_tap_distractors: number;
    num_correct_answer_tokens: number;
    highlighted_l1_weak_word_in_prompt: boolean;
}

interface ChallengeGeneratorIdentifier {
    specificType: string;
    generatorId: string;
}

interface DialogueEntity {
    character: Character;
    displayTokens?: (DisplayTokensEntity)[] | null;
    hintTokens?: (HintTokensEntity)[] | null;
    speaker: string;
    tts: string;
}

interface ImageOrAvatarIconImage {
    pdf: string;
    svg: string;
}

interface DisplayTokensEntity {
    text: string;
    isBlank: boolean;
}

interface HintTokensEntity {
    value: string;
    tts?: string | null;
    hintTable?: HintTable | null;
}

interface HintTable {
    headers?: (string | null)[] | null;
    rows?: ((EntityOrRowsEntityEntity)[] | null)[] | null;
}

interface EntityOrRowsEntityEntity {
    colspan: number;
    hint?: string | null;
}

interface ChallengeResponseTrackingProperties {
    level_session_index: number;
    birdbrain_target: number;
    cefr_subsection: string;
    is_v2: boolean;
    predicted_time_taken: number;
    path_uses_unit_vision: boolean;
    cefr_level: string;
    is_adaptive: boolean;
    birdbrain_source: string;
    generation_timestamp: number;
    session_type: string;
    birdbrain_probability: number;
    content_length: number;
    tagged_kc_ids?: (string)[] | null;
}

interface Metadata {
    challenge_construction_insights: ChallengeConstructionInsights;
    choices?: (string)[] | null;
    correct_index: number;
    from_language: string;
    generic_lexeme_map: GenericLexemeMap;
    highlight?: (null)[] | null;
    learning_language: string;
    lexeme_ids_to_update?: (string)[] | null;
    lexemes_to_update?: (string)[] | null;
    num_comments: number;
    sentence: string;
    solution_key: string;
    solution_translation: string;
    source_language: string;
    specific_type: string;
    target_language: string;
    text: string;
    tokens?: (string)[] | null;
    translation: string;
    type: string;
    weak_word_prompt_ranges?: (null)[] | null;
    wrong_tokens?: (string)[] | null;
}

interface ChallengeConstructionInsights {
    birdbrain_probability: number;
    birdbrain_target: number;
    birdbrain_source: string;
    content_length: number;
    is_adaptive: boolean;
    predicted_time_taken: number;
    cefr_level: string;
    cefr_subsection: string;
}

interface GenericLexemeMap {
}

interface ChallengeGeneratorIdentifier {
    specificType: string;
    generatorId: string;
}

interface Option {
    text: string
    tts: string
}


export interface Path {
    unitIndex: number
    levels: Level[]
    guidebook: Guidebook
    teachingObjective: string
    cefrLevel: string
    unitNumber: number
}

export interface Level {
    id: string
    state: string
    finishedSessions: number
    pathLevelMetadata: PathLevelMetadata
    pathLevelClientData: PathLevelClientData
    totalSessions: number
    debugName: string
    hasLevelReview: boolean
    type: string
    subtype: string
    isInProgressSequence: boolean
    dailyRefreshInfo: any
}

export interface PathLevelMetadata {
    skillId?: string
    crownLevelIndex?: number
    anchorSkillId?: string
    indexSinceAnchorSkill?: number
    treeId?: string
    unitIndex?: number
}

export interface PathLevelClientData {
    skillId?: string
    crownLevelIndex?: number
    hardModeLevelIndex?: number
    teachingObjective?: string
    assignmentInfo: any
    skillIds?: string[]
}

export interface Guidebook {
    url: string
}
