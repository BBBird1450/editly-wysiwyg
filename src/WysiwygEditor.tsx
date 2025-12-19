import React, { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import type { Theme } from './translations';
import { defaultTheme, translations } from './translations';

export interface WysiwygEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  mode?: 'full' | 'contextual';
  placeholder?: string;
  iconSet?: 'outline' | 'solid';
  tools?: string[];
  minHeight?: string;
  autoResize?: boolean;
  imageUploadUrl?: string;
  onImageUpload?: (file: File) => Promise<string>;
  assetLibrary?: Array<{ url: string; alt?: string; name?: string; thumbnail?: string }>;
  customIcons?: { [key: string]: React.ReactNode };
  showSeoGuide?: boolean;
  toolbarPosition?: 'top' | 'bottom' | 'left' | 'right';
  spellCheck?: boolean;
  language?: string;
  showExportOptions?: boolean;
  theme?: Theme;
  lang?: 'en' | 'es' | 'fr' | 'de' | 'it' | 'fa' | 'pl';
  customButtons?: Array<{
    name: string;
    icon: React.ReactNode;
    title: string;
    action: (editor: HTMLDivElement | null) => void;
  }>;
  onToolClick?: (toolName: string) => void;
  onContentChange?: (html: string, text: string, wordCount: number) => void;
  onSelectionChange?: (hasSelection: boolean, selectedText: string) => void;
  storageKey?: string;
  autoSave?: boolean;
  id?: string;
  readOnly?: boolean;
  disabled?: boolean;
  labels?: {
    bold?: string;
    italic?: string;
    underline?: string;
    link?: string;
    headers?: string;
    bulletList?: string;
    numberList?: string;
    horizontalRule?: string;
    image?: string;
    viewSource?: string;
    quote?: string;
    code?: string;
    table?: string;
    insertLink?: string;
    insertImage?: string;
    insertImageUrl?: string;
    enterUrl?: string;
    enterImageUrl?: string;
    altText?: string;
    uploadFile?: string;
    fromUrl?: string;
    cancel?: string;
    ok?: string;
    exportOptions?: string;
    exportHtml?: string;
    exportText?: string;
    exportMarkdown?: string;
    [key: string]: string | undefined;
  };
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  placeholder: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, title, placeholder }) => {
  const [value, setValue] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue('');
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white p-6 rounded-lg w-96 animate-slideIn">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder={placeholder}
          className="w-full p-2 border rounded mb-4"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value = '',
  onChange,
  mode = 'contextual',
  placeholder = 'Start typing...',
  iconSet = 'outline',
  tools: enabledTools = ['bold', 'italic', 'underline', 'strikethrough', 'createLink', 'header', 'insertUnorderedList', 'insertOrderedList', 'indent', 'outdent', 'insertHorizontalRule', 'insertImage', 'quote', 'code', 'table', 'textColor', 'backgroundColor', 'fontSize', 'fontFamily', 'align', 'removeFormat', 'undo', 'redo', 'viewSource', 'fullscreen'],
  minHeight = '200px',
  autoResize = false,
  imageUploadUrl,
  onImageUpload,
  assetLibrary = [],
  customIcons = {},
  showSeoGuide = false,
  toolbarPosition = 'top',
  spellCheck = true,
  language = 'en',
  showExportOptions = false,
  theme = defaultTheme,
  lang,
  customButtons = [],
  onToolClick,
  onContentChange,
  onSelectionChange,
  labels = {},
  storageKey,
  autoSave = false,
  id,
  readOnly = false,
  disabled = false
}) => {
  const themeColors = { ...defaultTheme, ...theme };
  const defaultLabels = {
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    link: 'Link',
    headers: 'Headers',
    bulletList: 'Bullet List',
    numberList: 'Number List',
    horizontalRule: 'Horizontal Rule',
    image: 'Image',
    viewSource: 'View Source',
    quote: 'Quote',
    code: 'Code',
    table: 'Table',
    tableHeader: 'Table Header',
    tableRow: 'Table Row',
    tableColumn: 'Table Column',
    seoAnalysis: 'SEO Analysis',
    textColor: 'Text Color',
    backgroundColor: 'Background Color',
    fontSize: 'Font Size',
    undo: 'Undo',
    redo: 'Redo',
    insertLink: 'Insert Link',
    insertImage: 'Insert Image',
    insertImageUrl: 'Insert Image URL',
    enterUrl: 'Enter URL...',
    enterImageUrl: 'Enter image URL...',
    altText: 'Alt text (optional)',
    uploadFile: 'Upload File',
    fromUrl: 'From URL',
    cancel: 'Cancel',
    ok: 'OK',
    exportOptions: 'Export',
    exportHtml: 'Export as HTML',
    exportText: 'Export as Text',
    exportMarkdown: 'Export as Markdown',
    math: 'Math Formula',
    insertMath: 'Insert Math Formula',
    editImage: 'Edit Image',
    update: 'Update',
    insertLayoutBlock: 'Insert Layout Block',
    back: 'Back',
    customizeLayout: 'Customize Layout',
    latexFormula: 'LaTeX Formula',
    preview: 'Preview',
    enterFormulaAbove: 'Enter formula above'
  };
  
  const t = lang ? { ...defaultLabels, ...translations[lang], ...labels } : { ...defaultLabels, ...labels };
  
  const [content, setContent] = useState(() => {
    if (storageKey && autoSave) {
      try {
        const saved = localStorage.getItem(storageKey);
        return saved && saved !== '<p><br></p>' && saved !== '<p></p>' ? saved : value;
      } catch { return value; }
    }
    return value;
  });
  const [showToolbar, setShowToolbar] = useState(mode === 'full');
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', placeholder: '', command: '' });
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [imageAlt, setImageAlt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [imageClasses, setImageClasses] = useState('');
  const [imageObjectFit, setImageObjectFit] = useState('cover');
  const [imageBorderRadius, setImageBorderRadius] = useState('');
  const [imageDisplay, setImageDisplay] = useState('inline');
  const [imageLink, setImageLink] = useState('');
  const [editingImage, setEditingImage] = useState<HTMLImageElement | null>(null);
  const [imageEditButton, setImageEditButton] = useState<{ show: boolean; x: number; y: number }>({ show: false, x: 0, y: 0 });
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState('');
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showFontFamilyDropdown, setShowFontFamilyDropdown] = useState(false);
  const [showTableDropdown, setShowTableDropdown] = useState(false);
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExitingFullscreen, setIsExitingFullscreen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMathModal, setShowMathModal] = useState(false);
  const [mathFormula, setMathFormula] = useState('');
  const [showFlexModal, setShowFlexModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [flexGap, setFlexGap] = useState('10px');
  const [flexPadding, setFlexPadding] = useState('15px');
  const [flexBorder, setFlexBorder] = useState('2px dashed #d1d5db');
  const editorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    setShowToolbar(mode === 'full');
  }, [mode]);

  const icons = {
    outline: {
      bold: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>,
      italic: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/></svg>,
      underline: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>,
      link: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>,
      ul: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>,
      ol: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>,
      header: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>,
      hr: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>,
      img: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
      viewSource: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>,
      quote: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>,
      code: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>,
      table: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z"/></svg>,
      tableHeader: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v4H3V3zm0 6h18v2H3V9zm0 4h18v2H3v-2zm0 4h18v4H3v-4z"/></svg>,
      tableRow: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 7H2v2h20V7zm0 4H2v2h20v-2zm0 4H2v2h20v-2z"/></svg>,
      tableColumn: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2h2v20H7V2zm4 0h2v20h-2V2zm4 0h2v20h-2V2z"/></svg>,
      textColor: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.62 12L12 5.67 14.38 12H9.62zM11 3L5.5 17h2.25l1.12-3h6.25l1.12 3H18.5L13 3h-2zm-6 16h18v2H5v-2z"/></svg>,
      backgroundColor: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/><path d="M2 20h20v4H2z"/></svg>,
      fontSize: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/></svg>,
      undo: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>,
      redo: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>,
      exportOptions: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>,
      math: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><text x="2" y="18" fontSize="16" fontFamily="serif" fontStyle="italic">fx</text></svg>
    },
    solid: {
      bold: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 5a1 1 0 011-1h5.5a3.5 3.5 0 110 7H4v2.5A1.5 1.5 0 015.5 15H11a3.5 3.5 0 110 7H4a1 1 0 01-1-1V5z" /></svg>,
      italic: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5a1 1 0 100 2h1.5L7.5 13H6a1 1 0 100 2h4a1 1 0 100-2H8.5l2-6H12a1 1 0 100-2H8z" /></svg>,
      underline: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 3a1 1 0 011 1v6a3 3 0 106 0V4a1 1 0 112 0v6a5 5 0 01-10 0V4a1 1 0 011-1zM4 17a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" /></svg>,
      link: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>,
      ul: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
      ol: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" /></svg>,
      header: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
      hr: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
      img: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>,
      viewSource: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
      quote: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9z" clipRule="evenodd" /></svg>,
      code: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
      table: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v2h2V5H5zm4 0v2h2V5H9zm4 0v2h2V5h-2zM5 9v2h2V9H5zm4 0v2h2V9H9zm4 0v2h2V9h-2zM5 13v2h2v-2H5zm4 0v2h2v-2H9zm4 0v2h2v-2h-2z" clipRule="evenodd" /></svg>,
      tableHeader: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
      tableRow: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
      tableColumn: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 3a1 1 0 011-1h2a1 1 0 110 2H7a1 1 0 01-1-1zm4 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-4 4a1 1 0 011-1h2a1 1 0 110 2H7a1 1 0 01-1-1zm4 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
      textColor: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
      backgroundColor: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>,
      fontSize: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
      undo: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>,
      redo: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
      exportOptions: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
      math: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><text x="1" y="15" fontSize="14" fontFamily="serif" fontStyle="italic">fx</text></svg>
    }
  };

  const getIcon = (toolName: string) => {
    type IconKey = keyof typeof icons.outline;
    return customIcons[toolName] || icons[iconSet][toolName as IconKey] || icons[iconSet].viewSource;
  };

  const allTools: Record<string, any> = {
    bold: { cmd: 'bold', icon: getIcon('bold'), title: t.bold },
    italic: { cmd: 'italic', icon: getIcon('italic'), title: t.italic },
    underline: { cmd: 'underline', icon: getIcon('underline'), title: t.underline },
    strikethrough: { cmd: 'strikethrough', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>, title: 'Strikethrough' },
    createLink: { cmd: 'createLink', icon: getIcon('link'), title: t.link },
    header: { cmd: 'header', icon: getIcon('header'), title: t.headers, dropdown: true },
    insertUnorderedList: { cmd: 'insertUnorderedList', icon: getIcon('ul'), title: t.bulletList },
    insertOrderedList: { cmd: 'insertOrderedList', icon: getIcon('ol'), title: t.numberList },
    indent: { cmd: 'indent', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>, title: 'Indent' },
    outdent: { cmd: 'outdent', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>, title: 'Outdent' },
    insertHorizontalRule: { cmd: 'insertHorizontalRule', icon: getIcon('hr'), title: t.horizontalRule },
    insertImage: { cmd: 'insertImage', icon: getIcon('img'), title: t.image },
    quote: { cmd: 'quote', icon: getIcon('quote'), title: t.quote },
    code: { cmd: 'code', icon: getIcon('code'), title: t.code },
    table: { cmd: 'table', icon: getIcon('table'), title: t.table, dropdown: true },
    textColor: { cmd: 'foreColor', icon: getIcon('textColor'), title: t.textColor, colorPicker: true },
    backgroundColor: { cmd: 'backColor', icon: getIcon('backgroundColor'), title: t.backgroundColor, colorPicker: true },
    fontSize: { cmd: 'fontSize', icon: getIcon('fontSize'), title: t.fontSize, dropdown: true },
    fontFamily: { cmd: 'fontName', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"/></svg>, title: 'Font Family', dropdown: true },
    align: { cmd: 'align', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/></svg>, title: 'Align', dropdown: true },
    removeFormat: { cmd: 'removeFormat', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8V5H6.39l3 3h1.83l-.55 1.28 2.09 2.09L14.21 8zM3.41 4.86L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21l1.41-1.41z"/></svg>, title: 'Clear Formatting' },
    undo: { cmd: 'undo', icon: getIcon('undo'), title: t.undo },
    redo: { cmd: 'redo', icon: getIcon('redo'), title: t.redo },
    viewSource: { cmd: 'viewSource', icon: getIcon('viewSource'), title: t.viewSource },
    fullscreen: { cmd: 'fullscreen', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>, title: 'Fullscreen' },
    math: { cmd: 'math', icon: getIcon('math'), title: t.math },
    exportOptions: { cmd: 'exportOptions', icon: getIcon('exportOptions'), title: t.exportOptions },
    flexBlock: { cmd: 'flexBlock', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>, title: 'Flex Block' }
  };

  const tools = enabledTools.map(toolName => allTools[toolName]).filter(Boolean);
  
  const customTools = customButtons.map(btn => ({
    cmd: btn.name,
    icon: btn.icon,
    title: btn.title,
    custom: true,
    action: btn.action
  }));
  
  const allToolsWithCustom = [...tools, ...customTools];

  const headers = [
    { cmd: 'formatBlock', value: 'h1', label: 'Heading 1' },
    { cmd: 'formatBlock', value: 'h2', label: 'Heading 2' },
    { cmd: 'formatBlock', value: 'h3', label: 'Heading 3' },
    { cmd: 'formatBlock', value: 'h4', label: 'Heading 4' },
    { cmd: 'formatBlock', value: 'h5', label: 'Heading 5' },
    { cmd: 'formatBlock', value: 'h6', label: 'Heading 6' },
    { cmd: 'formatBlock', value: 'p', label: 'Paragraph' }
  ];

  const handleImageUpload = async (file: File) => {
    try {
      let imageUrl = '';
      
      if (onImageUpload) {
        imageUrl = await onImageUpload(file);
      } else if (imageUploadUrl) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(imageUploadUrl, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        imageUrl = data.url || data.imageUrl || data.src;
      } else {
        // Convert to base64
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      
      const img = `<img src="${imageUrl}" alt="${imageAlt || file.name}" style="max-width: 100%; height: auto;" />`;
      document.execCommand('insertHTML', false, img);
      editorRef.current?.focus();
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const execCommand = (cmd: string, value?: string) => {
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      let element: Node | HTMLElement | null = selection.getRangeAt(0).commonAncestorContainer;
      if ((element as Node).nodeType === Node.TEXT_NODE) element = (element as Node).parentElement;
      
      if (element && ((element as HTMLElement)?.closest?.('pre') || (element as HTMLElement)?.closest?.('code')) && 
          !['viewSource', 'undo', 'redo'].includes(cmd)) {
        return;
      }
    }
    
    if (cmd === 'viewSource') {
      setShowSource(!showSource);
    } else if (cmd === 'exportOptions') {
      setShowExportModal(true);
    } else if (cmd === 'math') {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        savedRangeRef.current = selection.getRangeAt(0).cloneRange();
      }
      setShowMathModal(true);
    } else if (cmd === 'flexBlock') {
      setShowFlexModal(true);
    } else if (cmd === 'createLink') {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        savedRangeRef.current = selection.getRangeAt(0).cloneRange();
      }
      setModalConfig({ title: t.insertLink, placeholder: t.enterUrl, command: cmd });
      setModalOpen(true);
    } else if (cmd === 'insertImage') {
      setShowImageModal(true);
    } else if (cmd === 'insertTable') {
      setShowTableModal(true);
    } else if (cmd === 'foreColor') {
      setColorPickerType(cmd);
      setShowColorPicker(!showColorPicker);
      setShowHeaderDropdown(false);
      setShowFontSizeDropdown(false);
    } else if (cmd === 'backColor') {
      setColorPickerType(cmd);
      setShowColorPicker(!showColorPicker);
      setShowHeaderDropdown(false);
      setShowFontSizeDropdown(false);
    } else if (cmd === 'fontSize') {
      setShowFontSizeDropdown(!showFontSizeDropdown);
      setShowHeaderDropdown(false);
      setShowFontFamilyDropdown(false);
    } else if (cmd === 'fontName') {
      setShowFontFamilyDropdown(!showFontFamilyDropdown);
      setShowHeaderDropdown(false);
      setShowFontSizeDropdown(false);
    } else if (cmd === 'fullscreen') {
      if (isFullscreen) {
        setIsExitingFullscreen(true);
        setTimeout(() => {
          setIsFullscreen(false);
          setIsExitingFullscreen(false);
        }, 200);
      } else {
        setIsFullscreen(true);
      }
    } else if (cmd === 'tableHeader') {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        let cell: Node | HTMLElement | null = range.commonAncestorContainer;
        while (cell && (cell as HTMLElement).nodeName !== 'TD' && (cell as HTMLElement).nodeName !== 'TH') {
          cell = (cell as Node).parentNode;
        }
        if (cell && (cell as Node).parentNode) {
          const newTag = (cell as HTMLElement).nodeName === 'TD' ? 'th' : 'td';
          const newCell = document.createElement(newTag);
          newCell.innerHTML = (cell as HTMLElement).innerHTML;
          (cell as Node).parentNode!.replaceChild(newCell, cell as Node);
        }
      }
      editorRef.current?.focus();
    } else if (cmd === 'quote') {
      const selection = window.getSelection();
      const text = selection?.toString() || 'Quote text';
      document.execCommand('insertHTML', false, `<blockquote>${text}</blockquote>`);
      editorRef.current?.focus();
    } else if (cmd === 'code') {
      const selection = window.getSelection();
      const text = selection?.toString() || 'Code block';
      document.execCommand('insertHTML', false, `<pre><code>${text}</code></pre>`);
      editorRef.current?.focus();
    } else if (cmd === 'formatBlock') {
      document.execCommand(cmd, false, value);
      editorRef.current?.focus();
    } else {
      document.execCommand(cmd, false, value);
      editorRef.current?.focus();
    }
  };

  const handleModalSubmit = (value: string) => {
    if (modalConfig.command === 'createLink') {
      editorRef.current?.focus();
      if (savedRangeRef.current) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedRangeRef.current);
        
        const range = savedRangeRef.current;
        
        const container = range.commonAncestorContainer;
        let imgElement: HTMLImageElement | null = null;
        
        if (container.nodeType === Node.ELEMENT_NODE) {
          const elem = container as HTMLElement;
          if (elem.tagName === 'IMG') {
            imgElement = elem as HTMLImageElement;
          } else {
            imgElement = elem.querySelector('img');
          }
        } else if (container.parentElement?.tagName === 'IMG') {
          imgElement = container.parentElement as HTMLImageElement;
        }
        
        if (!imgElement) {
          const contents = range.cloneContents();
          imgElement = contents.querySelector('img');
        }
        
        if (imgElement) {
          const anchor = document.createElement('a');
          anchor.href = value;
          const extracted = range.extractContents();
          anchor.appendChild(extracted);
          range.insertNode(anchor);
          
          range.setStartAfter(anchor);
          range.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(range);
        } else {
          document.execCommand('createLink', false, value);
        }
      } else {
        document.execCommand('createLink', false, value);
      }
      savedRangeRef.current = null;
    } else if (modalConfig.command === 'insertImage') {
      document.execCommand('insertImage', false, value);
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    let html = editorRef.current?.innerHTML || '';
    
    if (html && !html.startsWith('<') && html.trim()) {
      html = `<p>${html}</p>`;
      editorRef.current!.innerHTML = html;
      
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current!);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    
    html = html.replace(/<p>(<[ou]l>.*?<\/[ou]l>)<\/p>/gi, '$1');
    html = html.replace(/<p>(<[ou]l>)/gi, '$1').replace(/(<\/[ou]l>)<\/p>/gi, '$1');
    
    setContent(html);
    onChange?.(html);
    
    if (storageKey && autoSave) {
      try {
        localStorage.setItem(storageKey, html);
      } catch {}
    }
    
    if (onContentChange) {
      const text = editorRef.current?.textContent || '';
      const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      onContentChange(html, text, wordCount);
    }
  };

  const handleSelection = () => {
    if (mode === 'full') return;
    
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    
    if (onSelectionChange) {
      onSelectionChange(selectedText.length > 0, selectedText);
    }
    
    if (selection && selectedText.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current?.getBoundingClientRect();
      
      if (editorRect) {
        setToolbarPos({ 
          x: rect.left - editorRect.left, 
          y: rect.top - editorRect.top - 50
        });
      }
      setShowToolbar(true);
    } else if (!selection || selectedText.length === 0) {
      setShowToolbar(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === 'full') return;
    clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    if (mode === 'contextual') {
      clearTimeout(timeoutRef.current);
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          setShowToolbar(false);
        }
      }, 200);
    }
  };

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML && !showSource) {
      editorRef.current.innerHTML = content;
    }
  }, [value, showSource]);

  useEffect(() => {
    if (editorRef.current) {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowHeaderDropdown(false);
        setShowFontSizeDropdown(false);
        setShowTableDropdown(false);
        setShowColorPicker(false);
        setShowAlignDropdown(false);
      }
    };
    
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        setShowImageModal(false);
        setShowTableModal(false);
        setShowExportModal(false);
        setShowMathModal(false);
        setShowFlexModal(false);
        setShowHeaderDropdown(false);
        setShowFontSizeDropdown(false);
        setShowFontFamilyDropdown(false);
        setShowTableDropdown(false);
        setShowColorPicker(false);
        setShowAlignDropdown(false);
        if (isFullscreen) {
          setIsExitingFullscreen(true);
          setTimeout(() => {
            setIsFullscreen(false);
            setIsExitingFullscreen(false);
          }, 200);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  return (
    <div className={`${isFullscreen || isExitingFullscreen ? 'fixed inset-0 z-50 bg-white overflow-auto' : 'relative'} ${isFullscreen && !isExitingFullscreen ? 'animate-fadeIn' : ''} ${isExitingFullscreen ? 'animate-fadeOut' : ''} ${
      mode === 'full' && (toolbarPosition === 'left' || toolbarPosition === 'right') ? 'flex' : ''
    } ${
      mode === 'full' && toolbarPosition === 'right' ? 'flex-row-reverse' : ''
    } ${
      mode === 'full' && toolbarPosition === 'bottom' ? 'flex flex-col-reverse' : ''
    }`}>
      {(showToolbar || (mode === 'contextual' && showSource)) && (
        <div 
          className={`flex gap-1 p-2 rounded-lg shadow-lg z-10 touch-manipulation bg-white border ${
            mode === 'full' 
              ? (toolbarPosition === 'bottom' ? 'mt-2' : toolbarPosition === 'left' ? 'mr-2' : toolbarPosition === 'right' ? 'ml-2' : 'mb-2')
              : 'absolute pointer-events-auto opacity-30 hover:opacity-100 transition-opacity'
          } ${
            mode === 'full' && (toolbarPosition === 'left' || toolbarPosition === 'right') ? 'flex-col' : 'flex-wrap'
          }`}
          style={mode === 'contextual' ? { 
            left: `${Math.min(toolbarPos.x, window.innerWidth - 300)}px`, 
            top: `${Math.max(0, toolbarPos.y)}px`,
            maxWidth: '280px',
            background: themeColors.toolbarBg,
            borderColor: themeColors.border
          } : {
            background: themeColors.toolbarBg,
            borderColor: themeColors.border
          }}
        >
          {(mode === 'contextual' && showSource ? allToolsWithCustom.filter(tool => tool && tool.cmd === 'viewSource') : allToolsWithCustom).map(tool => (
            <div key={tool.cmd} className="relative">
              {tool.dropdown ? (
                <>
                  <button
                    onClick={() => {
                      onToolClick?.(tool.cmd);
                      if (tool.cmd === 'header') {
                        setShowHeaderDropdown(!showHeaderDropdown);
                        setShowFontSizeDropdown(false);
                        setShowTableDropdown(false);
                        setShowColorPicker(false);
                      } else if (tool.cmd === 'fontSize') {
                        setShowFontSizeDropdown(!showFontSizeDropdown);
                        setShowHeaderDropdown(false);
                        setShowTableDropdown(false);
                        setShowColorPicker(false);
                      } else if (tool.cmd === 'table') {
                        setShowTableDropdown(!showTableDropdown);
                        setShowHeaderDropdown(false);
                        setShowFontSizeDropdown(false);
                        setShowColorPicker(false);
                        setShowAlignDropdown(false);
                      } else if (tool.cmd === 'align') {
                        setShowAlignDropdown(!showAlignDropdown);
                        setShowHeaderDropdown(false);
                        setShowFontSizeDropdown(false);
                        setShowTableDropdown(false);
                        setShowColorPicker(false);
                      }
                    }}
                    className="px-3 py-2 rounded transition-colors border border-transparent"
                    style={{ color: themeColors.text, background: themeColors.toolbarBg }}
                    onMouseEnter={(e) => e.currentTarget.style.background = themeColors.toolbarHover || ''}
                    onMouseLeave={(e) => e.currentTarget.style.background = themeColors.toolbarBg || ''}
                    title={tool.title}
                    type="button"
                  >
                    <div className="flex items-center justify-center w-5 h-5">
                      {tool.icon}
                    </div>
                  </button>
                  {showHeaderDropdown && tool.cmd === 'header' && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 min-w-32 animate-slideDown">
                      {headers.map(header => (
                        <button
                          key={header.value}
                          onClick={() => {
                            execCommand(header.cmd, header.value);
                            setShowHeaderDropdown(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          {header.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {showFontSizeDropdown && tool.dropdown && tool.cmd === 'fontSize' && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 min-w-20 animate-slideDown">
                      {['8px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'].map(size => (
                        <button
                          key={size}
                          onClick={() => {
                            const selection = window.getSelection();
                            if (selection?.rangeCount) {
                              const range = selection.getRangeAt(0);
                              const span = document.createElement('span');
                              span.style.fontSize = size;
                              try {
                                range.surroundContents(span);
                              } catch (e) {
                                span.appendChild(range.extractContents());
                                range.insertNode(span);
                              }
                            }
                            setShowFontSizeDropdown(false);
                            editorRef.current?.focus();
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                  {showFontFamilyDropdown && tool.dropdown && tool.cmd === 'fontName' && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 min-w-32 animate-slideDown">
                      {['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Trebuchet MS', 'Verdana'].map(font => (
                        <button
                          key={font}
                          onClick={() => {
                            document.execCommand('fontName', false, font);
                            setShowFontFamilyDropdown(false);
                            editorRef.current?.focus();
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  )}
                  {showTableDropdown && tool.cmd === 'table' && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 min-w-40 animate-slideDown">
                      <button onClick={() => {
                        setShowTableModal(true);
                        setShowTableDropdown(false);
                      }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        {getIcon('table')} Insert Table
                      </button>
                      <button onClick={() => {
                        const selection = window.getSelection();
                        if (selection?.rangeCount) {
                          const range = selection.getRangeAt(0);
                          let cell: Node | HTMLElement | null = range.commonAncestorContainer;
                          while (cell && (cell as HTMLElement).nodeName !== 'TD' && (cell as HTMLElement).nodeName !== 'TH') cell = (cell as Node).parentNode;
                          if (cell && (cell as Node).parentNode) {
                            const newTag = (cell as HTMLElement).nodeName === 'TD' ? 'th' : 'td';
                            const newCell = document.createElement(newTag);
                            newCell.innerHTML = (cell as HTMLElement).innerHTML;
                            (cell as Node).parentNode!.replaceChild(newCell, cell as Node);
                          }
                        }
                        setShowTableDropdown(false);
                        editorRef.current?.focus();
                      }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        {getIcon('tableHeader')} Toggle Header
                      </button>
                      <button onClick={() => {
                        const selection = window.getSelection();
                        if (selection?.rangeCount) {
                          const range = selection.getRangeAt(0);
                          let row: Node | HTMLElement | null = range.commonAncestorContainer;
                          while (row && (row as HTMLElement).nodeName !== 'TR') row = (row as Node).parentNode;
                          if (row) {
                            const newRow = (row as Node).cloneNode(true);
                            (row as Node).parentNode?.insertBefore(newRow, (row as Node).nextSibling);
                          }
                        }
                        setShowTableDropdown(false);
                        editorRef.current?.focus();
                      }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        {getIcon('tableRow')} Add Row Below
                      </button>
                      <button onClick={() => {
                        const selection = window.getSelection();
                        if (selection?.rangeCount) {
                          const range = selection.getRangeAt(0);
                          let row: Node | HTMLElement | null = range.commonAncestorContainer;
                          while (row && (row as HTMLElement).nodeName !== 'TR') row = (row as Node).parentNode;
                          if (row && (row as Node).parentNode && ((row as Node).parentNode as HTMLElement).children.length > 1) {
                            (row as Node).parentNode?.removeChild(row as Node);
                          }
                        }
                        setShowTableDropdown(false);
                        editorRef.current?.focus();
                      }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        {getIcon('tableRow')} Delete Row
                      </button>
                      <button onClick={() => {
                        const selection = window.getSelection();
                        if (selection?.rangeCount) {
                          const range = selection.getRangeAt(0);
                          let cell: Node | HTMLElement | null = range.commonAncestorContainer;
                          while (cell && (cell as HTMLElement).nodeName !== 'TD' && (cell as HTMLElement).nodeName !== 'TH') cell = (cell as Node).parentNode;
                          if (cell) {
                            const cellIndex = Array.from(((cell as Node).parentNode as HTMLElement)?.children || []).indexOf(cell as Element);
                            const table = (cell as HTMLElement).closest('table');
                            if (table) {
                              Array.from(table.rows).forEach((row: HTMLTableRowElement) => {
                                const newCell = document.createElement((cell as HTMLElement)!.nodeName.toLowerCase());
                                newCell.textContent = 'Cell';
                                if (row.cells[cellIndex + 1]) {
                                  row.insertBefore(newCell, row.cells[cellIndex + 1]);
                                } else {
                                  row.appendChild(newCell);
                                }
                              });
                            }
                          }
                        }
                        setShowTableDropdown(false);
                        editorRef.current?.focus();
                      }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        {getIcon('tableColumn')} Add Column Right
                      </button>
                      <button onClick={() => {
                        const selection = window.getSelection();
                        if (selection?.rangeCount) {
                          const range = selection.getRangeAt(0);
                          let cell: Node | HTMLElement | null = range.commonAncestorContainer;
                          while (cell && (cell as HTMLElement).nodeName !== 'TD' && (cell as HTMLElement).nodeName !== 'TH') cell = (cell as Node).parentNode;
                          if (cell) {
                            const cellIndex = Array.from(((cell as Node).parentNode as HTMLElement)?.children || []).indexOf(cell as Element);
                            const table = (cell as HTMLElement).closest('table');
                            if (table && table.rows[0]?.cells.length > 1) {
                              Array.from(table.rows).forEach((row: HTMLTableRowElement) => {
                                if (row.cells[cellIndex]) {
                                  row.removeChild(row.cells[cellIndex]);
                                }
                              });
                            }
                          }
                        }
                        setShowTableDropdown(false);
                        editorRef.current?.focus();
                      }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        {getIcon('tableColumn')} Delete Column
                      </button>
                    </div>
                  )}
                  {showAlignDropdown && tool.cmd === 'align' && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 min-w-32 animate-slideDown">
                      <button onClick={() => { document.execCommand('justifyLeft', false); setShowAlignDropdown(false); editorRef.current?.focus(); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/></svg> Align Left
                      </button>
                      <button onClick={() => { document.execCommand('justifyCenter', false); setShowAlignDropdown(false); editorRef.current?.focus(); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm3 4h12v2H6V7zm-3 4h18v2H3v-2zm3 4h12v2H6v-2zm-3 4h18v2H3v-2z"/></svg> Align Center
                      </button>
                      <button onClick={() => { document.execCommand('justifyRight', false); setShowAlignDropdown(false); editorRef.current?.focus(); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm6 4h12v2H9V7zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z"/></svg> Align Right
                      </button>
                      <button onClick={() => { document.execCommand('justifyFull', false); setShowAlignDropdown(false); editorRef.current?.focus(); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg> Justify
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    onToolClick?.(tool.cmd);
                    if (tool.custom) {
                      tool.action(editorRef.current);
                    } else if (tool.colorPicker) {
                      setColorPickerType(tool.cmd);
                      setShowColorPicker(showColorPicker && colorPickerType === tool.cmd ? false : true);
                      setShowHeaderDropdown(false);
                      setShowFontSizeDropdown(false);
                      setShowTableDropdown(false);
                    } else {
                      execCommand(tool.cmd);
                    }
                  }}
                  className="px-3 py-2 rounded transition-colors border border-transparent"
                  style={{ color: themeColors.text, background: themeColors.toolbarBg }}
                  onMouseEnter={(e) => e.currentTarget.style.background = themeColors.toolbarHover ?? ''}
                  onMouseLeave={(e) => e.currentTarget.style.background = themeColors.toolbarBg ?? ''}
                  title={tool.title}
                  type="button"
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    {tool.icon}
                  </div>
                </button>
              )}
              {showColorPicker && (colorPickerType === tool.cmd) && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 p-2 animate-slideDown">
                  <div className="grid grid-cols-8 gap-1 w-48">
                    <button
                      onClick={() => {
                        const selection = window.getSelection();
                        if (selection?.rangeCount) {
                          const range = selection.getRangeAt(0);
                          const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
                            ? range.commonAncestorContainer.parentElement 
                            : range.commonAncestorContainer as HTMLElement;
                          
                          if (!parentElement) return;
                          
                          const walker = document.createTreeWalker(
                            parentElement,
                            NodeFilter.SHOW_ELEMENT,
                            null
                          );
                          
                          let node;
                          while (node = walker.nextNode()) {
                            const elem = node as HTMLElement;
                            if (elem.tagName === 'SPAN') {
                              if (colorPickerType === 'foreColor') {
                                elem.style.color = '';
                              } else if (colorPickerType === 'backColor') {
                                elem.style.backgroundColor = '';
                              }
                              if (!elem.style.cssText) {
                                elem.outerHTML = elem.innerHTML;
                              }
                            }
                          }
                        }
                        setShowColorPicker(false);
                        editorRef.current?.focus();
                      }}
                      className="w-6 h-6 border-2 border-red-500 rounded hover:scale-110 transition-transform bg-white relative"
                      title="Remove Color"
                    >
                      <span className="text-red-500 text-xs font-bold">✕</span>
                    </button>
                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#808080', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#FF9999', '#99FF99', '#9999FF', '#FFFF99', '#FF99FF', '#99FFFF'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          editorRef.current?.focus();
                          document.execCommand(colorPickerType === 'foreColor' ? 'foreColor' : 'backColor', false, color);
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 border border-gray-300 rounded hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showSource ? (
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            onChange?.(e.target.value);
          }}
          className="p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm w-full resize-none"
          style={{ minHeight, border: `1px solid ${themeColors.border}` }}
          placeholder={placeholder}
        />
      ) : (
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable={!readOnly && !disabled}
            onInput={() => {
              clearTimeout(clickTimeoutRef.current);
              if (mode === 'contextual') {
                setShowToolbar(false);
              }
              handleInput();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                const selection = window.getSelection();
                if (selection?.rangeCount) {
                  const range = selection.getRangeAt(0);
                  if (range.collapsed && range.startOffset === 0) {
                    let node: Node | HTMLElement | null = range.startContainer;
                    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
                    if (node) {
                      const li = (node as HTMLElement).closest('li');
                      if (li && li.textContent?.trim() === '') {
                        e.preventDefault();
                        const isOrdered = li.closest('ol');
                        document.execCommand(isOrdered ? 'insertOrderedList' : 'insertUnorderedList', false);
                      }
                    }
                  }
                }
              }
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {}}
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'IMG') {
                const img = target as HTMLImageElement;
                
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNode(img);
                selection?.removeAllRanges();
                selection?.addRange(range);
                
                const rect = img.getBoundingClientRect();
                const editorRect = editorRef.current?.getBoundingClientRect();
                if (editorRect) {
                  setImageEditButton({
                    show: true,
                    x: rect.right - editorRect.left + 5,
                    y: rect.top - editorRect.top
                  });
                  setEditingImage(img);
                }
                return;
              }
              setImageEditButton({ show: false, x: 0, y: 0});
              if (mode === 'contextual') {
                const selection = window.getSelection();
                if (!selection || selection.toString().length === 0) {
                  clearTimeout(clickTimeoutRef.current);
                  clickTimeoutRef.current = setTimeout(() => {
                    const editorRect = editorRef.current?.getBoundingClientRect();
                    if (editorRect) {
                      setToolbarPos({ 
                        x: e.clientX - editorRect.left, 
                        y: e.clientY - editorRect.top - 50 
                      });
                      setShowToolbar(true);
                    }
                  }, 500);
                }
              }
            }}
            className="p-4 rounded-lg focus:outline-none focus:ring-2 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
            style={{
              border: `1px solid ${themeColors.border}`,
              background: disabled ? '#f3f4f6' : themeColors.background,
              color: disabled ? '#9ca3af' : themeColors.text,
              minHeight: autoResize ? 'auto' : minHeight,
              height: autoResize ? 'auto' : undefined,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              opacity: disabled ? 0.6 : 1,
              cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text'
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}33`}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
            suppressContentEditableWarning
            spellCheck={spellCheck}
            lang={language}
            data-placeholder={placeholder}
          />
          
          {imageEditButton.show && (
            <button
              onClick={() => {
                if (editingImage) {
                  setImageUrl(editingImage.src);
                  setImageAlt(editingImage.alt || '');
                  setImageWidth(editingImage.style.width || editingImage.width + 'px');
                  setImageHeight(editingImage.style.height || editingImage.height + 'px');
                  setImageClasses(editingImage.className || '');
                  setImageObjectFit(editingImage.style.objectFit || 'cover');
                  setImageBorderRadius(editingImage.style.borderRadius || '');
                  const display = editingImage.style.display || 'inline';
                  const margin = editingImage.style.margin || '';
                  if (display === 'block') {
                    if (margin.includes('auto')) {
                      setImageDisplay(margin === '1em auto' ? 'block-center' : 'block-right');
                    } else {
                      setImageDisplay('block-left');
                    }
                  } else {
                    setImageDisplay('inline');
                  }
                  const parentLink = editingImage.parentElement;
                  if (parentLink?.tagName === 'A') {
                    setImageLink((parentLink as HTMLAnchorElement).href);
                  } else {
                    setImageLink('');
                  }
                  setShowImageModal(true);
                }
              }}
              className="absolute px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 shadow-lg z-10"
              style={{ left: `${imageEditButton.x}px`, top: `${imageEditButton.y}px` }}
            >
              Edit
            </button>
          )}
          
          <div className="absolute bottom-2 right-2 flex gap-1">
            <button
              onClick={() => {
                const blob = new Blob([content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'content.html';
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              title={t.exportHtml}
            >
              HTML
            </button>
            <button
              onClick={() => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const text = tempDiv.textContent || tempDiv.innerText || '';
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'content.txt';
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              title={t.exportText}
            >
              TXT
            </button>
            <button
              onClick={() => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                let markdown = tempDiv.innerHTML
                  .replace(/<h1[^>]*>(.*?)<\/h1>/gis, '# $1\n\n')
                  .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '## $1\n\n')
                  .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '### $1\n\n')
                  .replace(/<h4[^>]*>(.*?)<\/h4>/gis, '#### $1\n\n')
                  .replace(/<h5[^>]*>(.*?)<\/h5>/gis, '##### $1\n\n')
                  .replace(/<h6[^>]*>(.*?)<\/h6>/gis, '###### $1\n\n')
                  .replace(/<strong[^>]*>(.*?)<\/strong>/gis, '**$1**')
                  .replace(/<b[^>]*>(.*?)<\/b>/gis, '**$1**')
                  .replace(/<em[^>]*>(.*?)<\/em>/gis, '*$1*')
                  .replace(/<i[^>]*>(.*?)<\/i>/gis, '*$1*')
                  .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gis, '[$2]($1)')
                  .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
                  .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
                  .replace(/<code[^>]*>(.*?)<\/code>/gis, '`$1`')
                  .replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1\n')
                  .replace(/<ol[^>]*>(.*?)<\/ol>/gis, '$1\n')
                  .replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n')
                  .replace(/<br\s*\/?>/gi, '\n')
                  .replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n')
                  .replace(/<div[^>]*>(.*?)<\/div>/gis, '$1\n')
                  .replace(/<[^>]+>/g, '')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&amp;/g, '&')
                  .replace(/\n{3,}/g, '\n\n')
                  .trim();
                
                const blob = new Blob([markdown], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'content.md';
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
              title={t.exportMarkdown}
            >
              MD
            </button>
          </div>
        </div>
      )}

      <style>{`
        [contenteditable] h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        [contenteditable] h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
        [contenteditable] h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
        [contenteditable] h4 { font-size: 1em; font-weight: bold; margin: 1.12em 0; }
        [contenteditable] h5 { font-size: 0.83em; font-weight: bold; margin: 1.5em 0; }
        [contenteditable] h6 { font-size: 0.75em; font-weight: bold; margin: 1.67em 0; }
        [contenteditable] ul { list-style-type: disc; margin: 1em 0; padding-left: 40px; }
        [contenteditable] ol { list-style-type: decimal; margin: 1em 0; padding-left: 40px; }
        [contenteditable] li { margin: 0.5em 0; }
        [contenteditable] p { margin: 1em 0; }
        [contenteditable] hr { border: none; border-top: 1px solid #ccc; margin: 1em 0; }
        [contenteditable] a { color: #0066cc; text-decoration: underline; }
        [contenteditable] strong, [contenteditable] b { font-weight: bold; }
        [contenteditable] em, [contenteditable] i { font-style: italic; }
        [contenteditable] u { text-decoration: underline; }
        [contenteditable] blockquote { margin: 1em 0; padding: 0.5em 1em; border-left: 4px solid #ddd; background: #f9f9f9; font-style: italic; }
        [contenteditable] pre { background: #f4f4f4; padding: 1em; border-radius: 4px; overflow-x: auto; font-family: monospace; }
        [contenteditable] table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        [contenteditable] td, [contenteditable] th { border: 1px solid #ddd; padding: 8px; text-align: left; }
        [contenteditable] th { background-color: #f2f2f2; font-weight: bold; }
        [contenteditable] img { cursor: pointer; user-select: auto; -webkit-user-select: auto; -moz-user-select: auto; -ms-user-select: auto; max-width: 100%; height: auto; }
        
        @media (max-width: 768px) {
          .flex.gap-1 { flex-wrap: wrap; }
          .px-3 { padding-left: 0.5rem; padding-right: 0.5rem; }
          .py-2 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fadeOut { animation: fadeOut 0.2s ease-out; }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file);
            setShowImageModal(false);
            setImageAlt('');
            setEditingImage(null);
          }
        }}
      />

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[85vh] overflow-y-auto animate-slideIn">
            <h3 className="text-lg font-semibold mb-4">{editingImage ? t.editImage : t.insertImage}</h3>
            
            {editingImage ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                    <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link URL (optional)</label>
                    <input type="text" value={imageLink} onChange={(e) => setImageLink(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Alt Text</label>
                    <input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder={t.altText} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
                    <input type="text" value={imageWidth} onChange={(e) => setImageWidth(e.target.value)} placeholder="auto" className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
                    <input type="text" value={imageHeight} onChange={(e) => setImageHeight(e.target.value)} placeholder="auto" className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Object Fit</label>
                    <select value={imageObjectFit} onChange={(e) => setImageObjectFit(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="fill">Fill</option>
                      <option value="none">None</option>
                      <option value="scale-down">Scale Down</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Border Radius</label>
                    <input type="text" value={imageBorderRadius} onChange={(e) => setImageBorderRadius(e.target.value)} placeholder="0px" className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Alignment</label>
                    <select value={imageDisplay} onChange={(e) => setImageDisplay(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                      <option value="inline">Default</option>
                      <option value="block-center">Center</option>
                      <option value="block-left">Left</option>
                      <option value="block-right">Right</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">CSS Classes</label>
                    <input type="text" value={imageClasses} onChange={(e) => setImageClasses(e.target.value)} placeholder="class1 class2" className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => {
                    if (editingImage) {
                      editingImage.src = imageUrl;
                      editingImage.alt = imageAlt;
                      editingImage.style.width = imageWidth;
                      editingImage.style.height = imageHeight;
                      editingImage.className = imageClasses;
                      editingImage.style.objectFit = imageObjectFit;
                      editingImage.style.borderRadius = imageBorderRadius;
                      if (imageDisplay === 'block-center') {
                        editingImage.style.display = 'block';
                        editingImage.style.margin = '1em auto';
                        editingImage.style.maxWidth = '100%';
                      } else if (imageDisplay === 'block-left') {
                        editingImage.style.display = 'block';
                        editingImage.style.margin = '1em 0';
                        editingImage.style.maxWidth = '100%';
                      } else if (imageDisplay === 'block-right') {
                        editingImage.style.display = 'block';
                        editingImage.style.margin = '1em 0 1em auto';
                        editingImage.style.maxWidth = '100%';
                      } else {
                        editingImage.style.display = 'inline';
                        editingImage.style.margin = '';
                      }
                      
                      const parentLink = editingImage.parentElement;
                      if (imageLink.trim()) {
                        if (parentLink?.tagName === 'A') {
                          (parentLink as HTMLAnchorElement).href = imageLink;
                        } else {
                          const anchor = document.createElement('a');
                          anchor.href = imageLink;
                          editingImage.parentNode?.insertBefore(anchor, editingImage);
                          anchor.appendChild(editingImage);
                        }
                      } else if (parentLink?.tagName === 'A') {
                        parentLink.parentNode?.insertBefore(editingImage, parentLink);
                        parentLink.remove();
                      }
                      
                      setShowImageModal(false);
                      setEditingImage(null);
                      setImageEditButton({ show: false, x: 0, y: 0 });
                      setImageUrl('');
                      setImageAlt('');
                      setImageWidth('');
                      setImageHeight('');
                      setImageClasses('');
                      setImageObjectFit('cover');
                      setImageBorderRadius('');
                      setImageDisplay('inline');
                      setImageLink('');
                      setImageLink('');
                    }
                  }} className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">{t.update}</button>
                  <button onClick={() => {
                    if (editingImage && window.confirm('Delete this image?')) {
                      const parentLink = editingImage.parentElement;
                      if (parentLink?.tagName === 'A') {
                        parentLink.remove();
                      } else {
                        editingImage.remove();
                      }
                      setShowImageModal(false);
                      setEditingImage(null);
                      setImageEditButton({ show: false, x: 0, y: 0 });
                    }
                  }} className="flex-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">Delete</button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder={t.altText}
                  className="w-full p-2 border rounded mb-4"
                />
            
            {assetLibrary.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Asset Library:</h4>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {assetLibrary.map((asset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const img = `<img src="${asset.url}" alt="${imageAlt || asset.alt || asset.name || 'Image'}" style="max-width: 100%; height: auto;" />`;
                        document.execCommand('insertHTML', false, img);
                        editorRef.current?.focus();
                        setShowImageModal(false);
                        setImageAlt('');
                      }}
                      className="border rounded p-1 hover:bg-gray-50 transition-colors"
                      title={asset.name || asset.alt}
                    >
                      <img 
                        src={asset.thumbnail || asset.url} 
                        alt={asset.alt || asset.name} 
                        className="w-full h-16 object-cover rounded"
                      />
                      {asset.name && <div className="text-xs mt-1 truncate">{asset.name}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t.uploadFile}
              </button>
              <button
                onClick={() => {
                  setModalConfig({ title: t.insertImageUrl, placeholder: t.enterImageUrl, command: 'insertImage' });
                  setShowImageModal(false);
                  setModalOpen(true);
                }}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {t.fromUrl}
              </button>
            </div>
              </>
            )}
            
            {!editingImage && (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setImageAlt('');
                    setEditingImage(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {t.cancel}
                </button>
              </div>
            )}
            
            {editingImage && (
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setEditingImage(null);
                  setImageEditButton({ show: false, x: 0, y: 0 });
                  setImageUrl('');
                  setImageAlt('');
                  setImageWidth('');
                  setImageHeight('');
                  setImageClasses('');
                  setImageObjectFit('cover');
                  setImageBorderRadius('');
                  setImageDisplay('inline');
                }}
                className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mt-2"
              >
                {t.cancel}
              </button>
            )}
          </div>
        </div>
      )}

      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg w-96 animate-slideIn">
            <h3 className="text-lg font-semibold mb-4">{t.table}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.tableRow}:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.tableColumn}:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  const rows = Array(tableRows).fill(0).map(() => 
                    '<tr>' + Array(tableCols).fill(0).map(() => '<td>Cell</td>').join('') + '</tr>'
                  ).join('');
                  const table = `<table border="1" style="border-collapse: collapse; width: 100%;">${rows}</table>`;
                  document.execCommand('insertHTML', false, table);
                  editorRef.current?.focus();
                  setShowTableModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t.ok}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        title={modalConfig.title}
        placeholder={modalConfig.placeholder}
      />
      
      {showSeoGuide && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3 text-sm">{t.seoAnalysis || 'SEO Analysis'}</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {(() => {
              const text = editorRef.current?.textContent || '';
              const html = content || '';
              const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
              const charCount = text.length;
              const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
              const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
              const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
              const totalImages = (html.match(/<img[^>]*>/gi) || []).length;
              const imagesWithoutAlt = (html.match(/<img(?![^>]*alt=)[^>]*>/gi) || []).length;
              const linkCount = (html.match(/<a[^>]*>/gi) || []).length;
              
              const wordColor = wordCount < 50 ? 'text-red-600' : wordCount < 300 ? 'text-yellow-600' : 'text-green-600';
              const wordNeeded = Math.max(0, 300 - wordCount);
              const h1Color = h1Count === 1 ? 'text-green-600' : 'text-red-600';
              const imageColor = totalImages === 0 ? 'text-gray-500' : imagesWithoutAlt === 0 ? 'text-green-600' : 'text-red-600';
              const linkColor = linkCount === 0 ? 'text-gray-500' : 'text-green-600';
              
              return (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Words:</span>
                    <span className={`font-medium ${wordColor}`}>
                      {wordCount} {wordNeeded > 0 ? `(+${wordNeeded} needed)` : '(Good)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Characters:</span>
                    <span className="font-medium text-gray-700">{charCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">H1 Tags:</span>
                    <span className={`font-medium ${h1Color}`}>
                      {h1Count} {h1Count === 1 ? '(Perfect)' : h1Count === 0 ? '(Missing)' : '(Too many)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Headings:</span>
                    <span className="font-medium text-gray-700">H2:{h2Count} H3:{h3Count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Images:</span>
                    <span className={`font-medium ${imageColor}`}>
                      {totalImages} {totalImages > 0 ? `(${totalImages - imagesWithoutAlt} with alt)` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Links:</span>
                    <span className={`font-medium ${linkColor}`}>{linkCount}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg w-96 animate-slideIn">
            <h3 className="text-lg font-semibold mb-4">{t.exportOptions}</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  const blob = new Blob([content], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'content.html';
                  link.click();
                  URL.revokeObjectURL(url);
                  setShowExportModal(false);
                }}
                className="w-full p-3 text-left border border-gray-300 rounded hover:bg-gray-50"
              >
                <div className="font-medium">{t.exportHtml}</div>
                <div className="text-sm text-gray-500">Download as HTML file</div>
              </button>
              
              <button
                onClick={() => {
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = content;
                  const text = tempDiv.textContent || tempDiv.innerText || '';
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'content.txt';
                  link.click();
                  URL.revokeObjectURL(url);
                  setShowExportModal(false);
                }}
                className="w-full p-3 text-left border border-gray-300 rounded hover:bg-gray-50"
              >
                <div className="font-medium">{t.exportText}</div>
                <div className="text-sm text-gray-500">Download as plain text</div>
              </button>
              
              <button
                onClick={() => {
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = content;
                  let markdown = tempDiv.innerHTML
                    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, '# $1\n\n')
                    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '## $1\n\n')
                    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '### $1\n\n')
                    .replace(/<h4[^>]*>(.*?)<\/h4>/gis, '#### $1\n\n')
                    .replace(/<h5[^>]*>(.*?)<\/h5>/gis, '##### $1\n\n')
                    .replace(/<h6[^>]*>(.*?)<\/h6>/gis, '###### $1\n\n')
                    .replace(/<strong[^>]*>(.*?)<\/strong>/gis, '**$1**')
                    .replace(/<b[^>]*>(.*?)<\/b>/gis, '**$1**')
                    .replace(/<em[^>]*>(.*?)<\/em>/gis, '*$1*')
                    .replace(/<i[^>]*>(.*?)<\/i>/gis, '*$1*')
                    .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gis, '[$2]($1)')
                    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
                    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
                    .replace(/<code[^>]*>(.*?)<\/code>/gis, '`$1`')
                    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1\n')
                    .replace(/<ol[^>]*>(.*?)<\/ol>/gis, '$1\n')
                    .replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n')
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n')
                    .replace(/<div[^>]*>(.*?)<\/div>/gis, '$1\n')
                    .replace(/<[^>]+>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/\n{3,}/g, '\n\n')
                    .trim();
                  
                  const blob = new Blob([markdown], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'content.md';
                  link.click();
                  URL.revokeObjectURL(url);
                  setShowExportModal(false);
                }}
                className="w-full p-3 text-left border border-gray-300 rounded hover:bg-gray-50"
              >
                <div className="font-medium">{t.exportMarkdown}</div>
                <div className="text-sm text-gray-500">Download as Markdown</div>
              </button>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flex Block Modal */}
      {showFlexModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[85vh] overflow-y-auto animate-slideIn">
            <h3 className="text-lg font-semibold mb-4">{t.insertLayoutBlock}</h3>
            
            <div className="space-y-3">
              {!selectedTemplate ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Choose a Template</label>
                  <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setSelectedTemplate('2col')} className="p-3 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors">
                    <div className="flex gap-1 mb-2">
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-xs text-center">2 Columns</div>
                  </button>
                  
                  <button onClick={() => setSelectedTemplate('3col')} className="p-3 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors">
                    <div className="flex gap-1 mb-2">
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-xs text-center">3 Columns</div>
                  </button>
                  
                  <button onClick={() => setSelectedTemplate('sidebar')} className="p-3 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors">
                    <div className="flex gap-1 mb-2">
                      <div className="flex-[2] h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-xs text-center">2/3 + 1/3</div>
                  </button>
                  
                  <button onClick={() => setSelectedTemplate('2row')} className="p-3 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors">
                    <div className="flex flex-col gap-1 mb-2">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-xs text-center">2 Rows</div>
                  </button>
                  
                  <button onClick={() => setSelectedTemplate('media')} className="p-3 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-2 bg-gray-300 rounded"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="text-xs text-center">Image + Text</div>
                  </button>
                  
                  <button onClick={() => setSelectedTemplate('center')} className="p-3 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors">
                    <div className="flex justify-center items-center mb-2">
                      <div className="w-16 h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-xs text-center">Centered</div>
                  </button>
                  
                  <button onClick={() => setSelectedTemplate('4col')} className="p-3 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors">
                    <div className="flex gap-1 mb-2">
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-xs text-center">4 Columns</div>
                  </button>
                  
                  <button onClick={() => setSelectedTemplate('hero')} className="p-3 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors">
                    <div className="space-y-1 mb-2">
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded"></div>
                    </div>
                    <div className="text-xs text-center">Hero Section</div>
                  </button>
                </div>
              </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setSelectedTemplate('')} className="text-sm text-blue-500 hover:text-blue-600">← {t.back}</button>
                    <span className="text-sm font-medium">{t.customizeLayout}</span>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Gap Between Items</label>
                    <input type="text" value={flexGap} onChange={(e) => setFlexGap(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="10px" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Padding</label>
                    <input type="text" value={flexPadding} onChange={(e) => setFlexPadding(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="15px" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Border Style</label>
                    <select value={flexBorder} onChange={(e) => setFlexBorder(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                      <option value="2px dashed #d1d5db">Dashed Border</option>
                      <option value="2px solid #d1d5db">Solid Border</option>
                      <option value="none">No Border</option>
                    </select>
                  </div>
                  
                  <button onClick={() => {
                    const templates: Record<string, string> = {
                      '2col': `<div style="display: flex; gap: ${flexGap}; padding: ${flexPadding}; border: ${flexBorder}; border-radius: 8px; margin: 10px 0;">
  <div style="flex: 1; padding: 15px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Column+1" style="width: 100%; height: auto; border-radius: 4px;" /></div>
  <div style="flex: 1; padding: 15px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Column+2" style="width: 100%; height: auto; border-radius: 4px;" /></div>
</div><p><br></p>`,
                      '3col': `<div style="display: flex; gap: ${flexGap}; padding: ${flexPadding}; border: ${flexBorder}; border-radius: 8px; margin: 10px 0;">
  <div style="flex: 1; padding: 15px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/300x200/e5e7eb/6b7280?text=Column+1" style="width: 100%; height: auto; border-radius: 4px;" /></div>
  <div style="flex: 1; padding: 15px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/300x200/e5e7eb/6b7280?text=Column+2" style="width: 100%; height: auto; border-radius: 4px;" /></div>
  <div style="flex: 1; padding: 15px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/300x200/e5e7eb/6b7280?text=Column+3" style="width: 100%; height: auto; border-radius: 4px;" /></div>
</div><p><br></p>`,
                      '4col': `<div style="display: flex; gap: ${flexGap}; padding: ${flexPadding}; border: ${flexBorder}; border-radius: 8px; margin: 10px 0;">
  <div style="flex: 1; padding: 10px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/250x200/e5e7eb/6b7280?text=Col+1" style="width: 100%; height: auto; border-radius: 4px;" /></div>
  <div style="flex: 1; padding: 10px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/250x200/e5e7eb/6b7280?text=Col+2" style="width: 100%; height: auto; border-radius: 4px;" /></div>
  <div style="flex: 1; padding: 10px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/250x200/e5e7eb/6b7280?text=Col+3" style="width: 100%; height: auto; border-radius: 4px;" /></div>
  <div style="flex: 1; padding: 10px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/250x200/e5e7eb/6b7280?text=Col+4" style="width: 100%; height: auto; border-radius: 4px;" /></div>
</div><p><br></p>`,
                      'sidebar': `<div style="display: flex; gap: ${flexGap}; padding: ${flexPadding}; border: ${flexBorder}; border-radius: 8px; margin: 10px 0;">
  <div style="flex: 2; padding: 15px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/600x300/e5e7eb/6b7280?text=Main+Content" style="width: 100%; height: auto; border-radius: 4px;" /></div>
  <div style="flex: 1; padding: 15px; border-radius: 6px; min-height: 80px;"><img src="https://via.placeholder.com/300x300/e5e7eb/6b7280?text=Sidebar" style="width: 100%; height: auto; border-radius: 4px;" /></div>
</div><p><br></p>`,
                      '2row': `<div style="display: flex; flex-direction: column; gap: ${flexGap}; padding: ${flexPadding}; border: ${flexBorder}; border-radius: 8px; margin: 10px 0;">
  <div style="padding: 15px; border-radius: 6px; min-height: 60px;"><img src="https://via.placeholder.com/800x150/e5e7eb/6b7280?text=Row+1" style="width: 100%; height: auto; border-radius: 4px;" /></div>
  <div style="padding: 15px; border-radius: 6px; min-height: 60px;"><img src="https://via.placeholder.com/800x150/e5e7eb/6b7280?text=Row+2" style="width: 100%; height: auto; border-radius: 4px;" /></div>
</div><p><br></p>`,
                      'media': `<div style="display: flex; align-items: center; gap: 15px; padding: ${flexPadding}; border: ${flexBorder}; border-radius: 8px; margin: 10px 0;">
  <img src="https://via.placeholder.com/150x150/e5e7eb/6b7280?text=Image" style="width: 150px; height: 150px; border-radius: 6px; flex-shrink: 0; object-fit: cover;" />
  <div style="flex: 1;">
    <div style="font-weight: bold; font-size: 18px; margin-bottom: 8px;">Title</div>
    <div style="color: #6b7280; line-height: 1.5;">Description text goes here. Click to edit this content.</div>
  </div>
</div><p><br></p>`,
                      'center': `<div style="display: flex; justify-content: center; align-items: center; gap: ${flexGap}; padding: ${flexPadding}; border: ${flexBorder}; border-radius: 8px; margin: 10px 0; text-align: center; min-height: 150px;">
  <div style="max-width: 400px;"><img src="https://via.placeholder.com/400x200/e5e7eb/6b7280?text=Centered+Content" style="width: 100%; height: auto; border-radius: 4px;" /></div>
</div><p><br></p>`,
                      'hero': `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; padding: 40px ${flexPadding}; border: ${flexBorder}; border-radius: 8px; margin: 10px 0; text-align: center; min-height: 250px;">
  <img src="https://via.placeholder.com/800x300/e5e7eb/6b7280?text=Hero+Image" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin-bottom: 10px;" />
  <h2 style="font-size: 32px; font-weight: bold; margin: 0;">Hero Title</h2>
  <p style="color: #6b7280; font-size: 16px; margin: 0; max-width: 500px;">Hero description text. Click to edit this content.</p>
</div><p><br></p>`
                    };
                    const block = templates[selectedTemplate];
                    if (block) {
                      document.execCommand('insertHTML', false, block);
                      editorRef.current?.focus();
                    }
                    setShowFlexModal(false);
                    setSelectedTemplate('');
                    setFlexGap('10px');
                    setFlexPadding('15px');
                    setFlexBorder('2px dashed #d1d5db');
                  }} className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">Insert Block</button>
                </div>
              )}
            </div>
            
            {!selectedTemplate && (
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowFlexModal(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Math Modal */}
      {showMathModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg w-96 animate-slideIn">
            <h3 className="text-lg font-semibold mb-4">{t.insertMath}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{t.latexFormula}:</label>
              <textarea
                value={mathFormula}
                onChange={(e) => setMathFormula(e.target.value)}
                placeholder="E.g: x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"
                className="w-full p-3 border border-gray-300 rounded h-24 font-mono text-sm"
              />
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded border">
              <div className="text-sm text-gray-600 mb-2">{t.preview}:</div>
              <div className="p-2 bg-white border rounded min-h-8 text-center">
                {mathFormula ? (
                  <span 
                    dangerouslySetInnerHTML={{
                      __html: katex.renderToString(mathFormula, { throwOnError: false })
                    }}
                  />
                ) : (
                  <em className="text-gray-400">{t.enterFormulaAbove}</em>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mb-4">
              <strong>Examples:</strong><br/>
              • Fraction: \\frac{'{a}'}{'{b}'}<br/>
              • Square root: \\sqrt{'{x}'}<br/>
              • Superscript: x^2<br/>
              • Subscript: x_1
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowMathModal(false);
                  setMathFormula('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (mathFormula.trim()) {
                    editorRef.current?.focus();
                    const selection = window.getSelection();
                    if (savedRangeRef.current) {
                      selection?.removeAllRanges();
                      selection?.addRange(savedRangeRef.current);
                    }
                    const rendered = katex.renderToString(mathFormula, { throwOnError: false });
                    const mathSpan = `<span class="math-formula" data-formula="${mathFormula}">${rendered}</span>&nbsp;`;
                    document.execCommand('insertHTML', false, mathSpan);
                    savedRangeRef.current = null;
                  }
                  setShowMathModal(false);
                  setMathFormula('');
                }}
                disabled={!mathFormula.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WysiwygEditor;