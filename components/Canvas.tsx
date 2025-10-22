import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stroke, Point, PenConfig, Tool, Toast } from '../types';
import { renderStrokes, renderPreview } from '../services/drawing';
import { getBoundingBox, isPointInPolygon, transformStrokes, getStrokeBounds, distanceFromPointToSegment, getPolygonVertices } from '../services/geometry';
import { HIGHLIGHTER_LIFESPAN, TOOLS, SELECTION_COLOR } from '../constants';
import { getEraserSvg } from './icons';

interface CanvasProps {
    strokes: Stroke[];
    onStrokesChange: (strokes: Stroke[], addToHistory?: boolean) => void;
    tool: Tool;
    setTool: (tool: Tool) => void;
    penConfig: PenConfig;
    eraserSize: number;
    highlighterSize: number;
    backgroundColor: string;
    addToast: (message: string, type: Toast['type']) => void;
}

const Canvas: React.FC<CanvasProps> = ({ strokes, onStrokesChange, tool, setTool, penConfig, eraserSize, highlighterSize, backgroundColor, addToast }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const renderCanvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const textInputRef = useRef<HTMLTextAreaElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const [zoom, setZoom] = useState(1);
    const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
    const [selectedStrokes, setSelectedStrokes] = useState<Stroke[]>([]);
    const [transform, setTransform] = useState<{ type: 'move' | 'scale'; startPoint: Point; startBounds: any; } | null>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [hoveredStrokeId, setHoveredStrokeId] = useState<string | null>(null);
    const [previewStrokes, setPreviewStrokes] = useState<Stroke[] | null>(null);

    const getCanvasPoint = (e: React.PointerEvent<HTMLDivElement>): Point => {
        const rect = renderCanvasRef.current!.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - panOffset.x) / zoom,
            y: (e.clientY - rect.top - panOffset.y) / zoom,
        };
    };

    const draw = useCallback(() => {
        const renderCtx = renderCanvasRef.current?.getContext('2d');
        const previewCtx = previewCanvasRef.current?.getContext('2d');
        if (!renderCtx || !previewCtx) return;

        const { width, height } = renderCanvasRef.current!;
        renderCtx.clearRect(0, 0, width, height);
        previewCtx.clearRect(0, 0, width, height);

        const strokesToRender = previewStrokes || strokes;

        renderCtx.save();
        renderCtx.translate(panOffset.x, panOffset.y);
        renderCtx.scale(zoom, zoom);
        
        renderStrokes(renderCtx, strokesToRender, Date.now());

        previewCtx.save();
        previewCtx.translate(panOffset.x, panOffset.y);
        previewCtx.scale(zoom, zoom);

        if (currentStroke) renderPreview(previewCtx, currentStroke);
        
        if (selectedStrokes.length > 0) {
            const bounds = getBoundingBox(selectedStrokes);
            if (bounds) {
                previewCtx.strokeStyle = SELECTION_COLOR;
                previewCtx.setLineDash([5, 5]);
                previewCtx.strokeRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
                previewCtx.setLineDash([]);
                previewCtx.fillStyle = SELECTION_COLOR;
                previewCtx.fillRect(bounds.maxX - 5 / zoom, bounds.maxY - 5 / zoom, 10 / zoom, 10 / zoom);
            }
        }
        
        if (hoveredStrokeId && !previewStrokes && !isDrawing) {
            const stroke = strokes.find(s => s.id === hoveredStrokeId);
            if (stroke) renderPreview(previewCtx, { ...stroke, config: { color: 'rgba(255,0,0,0.5)', size: stroke.config.size + 4 } });
        }
        
        renderCtx.restore();
        previewCtx.restore();
    }, [strokes, currentStroke, zoom, panOffset, selectedStrokes, hoveredStrokeId, previewStrokes, isDrawing]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const newStrokes = strokes.filter(s => s.type !== 'highlighter' || (now - (s.createdAt || 0)) < HIGHLIGHTER_LIFESPAN);
            if (newStrokes.length !== strokes.length) {
                onStrokesChange(newStrokes, false);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [strokes, onStrokesChange]);

    useEffect(() => {
        const hasHighlighters = strokes.some(s => s.type === 'highlighter');
        if (!hasHighlighters) {
            draw();
            return;
        }

        let animationFrameId: number;
        const animate = () => {
            draw();
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [draw, strokes]);

    const handleResize = useCallback(() => {
        const container = containerRef.current;
        const renderCanvas = renderCanvasRef.current;
        const previewCanvas = previewCanvasRef.current;
        if (container && renderCanvas && previewCanvas) {
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio;
            renderCanvas.width = previewCanvas.width = width * dpr;
            renderCanvas.height = previewCanvas.height = height * dpr;
            renderCanvas.style.width = previewCanvas.style.width = `${width}px`;
            renderCanvas.style.height = previewCanvas.style.height = `${height}px`;
            renderCanvas.getContext('2d')?.scale(dpr, dpr);
            previewCanvas.getContext('2d')?.scale(dpr, dpr);
            draw();
        }
    }, [draw]);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const getCursor = () => {
             if (isPanning) return 'grabbing';
             if (transform) return 'move';
             switch (tool) {
                 case TOOLS.ERASER:
                 case TOOLS.ERASER_PLUS:
                     return `url(${getEraserSvg(tool === TOOLS.ERASER ? eraserSize * zoom : 20, tool === TOOLS.ERASER_PLUS ? SELECTION_COLOR : 'black')}) ${eraserSize * zoom / 2} ${eraserSize * zoom / 2}, auto`;
                 case TOOLS.PEN:
                 case TOOLS.HIGHLIGHTER:
                     return 'crosshair';
                 case TOOLS.LASSO:
                      return 'crosshair';
                 case TOOLS.TEXT:
                     return 'text';
                 default:
                     return 'default';
             }
        };
        container.style.cursor = getCursor();
    }, [tool, isPanning, eraserSize, zoom, transform]);

    const deleteStrokeAtPoint = useCallback((point: Point) => {
        let strokeToDeleteId: string | null = null;
        
        // Find the topmost stroke to delete by iterating backwards
        for (let i = strokes.length - 1; i >= 0; i--) {
            const stroke = strokes[i];
            const bounds = getStrokeBounds(stroke);

            if (bounds && point.x >= bounds.minX && point.x <= bounds.maxX && point.y >= bounds.minY && point.y <= bounds.maxY) {
                // For text strokes, the bounds check is sufficient.
                if (stroke.type === 'text') {
                    strokeToDeleteId = stroke.id;
                } else {
                    // For path-based strokes, do a more precise check against the path segments.
                    for (let j = 0; j < stroke.points.length - 1; j++) {
                        if (distanceFromPointToSegment(point, stroke.points[j], stroke.points[j+1]) < (stroke.config.size / 2 + 5) / zoom) {
                            strokeToDeleteId = stroke.id;
                            break; // Exit inner loop once a segment is hit
                        }
                    }
                }
            }
            if (strokeToDeleteId) break; // Exit outer loop once a stroke is found
        }

        if (strokeToDeleteId) {
            onStrokesChange(strokes.filter(s => s.id !== strokeToDeleteId), true);
            return true;
        }
        return false;
    }, [strokes, onStrokesChange, zoom]);


    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button === 1) { // middle mouse button for panning
            setIsPanning(true);
            return;
        }

        const point = getCanvasPoint(e);
        
        if (tool === TOOLS.ERASER_PLUS) {
            setIsDrawing(true);
            e.currentTarget.setPointerCapture(e.pointerId);
            deleteStrokeAtPoint(point);
            return;
        }

        if (tool === TOOLS.TEXT) {
            const input = textInputRef.current;
            if (input) {
                if (selectedStrokes.length > 0) setSelectedStrokes([]);
                
                input.style.left = `${(point.x * zoom + panOffset.x)}px`;
                input.style.top = `${(point.y * zoom + panOffset.y)}px`;
                input.style.display = 'block';
                input.style.color = penConfig.color;
                input.style.fontSize = `${penConfig.size * zoom}px`;
                input.style.lineHeight = `${penConfig.size * 1.2 * zoom}px`;
                setTimeout(() => input.focus(), 0);
            }
            return;
        }
        
        if (selectedStrokes.length > 0) {
            const bounds = getBoundingBox(selectedStrokes)!;
            const handleSize = 10 / zoom;
            const isScaling = point.x > bounds.maxX - handleSize && point.y > bounds.maxY - handleSize;
            if (isScaling) {
                setTransform({ type: 'scale', startPoint: point, startBounds: bounds });
                setIsDrawing(false);
                return;
            } else if (point.x > bounds.minX && point.x < bounds.maxX && point.y > bounds.minY && point.y < bounds.maxY) {
                setTransform({ type: 'move', startPoint: point, startBounds: bounds });
                setIsDrawing(false);
                return;
            } else {
                setSelectedStrokes([]);
            }
        }

        setIsDrawing(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        let strokeType: Stroke['type'] = 'pen';
        let config = penConfig;

        switch (tool) {
            case TOOLS.PEN:
            case TOOLS.LINE:
            case TOOLS.RECTANGLE:
            case TOOLS.CIRCLE:
            case TOOLS.TRIANGLE:
            case TOOLS.PENTAGON:
            case TOOLS.HEXAGON:
                strokeType = tool;
                break;
            case TOOLS.HIGHLIGHTER:
                strokeType = 'highlighter';
                config = { size: highlighterSize, color: 'red' }; // internal color is just for path
                break;
            case TOOLS.ERASER:
                strokeType = 'eraser';
                config = { size: eraserSize, color: backgroundColor };
                break;
            case TOOLS.LASSO:
                strokeType = 'lasso';
                config = { size: 1, color: SELECTION_COLOR };
                break;
        }

        setCurrentStroke({
            id: `stroke_${Date.now()}`,
            type: strokeType,
            points: [point],
            config,
            createdAt: tool === TOOLS.HIGHLIGHTER ? Date.now() : undefined,
            start: point,
            end: point,
        });
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const point = getCanvasPoint(e);

        if (isPanning) {
            setPanOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
            return;
        }
        
        if (tool === TOOLS.ERASER_PLUS) {
            if(isDrawing) {
                deleteStrokeAtPoint(point);
            } else {
                // Hover effect
                let found = false;
                for (const stroke of strokes) {
                    for (let i = 0; i < stroke.points.length - 1; i++) {
                        if (distanceFromPointToSegment(point, stroke.points[i], stroke.points[i+1]) < 10 / zoom) {
                             setHoveredStrokeId(stroke.id);
                             found = true;
                             break;
                        }
                    }
                    if (found) break;
                }
                if(!found) setHoveredStrokeId(null);
            }
        }


        if (transform) {
             const transformed = transformStrokes(selectedStrokes, transform.startBounds, point, transform.type, transform.startPoint);
             const selectedIds = new Set(selectedStrokes.map(s => s.id));
             const baseStrokes = strokes.filter(s => !selectedIds.has(s.id));
             setPreviewStrokes([...baseStrokes, ...transformed]);
             return;
        }
        
        if (!isDrawing) return;

        if (currentStroke) {
            const newPoints = [...currentStroke.points, point];
            setCurrentStroke({ ...currentStroke, points: newPoints, end: point });
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDrawing(false);
        setIsPanning(false);

        if (transform) {
            if (previewStrokes) {
                onStrokesChange(previewStrokes, true);
                const originalSelectedIds = new Set(selectedStrokes.map(s => s.id));
                const finalTransformedStrokes = previewStrokes.filter(s => originalSelectedIds.has(s.id));
                setSelectedStrokes(finalTransformedStrokes);
            }
            setPreviewStrokes(null);
            setTransform(null);
            return;
        }

        if (!currentStroke) return;

        if (tool === TOOLS.LASSO) {
            const lassoPath = currentStroke.points;
            const selected = strokes.filter(stroke => {
                let pointsToCheck: Point[] = stroke.points;

                if (stroke.type === 'rectangle' && stroke.start && stroke.end) {
                    pointsToCheck = [
                        { x: stroke.start.x, y: stroke.start.y },
                        { x: stroke.end.x,   y: stroke.start.y },
                        { x: stroke.end.x,   y: stroke.end.y },
                        { x: stroke.start.x, y: stroke.end.y },
                    ];
                } else if (stroke.type === 'line' && stroke.start && stroke.end) {
                    pointsToCheck = [stroke.start, stroke.end];
                } else if (stroke.type === 'circle' && stroke.start) {
                    pointsToCheck = [stroke.start];
                } else if (['triangle', 'pentagon', 'hexagon'].includes(stroke.type)) {
                    pointsToCheck = getPolygonVertices(stroke);
                }

                return pointsToCheck.some(p => isPointInPolygon(p, lassoPath));
            });
            setSelectedStrokes(selected);
            addToast(`${selected.length} item(s) selected`, 'info');
        } else if (([TOOLS.LINE, TOOLS.RECTANGLE, TOOLS.CIRCLE, TOOLS.TRIANGLE, TOOLS.PENTAGON, TOOLS.HEXAGON] as Tool[]).includes(tool)) {
            onStrokesChange([...strokes, currentStroke]);
            setSelectedStrokes([currentStroke]);
        } else {
             onStrokesChange([...strokes, currentStroke]);
        }
        
        setCurrentStroke(null);
    };

    const handleWheel = (e: React.WheelEvent) => {
        const rect = renderCanvasRef.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const wheel = e.deltaY < 0 ? 1.1 : 0.9;
        const newZoom = Math.max(0.1, Math.min(5, zoom * wheel));

        const worldX = (mouseX - panOffset.x) / zoom;
        const worldY = (mouseY - panOffset.y) / zoom;
        
        const newPanX = mouseX - worldX * newZoom;
        const newPanY = mouseY - worldY * newZoom;

        setZoom(newZoom);
        setPanOffset({ x: newPanX, y: newPanY });
    };

    const handleTextCommit = () => {
        const input = textInputRef.current;
        if (input && input.value.trim() !== '') {
            const rect = input.getBoundingClientRect();
            const canvasRect = renderCanvasRef.current!.getBoundingClientRect();
            const startPoint = {
                x: (rect.left - canvasRect.left - panOffset.x) / zoom,
                y: (rect.top - canvasRect.top - panOffset.y) / zoom
            };
            const textStroke: Stroke = {
                id: `text_${Date.now()}`,
                type: 'text',
                points: [startPoint],
                config: penConfig,
                text: input.value,
            };
            onStrokesChange([...strokes, textStroke]);
        }
        if (input) {
            input.value = '';
            input.style.display = 'none';
        }
    };
    
    return (
        <div ref={containerRef} className="w-full h-full relative" onWheel={handleWheel} style={{ touchAction: 'none' }}>
            <canvas ref={renderCanvasRef} style={{ backgroundColor: backgroundColor, position: 'absolute' }}/>
            <canvas
                ref={previewCanvasRef}
                style={{ position: 'absolute', pointerEvents: 'none' }}
            />
             <div 
                className="absolute top-0 left-0 w-full h-full"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            ></div>
            <textarea
                ref={textInputRef}
                className="absolute hidden bg-white/80 text-black border-2 border-blue-500 rounded-md outline-none resize-none p-2 leading-tight backdrop-blur-sm font-sans"
                style={{ transformOrigin: 'top left' }}
                placeholder="Type here..."
                onKeyDown={e => {
                    e.stopPropagation();
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleTextCommit();
                    }
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        textInputRef.current!.value = '';
                        textInputRef.current!.style.display = 'none';
                    }
                }}
                onBlur={handleTextCommit}
            />
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {Math.round(zoom * 100)}%
            </div>
        </div>
    );
};
export default Canvas;