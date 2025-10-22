import React, { useState, useRef, useEffect } from 'react';
import { PenConfig, Tool } from '../types';
import { TOOLS, COLORS } from '../constants';
import {
    PenIcon, HighlighterIcon, LineIcon, RectangleIcon, CircleIcon, TextIcon,
    LassoIcon, EraserIcon, EraserPlusIcon, UndoIcon, RedoIcon,
    ExportIcon, PaletteIcon, ChevronDownIcon,
    IconProps, TriangleIcon, PentagonIcon, HexagonIcon
} from './icons';

interface ToolbarProps {
    tool: Tool;
    setTool: (tool: Tool) => void;
    penConfig: PenConfig;
    setPenConfig: (config: PenConfig) => void;
    eraserSize: number;
    setEraserSize: (size: number) => void;
    highlighterSize: number;
    setHighlighterSize: (size: number) => void;
    bgColor: string;
    setBgColor: (color: string) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    exportPNG: (withBackground: boolean) => void;
    exportPDF: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
    tool, setTool, penConfig, setPenConfig, eraserSize, setEraserSize,
    highlighterSize, setHighlighterSize,
    bgColor, setBgColor, undo, redo, canUndo, canRedo,
    exportPNG, exportPDF
}) => {
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
                setOpenGroup(null);
                setShowExportMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const isDrawingTool = ([
        TOOLS.PEN, TOOLS.LINE, TOOLS.RECTANGLE, TOOLS.CIRCLE, TOOLS.TEXT,
        TOOLS.TRIANGLE, TOOLS.PENTAGON, TOOLS.HEXAGON
    ] as Tool[]).includes(tool);

    const toolIcons: { tool: Tool, icon: React.ReactElement<IconProps>, title: string, color: string }[] = [
        { tool: TOOLS.PEN, icon: <PenIcon />, title: 'Pen', color: 'text-blue-400' },
        { tool: TOOLS.HIGHLIGHTER, icon: <HighlighterIcon />, title: 'Highlighter', color: 'text-yellow-400' },
        { tool: TOOLS.LINE, icon: <LineIcon />, title: 'Line', color: 'text-slate-300' },
        { tool: TOOLS.RECTANGLE, icon: <RectangleIcon />, title: 'Rectangle', color: 'text-slate-300' },
        { tool: TOOLS.CIRCLE, icon: <CircleIcon />, title: 'Circle', color: 'text-slate-300' },
        { tool: TOOLS.TRIANGLE, icon: <TriangleIcon />, title: 'Triangle', color: 'text-slate-300' },
        { tool: TOOLS.PENTAGON, icon: <PentagonIcon />, title: 'Pentagon', color: 'text-slate-300' },
        { tool: TOOLS.HEXAGON, icon: <HexagonIcon />, title: 'Hexagon', color: 'text-slate-300' },
        { tool: TOOLS.TEXT, icon: <TextIcon />, title: 'Text', color: 'text-slate-300' },
        { tool: TOOLS.LASSO, icon: <LassoIcon />, title: 'Lasso Select', color: 'text-indigo-400' },
        { tool: TOOLS.ERASER, icon: <EraserIcon />, title: 'Eraser', color: 'text-pink-400' },
        { tool: TOOLS.ERASER_PLUS, icon: <EraserPlusIcon />, title: 'Smart Eraser', color: 'text-red-400' },
    ];
    
    const drawTools = toolIcons.slice(0, 9);
    const selectTools = toolIcons.slice(9, 10);
    const eraseTools = toolIcons.slice(10, 12);

    const toolGroups = [
      { name: 'Draw', tools: drawTools, icon: <PenIcon /> },
      { name: 'Select', tools: selectTools, icon: <LassoIcon /> },
      { name: 'Erase', tools: eraseTools, icon: <EraserIcon /> }
    ];

    return (
        <div className="w-full bg-slate-800 shadow-lg p-2 flex items-center justify-center z-10 select-none border-b border-slate-700/50">
            <div ref={toolbarRef} className="flex items-center justify-between gap-2 text-slate-300">
                <div className="flex items-center gap-1">
                    {toolGroups.map(group => {
                        const isActiveGroup = group.tools.some(t => t.tool === tool);
                        
                        if (group.tools.length === 1) {
                            const singleTool = group.tools[0];
                            return (
                                <button
                                    key={group.name}
                                    onClick={() => setTool(singleTool.tool)}
                                    className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${tool === singleTool.tool ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`}
                                    title={singleTool.title}
                                >
                                    {React.cloneElement(singleTool.icon, { className: `w-6 h-6 ${tool !== singleTool.tool ? singleTool.color : ''}` })}
                                </button>
                            );
                        }

                        return (
                            <div key={group.name} className="relative">
                                <button
                                    onClick={() => setOpenGroup(openGroup === group.name ? null : group.name)}
                                    className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isActiveGroup ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`}
                                    title={group.name}
                                >
                                    {React.cloneElement(isActiveGroup ? group.tools.find(t => t.tool === tool)!.icon : group.icon, { className: 'w-6 h-6' })}
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${openGroup === group.name ? 'rotate-180' : ''}`} />
                                </button>
                                {openGroup === group.name && (
                                    <div className="absolute top-full left-0 mt-2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-1 grid grid-cols-3 gap-1 w-max z-20">
                                        {group.tools.map(({ tool: t, icon, title, color }) => (
                                            <button
                                                key={t}
                                                onClick={() => { setTool(t); setOpenGroup(null); }}
                                                className={`p-2 rounded-md transition-colors ${tool === t ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`}
                                                title={title}
                                            >
                                                {React.cloneElement(icon, { className: `w-6 h-6 ${tool !==t ? color : ''}` })}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                
                <div className="w-px bg-slate-600 h-8 mx-2"></div>

                <div className="flex items-center gap-4">
                    {isDrawingTool && (
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={penConfig.color}
                                onChange={(e) => setPenConfig({ ...penConfig, color: e.target.value })}
                                className="w-8 h-8 p-0 border-none cursor-pointer bg-transparent rounded-lg appearance-none"
                            />
                            <div className="flex items-center gap-1">
                                {COLORS.map(c => (
                                    <button key={c}
                                        onClick={() => setPenConfig({ ...penConfig, color: c })}
                                        style={{ backgroundColor: c }}
                                        className={`w-6 h-6 rounded-full border-2 transition-all ${penConfig.color.toLowerCase() === c ? 'border-blue-400 scale-110' : 'border-slate-600 hover:border-slate-400'}`}
                                    />
                                ))}
                            </div>
                            <input
                                type="range"
                                id="size" min="1" max="50" value={penConfig.size}
                                onChange={(e) => setPenConfig({ ...penConfig, size: +e.target.value })}
                                className="w-24"
                            />
                            <input
                                type="number" value={penConfig.size}
                                onChange={(e) => setPenConfig({ ...penConfig, size: Math.max(1, Math.min(50, +e.target.value)) })}
                                className="w-14 text-center border rounded-md bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                    )}
                    {tool === TOOLS.HIGHLIGHTER && (
                        <div className="flex items-center gap-2">
                            <label htmlFor="highlighterSize" className="text-sm">Size:</label>
                            <input
                                type="range" id="highlighterSize" min="5" max="100" value={highlighterSize}
                                onChange={(e) => setHighlighterSize(+e.target.value)}
                                className="w-24"
                            />
                            <input
                                type="number" value={highlighterSize}
                                onChange={(e) => setHighlighterSize(Math.max(5, Math.min(100, +e.target.value)))}
                                className="w-14 text-center border rounded-md bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                    )}
                    {tool === TOOLS.ERASER && (
                        <div className="flex items-center gap-2">
                            <label htmlFor="eraserSize" className="text-sm">Size:</label>
                            <input
                                type="range" id="eraserSize" min="5" max="100" value={eraserSize}
                                onChange={(e) => setEraserSize(+e.target.value)}
                                className="w-24"
                            />
                            <input
                                type="number" value={eraserSize}
                                onChange={(e) => setEraserSize(Math.max(5, Math.min(100, +e.target.value)))}
                                className="w-14 text-center border rounded-md bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                    )}
                </div>
                <div className="w-px bg-slate-600 h-8 mx-2"></div>
                <div className="flex items-center gap-1">
                    <button onClick={undo} disabled={!canUndo} className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" title="Undo (Ctrl+Z)"><UndoIcon className="w-6 h-6" /></button>
                    <button onClick={redo} disabled={!canRedo} className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" title="Redo (Ctrl+Y)"><RedoIcon className="w-6 h-6" /></button>
                    <div className="relative">
                        <button onClick={() => setShowBgColorPicker(s => !s)} className="p-2 rounded-lg hover:bg-slate-700 flex items-center gap-2" title="Background Color">
                            <PaletteIcon className="w-6 h-6" />
                            <div style={{backgroundColor: bgColor}} className="w-5 h-5 border border-slate-500 rounded-sm"></div>
                        </button>
                        {showBgColorPicker && <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} onBlur={() => setShowBgColorPicker(false)} className="absolute top-full right-0 mt-2 w-12 h-12 z-20" autoFocus/>}
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowExportMenu(s => !s)} className="p-2 rounded-lg hover:bg-slate-700 flex items-center gap-1" title="Export">
                            <ExportIcon className="w-6 h-6" />
                            <ChevronDownIcon className="w-5 h-5"/>
                        </button>
                        {showExportMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg border border-slate-700 z-20">
                                <a onClick={() => { exportPNG(true); setShowExportMenu(false); }} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 cursor-pointer">PNG with background</a>
                                <a onClick={() => { exportPNG(false); setShowExportMenu(false); }} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 cursor-pointer">PNG transparent</a>
                                <a onClick={() => { exportPDF(); setShowExportMenu(false); }} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 cursor-pointer">PDF (all pages)</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Toolbar;