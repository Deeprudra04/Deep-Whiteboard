import { Stroke, Page } from '../types';
import { getBoundingBox } from './geometry';
import { renderStrokes } from './drawing';

// Tell TypeScript that jspdf is available globally
declare const jspdf: any;

const createOffscreenCanvas = (strokes: Stroke[], backgroundColor: string | null, aspectRatio: '4:3' | '16:9') => {
    const BASE_WIDTH = 1920; // High resolution for good quality
    const padding = 40;

    const width = BASE_WIDTH;
    const height = aspectRatio === '16:9' ? (BASE_WIDTH * 9 / 16) : (BASE_WIDTH * 3 / 4);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
    }

    const bounds = getBoundingBox(strokes);

    if (bounds) {
        const boundsWidth = bounds.maxX - bounds.minX;
        const boundsHeight = bounds.maxY - bounds.minY;

        if (boundsWidth > 0 && boundsHeight > 0) {
            const scaleX = (width - padding * 2) / boundsWidth;
            const scaleY = (height - padding * 2) / boundsHeight;
            const scale = Math.min(scaleX, scaleY);

            // Center the drawing
            const offsetX = (width - boundsWidth * scale) / 2 - bounds.minX * scale;
            const offsetY = (height - boundsHeight * scale) / 2 - bounds.minY * scale;

            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(scale, scale);
            renderStrokes(ctx, strokes, Date.now());
            ctx.restore();
        }
    }

    return canvas;
};

export const exportToPNG = (strokes: Stroke[], backgroundColor: string | null, aspectRatio: '4:3' | '16:9') => {
    const canvas = createOffscreenCanvas(strokes, backgroundColor, aspectRatio);
    const dataUrl = canvas.toDataURL('image/png');
    
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'whiteboard.png';
    a.click();
};

export const exportToPDF = (pages: Page[]) => {
    if (pages.length === 0) return;

    const { jsPDF } = jspdf;

    const getPdfPageFormat = (aspectRatio: '4:3' | '16:9'): [number, number] => {
        const BASE_PDF_WIDTH = 1200;
        if (aspectRatio === '16:9') {
            return [BASE_PDF_WIDTH, BASE_PDF_WIDTH * 9 / 16];
        } else { // 4:3
            return [BASE_PDF_WIDTH, BASE_PDF_WIDTH * 3 / 4];
        }
    };
    
    const firstPage = pages[0];
    const firstPageFormat = getPdfPageFormat(firstPage.aspectRatio);

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: firstPageFormat
    });
    
    pages.forEach((page, index) => {
        if (index > 0) {
            const format = getPdfPageFormat(page.aspectRatio);
            doc.addPage(format, 'landscape');
        }
        
        const canvas = createOffscreenCanvas(page.strokes, page.backgroundColor, page.aspectRatio);
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        
        doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    });
    
    doc.save('whiteboard.pdf');
};