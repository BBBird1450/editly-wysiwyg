# Roadmap

## Content Limits & Validation
- [ ] `maxLength` - Character limit
- [ ] `maxWords` - Word count limit
- [ ] `readOnly` - Make editor non-editable
- [ ] `disabled` - Disable editor completely

## Formatting Tools
- [ ] `strikethrough` - Strike-through text
- [ ] `subscript` / `superscript` - Scientific notation
- [ ] `indent` / `outdent` - Text indentation
- [ ] `removeFormat` - Clear all formatting
- [ ] `fontFamily` - Font selection dropdown

## Media & Embeds
- [ ] `insertVideo` - Video embed support
- [ ] `insertAudio` - Audio embed
- [ ] `insertEmoji` - Emoji picker
- [ ] `insertFile` - File attachments
- [ ] `embedUrl` - Auto-embed URLs (YouTube, Twitter, etc.)

## Advanced Features
- [ ] `mentions` - @mention support with autocomplete
- [ ] `hashtags` - #hashtag support
- [ ] `templates` - Predefined content templates
- [ ] `snippets` - Reusable text snippets
- [ ] `findReplace` - Find and replace text
- [ ] `showCharCount` - Live character counter in toolbar
- [ ] `showWordCount` - Live word counter in toolbar

## Collaboration
- [ ] `onPaste` - Handle paste events
- [ ] `onCopy` - Handle copy events
- [ ] `onCut` - Handle cut events
- [ ] `onFocus` / `onBlur` - Focus/blur callbacks

## Content Control
- [ ] `allowedTags` - Whitelist HTML tags
- [ ] `blockedTags` - Blacklist HTML tags
- [ ] `sanitizeHtml` - Auto-sanitize on paste
- [ ] `pasteAsPlainText` - Force plain text paste
- [ ] `maxImageSize` - Limit image file size
- [ ] `allowedImageTypes` - Restrict image formats

## UI/UX Enhancements
- [ ] `toolbarSticky` - Sticky toolbar on scroll
- [ ] `fullscreenMode` - Fullscreen editing
- [ ] `darkMode` - Built-in dark mode toggle
- [ ] `compactMode` - Smaller toolbar/UI

## Keyboard Shortcuts
- [ ] `shortcuts` - Custom keyboard shortcuts
- [ ] `disableShortcuts` - Disable default shortcuts

## Content Processing
- [ ] `onBeforeChange` - Validate before change
- [ ] `onPasteHtml` - Process pasted HTML
- [ ] `autoCorrect` - Auto-correct common typos
- [ ] `autoLink` - Auto-convert URLs to links

## Export/Import
- [ ] `importFromWord` - Import .docx files
- [ ] `printMode` - Print-friendly view

## Accessibility
- [ ] `ariaLabel` - ARIA label for editor
- [ ] `ariaDescribedBy` - ARIA description
- [ ] `tabIndex` - Custom tab index
- [ ] `accessibilityChecker` - Check content accessibility

## Performance
- [ ] `debounceDelay` - Debounce onChange calls
- [ ] `lazyLoad` - Lazy load toolbar tools
- [ ] `virtualScroll` - For very long content

## Completed Features
- [x] `strikethrough` - Strike-through text formatting ✅
- [x] `indent` / `outdent` - Text indentation ✅
- [x] `removeFormat` - Clear all formatting ✅
- [x] `fontFamily` - Font selection dropdown ✅
- [x] `readOnly` - Make editor non-editable ✅
- [x] `disabled` - Disable editor completely ✅
- [x] `fullscreenMode` - Fullscreen editing ✅

## Priority Features (Next Release)
1. **maxLength/maxWords** - Content limits
2. **showCharCount/showWordCount** - User feedback
3. **findReplace** - Essential for long content
4. **sanitizeHtml** - Security enhancement
5. **mentions/hashtags** - Social features
