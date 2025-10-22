import { TOOLS } from './constants';

export type Point = {
    x: number;
    y: number;
};

export type PenConfig = {
    size: number;
    color: string;
};

export type Stroke = {
    id: string;
    // FIX: Added 'lasso' to support a distinct stroke type for the lasso tool's selection path.
    type: 'pen' | 'highlighter' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text' | 'lasso' | 'triangle' | 'pentagon' | 'hexagon';
    points: Point[];
    config: PenConfig;
    // for highlighter
    createdAt?: number;
    // for text
    text?: string;
    // for shapes
    start?: Point;
    end?: Point;
};

export type Tool = typeof TOOLS[keyof typeof TOOLS];

export type History = {
    stack: Stroke[][];
    index: number;
};

export type Page = {
    id: string;
    strokes: Stroke[];
    backgroundColor: string;
    history: History;
    aspectRatio: '4:3' | '16:9';
};

export type BoundingBox = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};

export type Toast = {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error';
};