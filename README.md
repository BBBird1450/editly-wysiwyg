# Editly

A lightweight, contextual WYSIWYG editor for React applications with advanced features and SEO guidance.

[![npm version](https://img.shields.io/npm/v/editly-wysiwyg.svg)](https://www.npmjs.com/package/editly-wysiwyg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://bbbird1450.github.io/editly-wysiwyg/) | [Documentation](https://github.com/BBBird1450/editly-wysiwyg#readme) | [NPM Package](https://www.npmjs.com/package/editly-wysiwyg)

## Features

- **Contextual Mode**: Smart toolbar appears on selection/click with transparent overlay
- **Full Mode**: Always-visible toolbar with configurable positioning
- **Advanced Tables**: Insert, edit, add/remove rows/columns, toggle headers
- **Image Management**: Upload, URL insertion, asset library, click-to-edit with full control (size, alt, link, classes, object-fit, border-radius, alignment)
- **Text Alignment**: Left, center, right, and justify alignment in dropdown
- **Flex Blocks**: 8 prebuilt layout templates (columns, rows, hero, media) with customizable spacing and borders
- **SEO Analysis**: Real-time content analysis and suggestions
- **Auto-Save**: Built-in localStorage persistence with storageKey and autoSave props
- **Color Tools**: Text color and background highlighting with color picker
- **Typography**: Font size control, headers (H1-H6), quotes, code blocks
- **Code Protection**: Formatting disabled inside code blocks to preserve syntax
- **Smart Positioning**: Toolbar automatically adjusts to stay within screen bounds
- **Export Options**: Built-in HTML, Text, and Markdown export (no heavy dependencies)
- **Custom Icons**: Support for any icon library (Ant Design, Feather, etc.)
- **Multilingual**: Built-in i18n support with customizable labels
- **TypeScript**: Full TypeScript support with proper types
- **Mobile Optimized**: Touch-friendly responsive interface

## Compatibility

- **React**: 16.8+ (Hooks support required) - Supports React 19
- **Next.js**: Compatible with Next.js 13, 14, 15+
- **Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **TypeScript**: Full TypeScript support included
- **Tailwind CSS**: Required for styling

## Installation

```bash
npm install editly-wysiwyg
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { WysiwygEditor } from 'editly-wysiwyg';

function App() {
  const [content, setContent] = useState('');

  return (
    <WysiwygEditor
      value={content}
      onChange={setContent}
      mode="contextual"
      placeholder="Start typing..."
    />
  );
}
```

## Advanced Usage

```tsx
import { WysiwygEditor } from 'editly-wysiwyg';
import { BoldOutlined } from '@ant-design/icons';

const assetLibrary = [
  {
    url: 'https://example.com/image1.jpg',
    thumbnail: 'https://example.com/thumb1.jpg',
    alt: 'Product photo',
    name: 'Product 1'
  }
];

function AdvancedEditor() {
  const [content, setContent] = useState('');

  return (
    <WysiwygEditor
      value={content}
      onChange={setContent}
      mode="full"
      toolbarPosition="top"
      autoResize={true}
      showSeoGuide={true}
      assetLibrary={assetLibrary}
      customIcons={{
        bold: <BoldOutlined />
      }}
      tools={['bold', 'italic', 'table', 'textColor', 'insertImage']}
      labels={{
        bold: 'Negrita',
        italic: 'Cursiva'
      }}
      onImageUpload={async (file) => {
        // Custom upload logic
        return 'https://your-cdn.com/uploaded-image.jpg';
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | The HTML content of the editor |
| `onChange` | `(html: string) => void` | - | Callback when content changes |
| `mode` | `'full' \| 'contextual'` | `'contextual'` | Toolbar display mode |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `iconSet` | `'outline' \| 'solid'` | `'outline'` | Built-in icon style |
| `tools` | `string[]` | All tools | Array of enabled tools |
| `minHeight` | `string` | `'200px'` | Minimum editor height |
| `autoResize` | `boolean` | `false` | Auto-resize editor to content |
| `toolbarPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Toolbar position (full mode) |
| `showSeoGuide` | `boolean` | `false` | Show SEO analysis panel |
| `assetLibrary` | `Asset[]` | `[]` | Predefined images for selection |
| `customIcons` | `object` | `{}` | Custom icon components |
| `customButtons` | `CustomButton[]` | `[]` | Custom toolbar buttons |
| `theme` | `Theme` | `defaultTheme` | Color scheme customization |
| `lang` | `'en'\|'es'\|'fr'\|'de'\|'it'\|'fa'\|'pl'` | - | Built-in language |
| `labels` | `object` | `{}` | Custom text labels (overrides lang) |
| `imageUploadUrl` | `string` | - | API endpoint for image uploads |
| `onImageUpload` | `(file: File) => Promise<string>` | - | Custom image upload handler |
| `onToolClick` | `(toolName: string) => void` | - | Callback when toolbar button clicked |
| `onContentChange` | `(html: string, text: string, wordCount: number) => void` | - | Callback with detailed content info |
| `onSelectionChange` | `(hasSelection: boolean, selectedText: string) => void` | - | Callback when text selection changes |
| `spellCheck` | `boolean` | `true` | Enable browser native spell checking |
| `language` | `string` | `'en'` | Language code for spell checking |
| `showExportOptions` | `boolean` | `false` | Show export options panel |
| `storageKey` | `string` | - | LocalStorage key for auto-save |
| `autoSave` | `boolean` | `false` | Enable automatic localStorage persistence |
| `id` | `string` | - | Unique identifier for the editor instance |
| `readOnly` | `boolean` | `false` | Make editor non-editable (content visible but not modifiable) |
| `disabled` | `boolean` | `false` | Disable editor completely with visual feedback |

## Available Tools

- `bold`, `italic`, `underline`, `strikethrough` - Text formatting
- `textColor`, `backgroundColor` - Color tools with picker
- `fontSize` - Font size selection
- `fontFamily` - Font family selection (Arial, Courier New, Georgia, Times New Roman, Trebuchet MS, Verdana)
- `header` - Headers H1-H6 and paragraph
- `align` - Text alignment (left, center, right, justify)
- `indent`, `outdent` - Text indentation
- `removeFormat` - Clear all formatting
- `createLink` - Link insertion
- `insertUnorderedList`, `insertOrderedList` - Lists
- `table` - Advanced table management
- `insertImage` - Image insertion with click-to-edit (URL, alt, link, size, classes, object-fit, border-radius, alignment)
- `quote` - Blockquotes (automatically wraps selected text)
- `code` - Code blocks (protects content from formatting)
- `insertHorizontalRule` - Horizontal lines
- `math` - Math formula insertion (LaTeX support)
- `flexBlock` - Prebuilt layout blocks with customization
- `fullscreen` - Toggle fullscreen editing mode
- `undo`, `redo` - History management
- `viewSource` - HTML source toggle

## Asset Library Format

```tsx
type Asset = {
  url: string;           // Full image URL
  thumbnail?: string;    // Optional thumbnail URL
  alt?: string;         // Alt text
  name?: string;        // Display name
};
```

## Custom Icons

Support for any React component as icons:

```tsx
import { BoldOutlined, ItalicOutlined } from '@ant-design/icons';
import { Bold, Italic } from 'react-feather';

<WysiwygEditor 
  customIcons={{
    bold: <BoldOutlined />,
    italic: <Italic size={16} />,
    // Any React component works
  }}
/>
```

## Internationalization

### Using Built-in Languages

```tsx
<WysiwygEditor lang="es" />  {/* Spanish */}
<WysiwygEditor lang="fr" />  {/* French */}
<WysiwygEditor lang="de" />  {/* German */}
<WysiwygEditor lang="it" />  {/* Italian */}
<WysiwygEditor lang="pl" />  {/* Polish */}
<WysiwygEditor lang="fa" />  {/* Persian */}
```

### Using Translation Object

```tsx
import { WysiwygEditor, translations } from 'editly-wysiwyg';

<WysiwygEditor labels={translations.es} />
```

### Custom Labels (Override Specific Translations)

```tsx
<WysiwygEditor 
  lang="es"
  labels={{
    bold: 'Custom Bold Text',
    insertImage: 'My Custom Image Label'
  }}
/>
```

**Supported Languages:** English (en), Spanish (es), French (fr), German (de), Italian (it), Persian (fa), Polish (pl)

## SEO Features

- Real-time content analysis
- Word count monitoring
- H1 tag validation
- Image alt text checking
- Link text analysis
- Content structure suggestions

## Export Options

- **HTML Export**: Download content as HTML file
- **Text Export**: Download as plain text (strips all formatting)
- **Markdown Export**: Convert HTML to Markdown format
- **No PDF/Word**: Lightweight solution without heavy format dependencies

## Spell Check

- **Browser Native**: Uses built-in browser spell checking
- **Language Support**: Set language code for proper spell checking
- **No Dependencies**: No additional libraries required
- **Automatic**: Works with user's browser language preferences

## Smart Behavior

- **Auto Paragraph Wrapping**: Plain text automatically wrapped in `<p>` tags
- **Code Block Protection**: Formatting tools disabled inside code blocks
- **Smart Toolbar Positioning**: Contextual toolbar avoids screen edges and text overlap
- **Transparent Overlay**: Contextual toolbar becomes transparent to avoid blocking content
- **Auto-hide on Typing**: Toolbar disappears when user starts typing
- **Click-to-Show**: Toolbar appears after brief delay when clicking without typing
- **Smart List Exit**: Press backspace in empty list item to exit list mode
- **Clean HTML Output**: Lists properly structured outside paragraph tags

## Styling

The component uses Tailwind CSS classes. Ensure Tailwind CSS is configured in your project.

## Built-in Export

- **Always Available**: Export buttons appear in bottom-right corner of editor
- **Three Formats**: HTML, Plain Text, and Markdown
- **No External Dependencies**: Uses browser Blob API for downloads
- **Lightweight**: No PDF or Word export to keep package size minimal

## Theming

Customize the editor's color scheme:

```tsx
import { WysiwygEditor } from 'editly-wysiwyg';

<WysiwygEditor 
  theme={{
    primary: '#10b981',        // Focus ring color
    background: '#ffffff',     // Editor background
    border: '#d1d5db',        // Border color
    text: '#111827',          // Text color
    toolbarBg: '#f9fafb',     // Toolbar background
    toolbarHover: '#e5e7eb',  // Toolbar button hover
    buttonActive: '#d1fae5'   // Active button background
  }}
/>
```

### Pre-defined Themes

```tsx
import { WysiwygEditor, defaultTheme } from 'editly-wysiwyg';

// Dark theme example
const darkTheme = {
  primary: '#3b82f6',
  background: '#1f2937',
  border: '#374151',
  text: '#f9fafb',
  toolbarBg: '#111827',
  toolbarHover: '#374151',
  buttonActive: '#1e40af'
};

<WysiwygEditor theme={darkTheme} />
```

## Custom Buttons

Add your own toolbar buttons with custom functionality:

```tsx
<WysiwygEditor
  customButtons={[
    {
      name: 'highlight',
      icon: <span>🔆</span>,
      title: 'Highlight Text',
      action: (editor) => {
        const selection = window.getSelection();
        if (selection?.rangeCount) {
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          span.style.backgroundColor = 'yellow';
          span.appendChild(range.extractContents());
          range.insertNode(span);
        }
      }
    },
    {
      name: 'uppercase',
      icon: <span style={{ fontWeight: 'bold' }}>AA</span>,
      title: 'Convert to Uppercase',
      action: (editor) => {
        const selection = window.getSelection();
        const text = selection?.toString().toUpperCase();
        if (text) document.execCommand('insertText', false, text);
      }
    },
    {
      name: 'insertDate',
      icon: <span>📅</span>,
      title: 'Insert Current Date',
      action: (editor) => {
        const date = new Date().toLocaleDateString();
        document.execCommand('insertText', false, date);
      }
    }
  ]}
/>
```

## LocalStorage Persistence

### Built-in Auto-Save

The editor has built-in localStorage support:

```tsx
<WysiwygEditor
  storageKey="my_editor_content"
  autoSave={true}
  value={content}
  onChange={setContent}
/>
```

### Manual Implementation

Or implement your own with dynamic prefixes:

```tsx
function MyEditor({ editorId = 'default', storagePrefix = 'wysiwyg' }) {
  const STORAGE_KEY = `${storagePrefix}_${editorId}_content`;
  
  const [content, setContent] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, content);
    } catch {}
  }, [content, STORAGE_KEY]);

  return (
    <WysiwygEditor
      value={content}
      onChange={setContent}
    />
  );
}
```

### Multiple Editors

Use unique storage keys for multiple editors:

```tsx
// Blog post editor
<WysiwygEditor storageKey="blog_post" autoSave={true} />

// Comment editor
<WysiwygEditor storageKey="comment" autoSave={true} />

// Email editor
<WysiwygEditor storageKey="email" autoSave={true} />
```

## Event Callbacks

Track user interactions and content changes:

```tsx
function MyEditor() {
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [lastTool, setLastTool] = useState('');

  return (
    <>
      <WysiwygEditor
        onContentChange={(html, text, wordCount) => {
          console.log('Content changed:', { html, text, wordCount });
          setStats({ words: wordCount, chars: text.length });
        }}
        onSelectionChange={(hasSelection, selectedText) => {
          console.log('Selection:', { hasSelection, selectedText });
          setSelectedText(selectedText);
        }}
        onToolClick={(toolName) => {
          console.log('Tool clicked:', toolName);
          setLastTool(toolName);
        }}
      />
      
      <div>
        <p>Words: {stats.words} | Characters: {stats.chars}</p>
        <p>Selected: {selectedText}</p>
        <p>Last tool: {lastTool}</p>
      </div>
    </>
  );
}
```

### Callback Details

- **onContentChange**: Fires on every content modification
  - `html`: Full HTML content
  - `text`: Plain text (stripped HTML)
  - `wordCount`: Number of words

- **onSelectionChange**: Fires when text selection changes
  - `hasSelection`: Boolean indicating if text is selected
  - `selectedText`: The selected text string

- **onToolClick**: Fires when any toolbar button is clicked
  - `toolName`: Name/ID of the clicked tool

## Image Editing

Click any image in the editor to see an "Edit" button that opens a modal with:

- **Image URL**: Change the image source
- **Link URL**: Wrap image in clickable link (optional)
- **Alt Text**: Update accessibility text
- **Width & Height**: Set dimensions (px, %, auto, etc.)
- **Object Fit**: Choose cover, contain, fill, none, or scale-down
- **Border Radius**: Set rounded corners (e.g., 50% for circle)
- **Alignment**: Default, Center, Left, or Right
- **CSS Classes**: Add custom classes (space-separated)
- **Delete**: Remove the image

```tsx
// Images can be styled directly in the editor
// Click image → Edit → Set properties
// Example result:
<img 
  src="photo.jpg" 
  alt="Profile" 
  style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;"
  class="avatar shadow-lg"
/>
```

## Flex Layout Blocks

Insert prebuilt responsive layout blocks with the `flexBlock` tool:

### Available Templates

1. **2 Columns** - Equal width side-by-side layout
2. **3 Columns** - Three equal columns
3. **4 Columns** - Four equal columns
4. **Sidebar Layout** - 2/3 main content + 1/3 sidebar
5. **2 Rows** - Stacked vertical layout
6. **Media Object** - Image + text side-by-side
7. **Centered Content** - Centered block
8. **Hero Section** - Large image with title and description

### Customization Options

- **Gap Between Items**: Adjust spacing (e.g., 10px, 1rem)
- **Padding**: Control internal spacing
- **Border Style**: Dashed, Solid, or None

### Usage

```tsx
<WysiwygEditor
  tools={['flexBlock', 'bold', 'italic']}
/>
```

Click the Flex Block button → Choose template → Customize → Insert. All blocks use placeholder images that can be replaced by clicking them.

## Creating Custom Layouts

**Option 1: Use Flex Blocks** (Recommended)
```tsx
// Click Flex Block tool → Choose "Media Object" template
// Customize spacing and borders
// Replace placeholder image and edit text
```

**Option 2: Use Tables**
```tsx
// Insert 1-row, 2-column table
// Left cell: Add image
// Right cell: Add name and details
```

**Option 3: Use HTML Source**
```tsx
// Click "View Source" tool and paste:
<div style="display: flex; gap: 10px; align-items: center;">
  <img src="avatar.jpg" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
  <div>
    <div style="font-weight: bold;">John Doe</div>
    <div style="color: gray;">+1 234 567 890</div>
  </div>
</div>
```

## License

MIT