
# Deep White Board

A powerful, feature-rich digital whiteboard application built with React and TypeScript by Deep Rudra. Perfect for teaching, presentations, note-taking, and collaborative drawing sessions.

## 🚀 Features

### Drawing Tools
- **Pen Tool**: Draw with customizable size and color
- **Highlighter**: Semi-transparent highlighting with glow effects
- **Eraser**: Remove strokes with adjustable size
- **Shapes**: Draw lines, rectangles, circles, triangles, pentagons, and hexagons
- **Text Tool**: Add text annotations
- **Lasso Tool**: Select and manipulate existing strokes

### Canvas Management
- **Multiple Pages**: Create and manage multiple whiteboard pages
- **Page Navigation**: Easy switching between pages with visual thumbnails
- **Aspect Ratios**: Support for both 4:3 and 16:9 page formats
- **Background Colors**: Customizable page backgrounds

### History & Editing
- **Undo/Redo**: Full history support with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- **Stroke Manipulation**: Move, resize, and delete selected strokes
- **Real-time Editing**: Smooth drawing experience with touch and mouse support

### Export Options
- **PNG Export**: High-quality image export with or without background
- **PDF Export**: Multi-page PDF export with proper formatting
- **High Resolution**: 1920px base resolution for crisp exports

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Toast Notifications**: User feedback for all actions
- **Keyboard Shortcuts**: Efficient workflow with hotkeys
- **Touch Support**: Full touch and stylus support for tablets

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Quick Start (Windows)
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Deep-Whiteboard
   ```

2. **Run the application**:
   - Double-click `run-whiteboard.bat` 
   - The script will automatically install dependencies and start the server
   - Your browser will open automatically at `http://localhost:8080`

### Manual Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8080`

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
gemini-whiteboard/
├── components/          # React components
│   ├── Canvas.tsx      # Main drawing canvas
│   ├── Toolbar.tsx     # Drawing tools and controls
│   ├── PageNavigator.tsx # Page management
│   └── ...
├── services/           # Core functionality
│   ├── drawing.ts      # Drawing algorithms
│   ├── export.ts       # Export functionality
│   └── geometry.ts     # Geometric calculations
├── hooks/              # Custom React hooks
├── types.ts            # TypeScript definitions
├── constants.ts        # Application constants
└── run-whiteboard.bat  # Windows startup script
```

## 🎨 Usage

1. **Start Drawing**: Select a tool from the toolbar and begin drawing
2. **Add Pages**: Click the "+" button to create new pages
3. **Navigate**: Use the page navigator at the bottom to switch between pages
4. **Export**: Use the export buttons to save as PNG or PDF
5. **Undo/Redo**: Use Ctrl+Z and Ctrl+Y for history navigation

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (implied from class usage)
- **Export**: jsPDF for PDF generation
- **Canvas**: HTML5 Canvas API

  
## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
**Copyright (c) 2024 Deep Rudra**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

**Keep the terminal/command prompt window open while using the application to maintain the server connection.**
