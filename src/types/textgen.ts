export enum TextgenManner {
    Positive = '好评',
    Neutral = '中立',
    Negative = '差评',
}
export type TextgenRequirementDescriptor = {
    title: string;
    brief: string;
    textType: string;
    textManner: TextgenManner;
}
