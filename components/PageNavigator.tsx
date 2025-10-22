import React, { useRef, useEffect } from 'react';
import { Page } from '../types';
import { renderStrokes } from '../services/drawing';
import { PlusIcon, TrashIcon } from './icons';

interface PageNavigatorProps {
    pages: Page[];
    currentPageIndex: number;
    onSelectPage: (index: number) => void;
    onAddPage: () => void;
    onDeletePage: (index: number) => void;
}

const PageNavigator: React.FC<PageNavigatorProps> = ({ pages, currentPageIndex, onSelectPage, onAddPage, onDeletePage }) => {
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        pages.forEach((page, index) => {
            const canvas = canvasRefs.current[index];
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    const { width, height } = canvas.getBoundingClientRect();
                    const dpr = window.devicePixelRatio || 1;
                    canvas.width = width * dpr;
                    canvas.height = height * dpr;
                    ctx.scale(dpr, dpr);
                    
                    ctx.fillStyle = page.backgroundColor;
                    ctx.fillRect(0, 0, width, height);

                    // Find a common bounding box for all strokes to calculate scale
                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                    page.strokes.forEach(s => s.points.forEach(p => {
                        minX = Math.min(minX, p.x);
                        minY = Math.min(minY, p.y);
                        maxX = Math.max(maxX, p.x);
                        maxY = Math.max(maxY, p.y);
                    }));

                    const worldWidth = maxX - minX;
                    const worldHeight = maxY - minY;
                    
                    if (isFinite(worldWidth) && worldWidth > 0 && isFinite(worldHeight) && worldHeight > 0) {
                        const scale = Math.min(width / worldWidth, height / worldHeight) * 0.9;
                        ctx.save();
                        ctx.translate(width/2, height/2);
                        ctx.scale(scale, scale);
                        ctx.translate(-(minX + worldWidth/2), -(minY + worldHeight/2));
                        renderStrokes(ctx, page.strokes, 1);
                        ctx.restore();
                    } else {
                        renderStrokes(ctx, page.strokes, 1);
                    }
                }
            }
        });
    }, [pages, currentPageIndex]);
    
    useEffect(() => {
        const activePage = containerRef.current?.querySelector('.border-blue-500');
        activePage?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [currentPageIndex]);

    return (
        <div className="w-full bg-gray-100/90 backdrop-blur-sm shadow-inner p-1 flex items-center justify-center z-10 select-none border-t border-gray-200 gap-2">
            <div ref={containerRef} className="flex items-center gap-2 overflow-x-auto py-1 max-w-[80vw]">
                {pages.map((page, index) => (
                    <div
                        key={page.id}
                        onClick={() => onSelectPage(index)}
                        className={`group relative p-0.5 rounded-md cursor-pointer border-2 flex-shrink-0 w-24 h-[54px] flex flex-col items-center justify-center transition-all ${currentPageIndex === index ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-200'}`}
                    >
                        <canvas
                            ref={el => { canvasRefs.current[index] = el; }}
                            className="w-full h-full bg-white rounded-sm shadow-sm pointer-events-none"
                        />
                        <div className="absolute bottom-1 text-[10px] font-medium text-gray-600 bg-white/60 px-1 rounded">Page {index + 1}</div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeletePage(index);
                            }}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-white/50 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-80 hover:!opacity-100 transition-opacity"
                            title={`Delete Page ${index + 1}`}
                        >
                           <TrashIcon className="w-3.5 h-3.5"/>
                        </button>
                    </div>
                ))}
            </div>
            <div className="w-px bg-gray-300 h-12 self-center"></div>
            <button
                onClick={onAddPage}
                className="h-[54px] w-14 flex-shrink-0 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                title="Add Page"
            >
                <PlusIcon className="w-6 h-6"/>
            </button>
        </div>
    );
};

export default PageNavigator;