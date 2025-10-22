import React from 'react';

const iconProps = {
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor"
};

// FIX: Export IconProps to be used in other components for better type inference.
export type IconProps = React.SVGProps<SVGSVGElement>;

export const PenIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
export const HighlighterIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path><path d="M15 5l4 4"></path><path d="M22 17.5l-2.5-2.5"></path><path d="M19.5 15l-2.5-2.5"></path></svg>;
export const LineIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><line x1="5" y1="19" x2="19" y2="5"></line></svg>;
export const RectangleIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>;
export const CircleIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><circle cx="12" cy="12" r="10"></circle></svg>;
export const TriangleIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M12 2L2 22h20L12 2z"></path></svg>;
export const PentagonIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M12 2l10 7.25L17.5 22H6.5L2 9.25z"></path></svg>;
export const HexagonIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M12 2l10 6v12l-10 6-10-6V8z"></path></svg>;
export const TextIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M17 6.1H7a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V8.1h1.9V17H11a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2h-1.1V8.1H16a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Z"></path></svg>;
export const LassoIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M11.25 5.513A5.002 5.002 0 0 1 12 5a5 5 0 0 1 4.782 3.327c.453 1.111.453 2.234 0 3.346A5.002 5.002 0 0 1 12 15a5 5 0 0 1-4.782-3.327c-.453-1.111-.453-2.234 0-3.346A4.985 4.985 0 0 1 11.25 5.513z"></path><path d="M14.5 5.5c-1-2.5-3-2.5-3-2.5s-2 0-3 2.5"></path><path d="M11 15.5c-1 2.5-2.5 2.5-2.5 2.5s-1.5 0-2.5-2.5"></path><path d="M12 15.5V17.5"></path><path d="M12 2v3.5"></path></svg>;
export const MoveIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"></path></svg>;
export const EraserIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M19.38 6.62a1 1 0 0 0-1.42 0l-11 11a1 1 0 0 0 0 1.41l2.83 2.83a1 1 0 0 0 1.41 0l11-11a1 1 0 0 0 0-1.42zM12 22l-4-4"></path></svg>;
export const EraserPlusIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M19.38 6.62a1 1 0 0 0-1.42 0l-11 11a1 1 0 0 0 0 1.41l2.83 2.83a1 1 0 0 0 1.41 0l11-11a1 1 0 0 0 0-1.42zM12 22l-4-4M12.5 6.5l3 3"></path></svg>;
export const UndoIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M21 13v-2a4 4 0 0 0-4-4H8L12 3"></path><path d="M3 13h6a4 4 0 0 1 4 4v4"></path><path d="M7 17l-4-4 4-4"></path></svg>;
export const RedoIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M3 13v-2a4 4 0 0 1 4-4h11l-4-4"></path><path d="M21 13h-6a4 4 0 0 0-4 4v4"></path><path d="M17 17l4-4-4-4"></path></svg>;
export const ClearIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path></svg>;
export const ExportIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
export const PaletteIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="15.5" cy="15.5" r=".5" fill="currentColor"></circle><circle cx="10.5" cy="17.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="13.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>;
export const ChevronDownIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><polyline points="6 9 12 15 18 9"></polyline></svg>;
export const PlusIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
export const TrashIcon: React.FC<IconProps> = (props) => <svg {...iconProps} {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

export const getEraserSvg = (size: number, color: string) => {
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="rgba(255, 255, 255, 0.5)"/></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};