import { Stroke, Point } from '../types';
import { HIGHLIGHTER_COLOR, HIGHLIGHTER_GLOW_DURATION, HIGHLIGHTER_LIFESPAN } from '../constants';

const drawPath = (ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
};

const drawPolygonFromStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (!stroke.start || !stroke.end) return;

    const sides =
        stroke.type === 'triangle' ? 3 :
        stroke.type === 'pentagon' ? 5 :
        stroke.type === 'hexagon' ? 6 : 0;
    
    if (sides === 0) return;

    const { start, end } = stroke;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const rotation = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(end.x, end.y); // Start at the point being dragged

    for (let i = 1; i < sides; i++) {
        ctx.lineTo(
            start.x + radius * Math.cos(rotation + i * 2 * Math.PI / sides),
            start.y + radius * Math.sin(rotation + i * 2 * Math.PI / sides),
        );
    }

    ctx.closePath();
    ctx.stroke();
};

export const renderStrokes = (ctx: CanvasRenderingContext2D, strokes: Stroke[], now: number) => {
    strokes.forEach(stroke => {
        ctx.lineWidth = stroke.config.size;
        ctx.strokeStyle = stroke.config.color;
        ctx.fillStyle = stroke.config.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (stroke.type) {
            case 'pen':
            case 'eraser':
                drawPath(ctx, stroke.points);
                break;
            case 'highlighter':
                const age = now - (stroke.createdAt || 0);
                const FADE_START_TIME = 3000;
                const FADE_DURATION = HIGHLIGHTER_LIFESPAN - FADE_START_TIME;
                let baseAlpha = 0.4;
                let alpha = baseAlpha;
                if (age > FADE_START_TIME) {
                    alpha = baseAlpha * (1 - (age - FADE_START_TIME) / FADE_DURATION);
                }

                const glowOpacity = Math.max(0, 1 - age / HIGHLIGHTER_GLOW_DURATION);
                
                ctx.save();
                ctx.globalAlpha = Math.max(0, alpha);
                ctx.strokeStyle = HIGHLIGHTER_COLOR;
                ctx.shadowColor = 'rgba(255, 100, 100, 0.8)';
                ctx.shadowBlur = 15 * glowOpacity;
                drawPath(ctx, stroke.points);
                ctx.restore();
                break;
            case 'line':
                if (stroke.start && stroke.end) drawPath(ctx, [stroke.start, stroke.end]);
                break;
            case 'rectangle':
                if (stroke.start && stroke.end) {
                    ctx.strokeRect(stroke.start.x, stroke.start.y, stroke.end.x - stroke.start.x, stroke.end.y - stroke.start.y);
                }
                break;
            case 'circle':
                if (stroke.start && stroke.end) {
                    const dx = stroke.end.x - stroke.start.x;
                    const dy = stroke.end.y - stroke.start.y;
                    const radius = Math.sqrt(dx * dx + dy * dy);
                    ctx.beginPath();
                    ctx.arc(stroke.start.x, stroke.start.y, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                break;
            case 'triangle':
            case 'pentagon':
            case 'hexagon':
                drawPolygonFromStroke(ctx, stroke);
                break;
            case 'text':
                if (stroke.text && stroke.points.length > 0) {
                    ctx.font = `${stroke.config.size}px sans-serif`;
                    ctx.textBaseline = 'top';
                    stroke.text.split('\n').forEach((line, i) => {
                        ctx.fillText(line, stroke.points[0].x, stroke.points[0].y + i * stroke.config.size * 1.2);
                    });
                }
                break;
        }
    });
};

export const renderPreview = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    ctx.lineWidth = stroke.config.size;
    ctx.strokeStyle = stroke.config.color;
    ctx.fillStyle = stroke.config.color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (stroke.type) {
        case 'pen':
        case 'eraser':
        case 'highlighter':
        case 'lasso':
            drawPath(ctx, stroke.points);
            break;
        case 'line':
            if (stroke.start && stroke.end) drawPath(ctx, [stroke.start, stroke.end]);
            break;
        case 'rectangle':
            if (stroke.start && stroke.end) {
                ctx.strokeRect(stroke.start.x, stroke.start.y, stroke.end.x - stroke.start.x, stroke.end.y - stroke.start.y);
            }
            break;
        case 'circle':
            if (stroke.start && stroke.end) {
                const dx = stroke.end.x - stroke.start.x;
                const dy = stroke.end.y - stroke.start.y;
                const radius = Math.sqrt(dx * dx + dy * dy);
                ctx.beginPath();
                ctx.arc(stroke.start.x, stroke.start.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            break;
        case 'triangle':
        case 'pentagon':
        case 'hexagon':
            drawPolygonFromStroke(ctx, stroke);
            break;
        // No preview for text
    }
};