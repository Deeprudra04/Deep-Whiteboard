export const TOOLS = {
    PEN: 'pen',
    HIGHLIGHTER: 'highlighter',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    TRIANGLE: 'triangle',
    PENTAGON: 'pentagon',
    HEXAGON: 'hexagon',
    TEXT: 'text',
    LASSO: 'lasso',
    MOVE: 'move',
    ERASER: 'eraser',
    ERASER_PLUS: 'eraser_plus',
} as const;

export const COLORS = [
    '#000000', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899',
];

export const HIGHLIGHTER_COLOR = 'rgba(255, 0, 0, 0.4)';
export const HIGHLIGHTER_GLOW_DURATION = 1500; // ms
export const HIGHLIGHTER_LIFESPAN = 5000; // ms

export const SELECTION_COLOR = '#0ea5e9';