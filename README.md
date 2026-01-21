# High-Performance DataGrid Assessment

A production-grade, accessible, and high-performance DataGrid component built with React 19, TypeScript, and Tailwind CSS.

##  Features

-   **Virtualization**: Efficiently renders 100,000+ rows using a custom virtualization engine, maintaining 60 FPS scrolling.
-   **Pinned Columns**: Support for "Sticky" columns on both left and right sides.
-   **Multi-Column Sorting**: Shift + Click headers to sort by multiple criteria with priority indicators.
-   **Column Resizing**: Real-time drag-and-drop column width adjustment.
-   **Inline Editing**: Double-click cells to edit data with built-in validation support.
-   **Undo Support**: `Ctrl + Z` functionality for cell edits.
-   **Keyboard Navigation**: Full arrow key navigation support between cells and headers.
-   **A11y Compliant**: 0 Axe-core violations, valid ARIA hierarchy, and visible focus indicators.

##  Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/MohdShadab552004/data-grid-assessment.git
cd data-grid-assessment

# Install dependencies
npm install
```

### Development
```bash
# Start Vite development server
npm run dev

# Start Storybook for component isolation/testing
npm run storybook
```

### Build & Lint
```bash
# Run linting
npm run lint

# Build for production
npm run build
```

## Reports

Detailed analysis regarding the component's architecture and quality:

-   **[Final DataGrid Submission Report](./Final_DataGrid_Submission_Report.md)**: Comprehensive technical audit including API Docs, Performance metrics, and Accessibility fixes.

## Accessibility Compliance
- **Status**: Passing (0 violations)
- **Keyboard**: Arrow key navigation, Tab sequence entry, and visible focus rings.
- **ARIA**: Validated roles (`grid`, `rowgroup`, `row`, `columnheader`, `gridcell`).

##  Performance Summary
- **Dataset**: Tested with 50,000 rows.
- **Scrolling**: Fluid 60 FPS vertical and horizontal scrolling.
- **Latency**: Sub-200ms sorting and negligible resizing lag.

