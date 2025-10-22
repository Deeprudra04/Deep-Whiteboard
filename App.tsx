import React, { useState, useEffect, useCallback } from 'react';
import { Page, Tool, PenConfig, Stroke, Toast as ToastType } from './types';
import { TOOLS } from './constants';
import Toolbar from './components/Toolbar';
import PageNavigator from './components/PageNavigator';
import Canvas from './components/Canvas';
import ToastContainer from './components/ToastContainer';
import { exportToPNG, exportToPDF } from './services/export';
import { useHistory } from './hooks/useHistory';
import WelcomeScreen from './components/WelcomeScreen';
import AddPageModal from './components/AddPageModal';

const App: React.FC = () => {
    const [pages, setPages] = useState<Page[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [tool, setTool] = useState<Tool>(TOOLS.PEN);
    const [penConfig, setPenConfig] = useState<PenConfig>({ size: 16, color: '#000000' });
    const [eraserSize, setEraserSize] = useState(20);
    const [highlighterSize, setHighlighterSize] = useState(20);
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const [showAddPageModal, setShowAddPageModal] = useState(false);

    const currentPage = pages[currentPageIndex];

    const {
        state: currentStrokes,
        setState: setCurrentStrokes,
        replaceState: replaceCurrentStrokes,
        undo,
        redo,
        canUndo,
        canRedo,
        getFullHistory,
    } = useHistory<Stroke[]>(currentPage?.strokes ?? [], currentPage?.history ?? { stack: [[]], index: 0 });

    const addToast = useCallback((message: string, type: ToastType['type'] = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(current => current.filter(t => t.id !== id));
        }, 3000);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!currentPage) return;
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                undo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, currentPage]);

    useEffect(() => {
        if (currentPage && currentStrokes !== currentPage.strokes) {
            const newPages = [...pages];
            newPages[currentPageIndex].strokes = currentStrokes;
            setPages(newPages);
        }
    }, [currentStrokes, currentPageIndex, pages, currentPage]);

    const handleStrokesChange = (newStrokes: Stroke[], addToHistory: boolean = true) => {
        if (addToHistory) {
            setCurrentStrokes(newStrokes);
        } else {
            replaceCurrentStrokes(newStrokes);
        }
    };
    
    const saveCurrentPageHistory = () => {
        if (!currentPage) return pages;
        const newPages = [...pages];
        newPages[currentPageIndex].history = getFullHistory();
        return newPages;
    }

    const addPage = (aspectRatio: '4:3' | '16:9') => {
        const newPages = saveCurrentPageHistory();
        const newPage: Page = {
            id: `page_${Date.now()}`,
            strokes: [],
            backgroundColor: '#ffffff',
            history: { stack: [[]], index: 0 },
            aspectRatio: aspectRatio,
        };
        newPages.push(newPage);
        setPages(newPages);
        setCurrentPageIndex(newPages.length - 1);
        addToast('New page added', 'success');
        setShowAddPageModal(false);
    };

    const deletePage = (index: number) => {
        if (pages.length === 1) {
            setPages([]);
            addToast('Page deleted', 'success');
            return;
        }
        
        let newPages = saveCurrentPageHistory();
        newPages = newPages.filter((_, i) => i !== index);
        setPages(newPages);

        if (currentPageIndex >= index) {
            setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
        }
        addToast('Page deleted', 'success');
    };

    const selectPage = (index: number) => {
        if (index === currentPageIndex) return;
        const newPages = saveCurrentPageHistory();
        setPages(newPages);
        setCurrentPageIndex(index);
    };

    const handleBgColorChange = (color: string) => {
        const newPages = [...pages];
        newPages[currentPageIndex].backgroundColor = color;
        setPages(newPages);
    };
    
    const handleExportPNG = (withBackground: boolean) => {
        exportToPNG(currentPage.strokes, withBackground ? currentPage.backgroundColor : 'transparent', currentPage.aspectRatio);
        addToast('Exporting PNG...', 'info');
    };
    
    const handleExportPDF = () => {
        exportToPDF(pages);
        addToast('Exporting PDF...', 'info');
    };

    if (pages.length === 0) {
        return (
            <>
                <WelcomeScreen onAddPage={() => setShowAddPageModal(true)} />
                {showAddPageModal && <AddPageModal onAddPage={addPage} onClose={() => setShowAddPageModal(false)} />}
                <ToastContainer toasts={toasts} />
            </>
        )
    }

    const aspectRatioClass = currentPage.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[4/3]';

    return (
        <div className="h-screen w-screen font-sans overflow-hidden flex flex-col">
            <Toolbar
                tool={tool}
                setTool={setTool}
                penConfig={penConfig}
                setPenConfig={setPenConfig}
                eraserSize={eraserSize}
                setEraserSize={setEraserSize}
                highlighterSize={highlighterSize}
                setHighlighterSize={setHighlighterSize}
                bgColor={currentPage.backgroundColor}
                setBgColor={handleBgColorChange}
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                exportPNG={handleExportPNG}
                exportPDF={handleExportPDF}
            />
            <div 
                className="flex-grow relative bg-slate-900 flex items-center justify-center p-4 overflow-hidden"
                style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px'}}
            >
                <div className={`relative h-full ${aspectRatioClass} max-w-full max-h-full shadow-2xl shadow-black/50`}>
                    <Canvas
                        strokes={currentPage.strokes}
                        onStrokesChange={handleStrokesChange}
                        tool={tool}
                        setTool={setTool}
                        penConfig={penConfig}
                        eraserSize={eraserSize}
                        highlighterSize={highlighterSize}
                        backgroundColor={currentPage.backgroundColor}
                        addToast={addToast}
                    />
                </div>
            </div>
            <PageNavigator
                pages={pages}
                currentPageIndex={currentPageIndex}
                onSelectPage={selectPage}
                onAddPage={() => setShowAddPageModal(true)}
                onDeletePage={deletePage}
            />
            {showAddPageModal && <AddPageModal onAddPage={addPage} onClose={() => setShowAddPageModal(false)} />}
            <ToastContainer toasts={toasts} />
        </div>
    );
};

export default App;