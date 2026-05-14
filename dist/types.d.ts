export type SegmentKey = 'dd' | 'MM' | 'yyyy';
export type Values = Record<SegmentKey, string>;
export type Token = {
    type: 'field';
    key: SegmentKey;
    length: 2 | 4;
} | {
    type: 'sep';
    value: string;
};
