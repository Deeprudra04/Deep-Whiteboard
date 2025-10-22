

import { Stroke, Point, BoundingBox } from '../types';

export const getPolygonVertices = (stroke: Stroke): Point[] => {
    if (!stroke.start || !stroke.end) return [];

    const sides =
        stroke.type === 'triangle' ? 3 :
        stroke.type === 'pentagon' ? 5 :
        stroke.type === 'hexagon' ? 6 : 0;
    
    if (sides === 0) return [];

    const { start, end } = stroke;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const rotation = Math.atan2(dy, dx);
    
    const vertices: Point[] = [];
    for (let i = 0; i < sides; i++) {
        vertices.push({
            x: start.x + radius * Math.cos(rotation + i * 2 * Math.PI / sides),
            y: start.y + radius * Math.sin(rotation + i * 2 * Math.PI / sides),
        });
    }
    return vertices;
};

export const getStrokeBounds = (stroke: Stroke): BoundingBox | null => {
    if (stroke.type === 'text') {
        // This is an approximation. Real measurement requires a canvas context.
        if (!stroke.text || stroke.points.length === 0) return null;
        const lines = stroke.text.split('\n');
        const lineHeight = stroke.config.size * 1.2;
        const height = lines.length * lineHeight;
        const maxWidth = Math.max(...lines.map(line => line.length)) * stroke.config.size * 0.6; // crude width based on character count
        
        return {
            minX: stroke.points[0].x,
            minY: stroke.points[0].y,
            maxX: stroke.points[0].x + maxWidth,
            maxY: stroke.points[0].y + height,
        };
    }

    if (['triangle', 'pentagon', 'hexagon'].includes(stroke.type)) {
        const vertices = getPolygonVertices(stroke);
        if (vertices.length === 0) return null;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        vertices.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });
        const halfSize = stroke.config.size / 2;
        return { minX: minX - halfSize, minY: minY - halfSize, maxX: maxX + halfSize, maxY: maxY + halfSize };
    }

    if (!stroke.points || stroke.points.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    const points = stroke.type === 'line' || stroke.type === 'rectangle' || stroke.type === 'circle' ? [stroke.start!, stroke.end!] : stroke.points;
    
    points.forEach(p => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
    });

    if (stroke.type === 'rectangle') {
        return { minX: Math.min(stroke.start!.x, stroke.end!.x), minY: Math.min(stroke.start!.y, stroke.end!.y), maxX: Math.max(stroke.start!.x, stroke.end!.x), maxY: Math.max(stroke.start!.y, stroke.end!.y) };
    }
    
     if (stroke.type === 'circle') {
        const dx = stroke.end!.x - stroke.start!.x;
        const dy = stroke.end!.y - stroke.start!.y;
        const radius = Math.sqrt(dx * dx + dy * dy);
        return { minX: stroke.start!.x - radius, minY: stroke.start!.y - radius, maxX: stroke.start!.x + radius, maxY: stroke.start!.y + radius };
    }


    const halfSize = stroke.config.size / 2;
    return { minX: minX - halfSize, minY: minY - halfSize, maxX: maxX + halfSize, maxY: maxY + halfSize };
};

export const getBoundingBox = (strokes: Stroke[]): BoundingBox | null => {
    if (strokes.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    strokes.forEach(stroke => {
        const bounds = getStrokeBounds(stroke);
        if (bounds) {
            minX = Math.min(minX, bounds.minX);
            minY = Math.min(minY, bounds.minY);
            maxX = Math.max(maxX, bounds.maxX);
            maxY = Math.max(maxY, bounds.maxY);
        }
    });

    if (minX === Infinity) return null;
    return { minX, minY, maxX, maxY };
};

export const isPointInPolygon = (point: Point, polygon: Point[]) => {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
};

export const transformStrokes = (strokes: Stroke[], originalBounds: BoundingBox, currentPoint: Point, type: 'move' | 'scale', startPoint: Point): Stroke[] => {
    return strokes.map(stroke => {
        const newStroke = { ...stroke };
        if (type === 'move') {
            const dx = currentPoint.x - startPoint.x;
            const dy = currentPoint.y - startPoint.y;
            newStroke.points = stroke.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
            if (newStroke.start) newStroke.start = { x: stroke.start!.x + dx, y: stroke.start!.y + dy };
            if (newStroke.end) newStroke.end = { x: stroke.end!.x + dx, y: stroke.end!.y + dy };

        } else if (type === 'scale') {
            const originalWidth = originalBounds.maxX - originalBounds.minX;
            const originalHeight = originalBounds.maxY - originalBounds.minY;
            const newWidth = currentPoint.x - originalBounds.minX;
            const newHeight = currentPoint.y - originalBounds.minY;

            const scaleX = originalWidth === 0 ? 1 : newWidth / originalWidth;
            const scaleY = originalHeight === 0 ? 1 : newHeight / originalHeight;

            const transformPoint = (p: Point) => ({
                x: originalBounds.minX + (p.x - originalBounds.minX) * scaleX,
                y: originalBounds.minY + (p.y - originalBounds.minY) * scaleY,
            });

            newStroke.points = stroke.points.map(transformPoint);
            if (newStroke.start) newStroke.start = transformPoint(stroke.start!);
            if (newStroke.end) newStroke.end = transformPoint(stroke.end!);
            newStroke.config = { ...stroke.config, size: stroke.config.size * Math.min(scaleX, scaleY) };
        }
        return newStroke;
    });
};

export function distanceFromPointToSegment(p: Point, a: Point, b: Point): number {
    const l2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    if (l2 === 0) return Math.sqrt((p.x - a.x) ** 2 + (p.y - a.y) ** 2);
    let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((p.x - (a.x + t * (b.x - a.x))) ** 2 + (p.y - (a.y + t * (b.y - a.y))) ** 2);
}