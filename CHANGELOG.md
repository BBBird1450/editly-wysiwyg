# Changelog

## [1.3.0] - 2025-12-19

### Added
- `readOnly` prop - Make editor non-editable
- `disabled` prop - Disable editor completely with visual feedback
- `strikethrough` tool - Strike-through text formatting
- `indent` / `outdent` tools - Text indentation control
- `removeFormat` tool - Clear all formatting from selected text
- `fontFamily` tool - Font selection dropdown with 6 common fonts
- `fullscreen` tool - Toggle fullscreen editing mode
- Smart list exit: pressing backspace in an empty list item now exits list mode

### Fixed
- Fixed all TypeScript compilation errors with Node type assertions
- Fixed list HTML structure - lists are no longer wrapped in `<p>` tags
- Fixed backspace behavior in empty list items to exit list mode for both ordered and unordered lists
- Added null checks for parentNode operations to prevent runtime errors
- Fully translated elements
- Fixed background color and text color application in list items - now properly handles single and multiple list item selections without creating empty list items
- Added ESC key handler to close all modals, dropdowns, and exit fullscreen
