import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WysiwygEditor } from 'editly-wysiwyg';

function Demo() {
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(`wysiwyg_demo_${key}`);
      if (key === 'content') return saved || defaultValue;
      return saved ? JSON.parse(saved) : defaultValue;
    } catch { return defaultValue; }
  };

  const saveToStorage = (key, value) => {
    try {
      if (key === 'content') {
        localStorage.setItem(`wysiwyg_demo_${key}`, value);
      } else {
        localStorage.setItem(`wysiwyg_demo_${key}`, JSON.stringify(value));
      }
    } catch {}
  };

  const [content, setContent] = useState(() => loadFromStorage('content', ''));
  const [mode, setMode] = useState(() => loadFromStorage('mode', 'contextual'));
  const [showSeoGuide, setShowSeoGuide] = useState(() => loadFromStorage('showSeoGuide', true));
  const [toolbarPosition, setToolbarPosition] = useState(() => loadFromStorage('toolbarPosition', 'top'));
  const [autoResize, setAutoResize] = useState(() => loadFromStorage('autoResize', false));
  const [minHeight, setMinHeight] = useState(() => loadFromStorage('minHeight', '200px'));
  const [selectedTools, setSelectedTools] = useState(() => loadFromStorage('selectedTools', ['bold', 'italic', 'underline', 'textColor', 'backgroundColor', 'fontSize', 'header', 'createLink', 'insertUnorderedList', 'insertOrderedList', 'table', 'insertImage', 'quote', 'code', 'math', 'insertHorizontalRule', 'align', 'flexBlock', 'undo', 'redo', 'viewSource']));
  const [spellCheck, setSpellCheck] = useState(() => loadFromStorage('spellCheck', true));
  const [language, setLanguage] = useState(() => loadFromStorage('language', 'en'));
  const [selectedLang, setSelectedLang] = useState(() => loadFromStorage('selectedLang', 'en'));
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [lastTool, setLastTool] = useState('');
  const [customTheme, setCustomTheme] = useState(() => loadFromStorage('customTheme', false));
  const [iconSet, setIconSet] = useState(() => loadFromStorage('iconSet', 'outline'));
  const [showExportOptions, setShowExportOptions] = useState(() => loadFromStorage('showExportOptions', false));

  React.useEffect(() => { saveToStorage('content', content); }, [content]);
  React.useEffect(() => { saveToStorage('mode', mode); }, [mode]);
  React.useEffect(() => { saveToStorage('showSeoGuide', showSeoGuide); }, [showSeoGuide]);
  React.useEffect(() => { saveToStorage('toolbarPosition', toolbarPosition); }, [toolbarPosition]);
  React.useEffect(() => { saveToStorage('autoResize', autoResize); }, [autoResize]);
  React.useEffect(() => { saveToStorage('minHeight', minHeight); }, [minHeight]);
  React.useEffect(() => { saveToStorage('selectedTools', selectedTools); }, [selectedTools]);
  React.useEffect(() => { saveToStorage('spellCheck', spellCheck); }, [spellCheck]);
  React.useEffect(() => { saveToStorage('language', language); }, [language]);
  React.useEffect(() => { saveToStorage('selectedLang', selectedLang); }, [selectedLang]);
  React.useEffect(() => { saveToStorage('customTheme', customTheme); }, [customTheme]);
  React.useEffect(() => { saveToStorage('iconSet', iconSet); }, [iconSet]);
  React.useEffect(() => { saveToStorage('showExportOptions', showExportOptions); }, [showExportOptions]);

  const allTools = ['bold', 'italic', 'underline', 'createLink', 'header', 'insertUnorderedList', 'insertOrderedList', 'insertHorizontalRule', 'insertImage', 'quote', 'code', 'table', 'textColor', 'backgroundColor', 'fontSize', 'align', 'math', 'flexBlock', 'undo', 'redo', 'viewSource'];

  const toolIcons = {
    bold: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>,
    italic: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/></svg>,
    underline: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>,
    createLink: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>,
    header: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>,
    insertUnorderedList: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>,
    insertOrderedList: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>,
    insertHorizontalRule: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>,
    insertImage: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
    quote: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>,
    code: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>,
    table: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z"/></svg>,
    textColor: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M9.62 12L12 5.67 14.38 12H9.62zM11 3L5.5 17h2.25l1.12-3h6.25l1.12 3H18.5L13 3h-2zm-6 16h18v2H5v-2z"/></svg>,
    backgroundColor: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/><path d="M2 20h20v4H2z"/></svg>,
    fontSize: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/></svg>,
    math: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><text x="2" y="18" fontSize="16" fontFamily="serif" fontStyle="italic">fx</text></svg>,
    align: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/></svg>,
    flexBlock: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>,
    undo: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>,
    redo: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>,
    viewSource: <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
  };

  const toolLabels = {
    en: { bold: 'Bold', italic: 'Italic', underline: 'Underline', createLink: 'Link', header: 'Header', insertUnorderedList: 'Bullet List', insertOrderedList: 'Numbered List', insertHorizontalRule: 'Horizontal Rule', insertImage: 'Image', quote: 'Quote', code: 'Code', table: 'Table', textColor: 'Text Color', backgroundColor: 'Background Color', fontSize: 'Font Size', align: 'Align', math: 'Math', flexBlock: 'Flex Block', undo: 'Undo', redo: 'Redo', viewSource: 'View Source' },
    es: { bold: 'Negrita', italic: 'Cursiva', underline: 'Subrayado', createLink: 'Enlace', header: 'Encabezado', insertUnorderedList: 'Lista con viñetas', insertOrderedList: 'Lista numerada', insertHorizontalRule: 'Línea horizontal', insertImage: 'Imagen', quote: 'Cita', code: 'Código', table: 'Tabla', textColor: 'Color de texto', backgroundColor: 'Color de fondo', fontSize: 'Tamaño de fuente', math: 'Matemáticas', undo: 'Deshacer', redo: 'Rehacer', viewSource: 'Ver código' },
    fr: { bold: 'Gras', italic: 'Italique', underline: 'Souligné', createLink: 'Lien', header: 'En-tête', insertUnorderedList: 'Liste à puces', insertOrderedList: 'Liste numérotée', insertHorizontalRule: 'Ligne horizontale', insertImage: 'Image', quote: 'Citation', code: 'Code', table: 'Tableau', textColor: 'Couleur du texte', backgroundColor: 'Couleur de fond', fontSize: 'Taille de police', math: 'Mathématiques', undo: 'Annuler', redo: 'Rétablir', viewSource: 'Voir la source' },
    de: { bold: 'Fett', italic: 'Kursiv', underline: 'Unterstrichen', createLink: 'Link', header: 'Überschrift', insertUnorderedList: 'Aufzählungsliste', insertOrderedList: 'Nummerierte Liste', insertHorizontalRule: 'Horizontale Linie', insertImage: 'Bild', quote: 'Zitat', code: 'Code', table: 'Tabelle', textColor: 'Textfarbe', backgroundColor: 'Hintergrundfarbe', fontSize: 'Schriftgröße', math: 'Mathematik', undo: 'Rückgängig', redo: 'Wiederholen', viewSource: 'Quelle anzeigen' },
    it: { bold: 'Grassetto', italic: 'Corsivo', underline: 'Sottolineato', createLink: 'Collegamento', header: 'Intestazione', insertUnorderedList: 'Elenco puntato', insertOrderedList: 'Elenco numerato', insertHorizontalRule: 'Linea orizzontale', insertImage: 'Immagine', quote: 'Citazione', code: 'Codice', table: 'Tabella', textColor: 'Colore testo', backgroundColor: 'Colore sfondo', fontSize: 'Dimensione carattere', math: 'Matematica', undo: 'Annulla', redo: 'Ripeti', viewSource: 'Visualizza sorgente' },
    fa: { bold: 'پررنگ', italic: 'مورب', underline: 'زیرخط', createLink: 'پیوند', header: 'سرتیتر', insertUnorderedList: 'لیست نقطه‌ای', insertOrderedList: 'لیست شماره‌دار', insertHorizontalRule: 'خط افقی', insertImage: 'تصویر', quote: 'نقل قول', code: 'کد', table: 'جدول', textColor: 'رنگ متن', backgroundColor: 'رنگ پس‌زمینه', fontSize: 'اندازه فونت', math: 'ریاضی', undo: 'بازگشت', redo: 'جلو', viewSource: 'مشاهده کد' },
    pl: { bold: 'Pogrubienie', italic: 'Kursywa', underline: 'Podkreślenie', createLink: 'Link', header: 'Nagłówek', insertUnorderedList: 'Lista punktowana', insertOrderedList: 'Lista numerowana', insertHorizontalRule: 'Linia pozioma', insertImage: 'Obraz', quote: 'Cytat', code: 'Kod', table: 'Tabela', textColor: 'Kolor tekstu', backgroundColor: 'Kolor tła', fontSize: 'Rozmiar czcionki', math: 'Matematyka', undo: 'Cofnij', redo: 'Ponów', viewSource: 'Pokaż źródło' }
  };

  const assetLibrary = [
    {
      url: 'https://picsum.photos/400/300?random=1',
      thumbnail: 'https://picsum.photos/100/100?random=1',
      alt: 'Sample image 1',
      name: 'Nature'
    },
    {
      url: 'https://picsum.photos/400/300?random=2',
      thumbnail: 'https://picsum.photos/100/100?random=2',
      alt: 'Sample image 2',
      name: 'Architecture'
    }
  ];

  const getCodeExample = () => {
    let code = `import { WysiwygEditor } from 'editly-wysiwyg';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <WysiwygEditor
      value={content}
      onChange={setContent}
      mode="${mode}"`;

    if (mode === 'full') {
      code += `\n      toolbarPosition="${toolbarPosition}"`;
    }
    
    code += `\n      tools={${JSON.stringify(selectedTools)}}`;
    code += `\n      showSeoGuide={${showSeoGuide}}`;
    code += `\n      autoResize={${autoResize}}`;
    code += `\n      minHeight="${minHeight}"`;
    code += `\n      spellCheck={${spellCheck}}`;
    code += `\n      language="${language}"`;
    
    if (selectedLang !== 'en') {
      code += `\n      lang="${selectedLang}"`;
    }
    
    if (customTheme) {
      code += `\n      theme={{\n        primary: '#10b981',\n        background: '#f9fafb',\n        border: '#d1d5db',\n        text: '#111827',\n        toolbarBg: '#ffffff',\n        toolbarHover: '#f3f4f6',\n        buttonActive: '#d1fae5'\n      }}`;
    }
    
    code += `\n      placeholder="Start typing..."\n    />\n  );\n}`;
    
    return code;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px 10px' }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        pre { margin: 0; }
        code { font-family: 'Consolas', 'Monaco', monospace; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', color: 'white', animation: 'fadeIn 0.6s' }}>
          <h1 style={{ fontSize: 'clamp(32px, 8vw, 56px)', margin: '0 0 16px 0', fontWeight: '800', letterSpacing: '-1px' }}>Editly</h1>
          <p style={{ fontSize: 'clamp(16px, 4vw, 22px)', margin: '0 0 24px 0', opacity: 0.95, fontWeight: '500' }}>Lightweight, contextual WYSIWYG editor for React applications</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
            <code style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>npm install editly-wysiwyg</code>
            <button onClick={(e) => { navigator.clipboard.writeText('npm install editly-wysiwyg'); e.currentTarget.textContent = 'Copied!'; setTimeout(() => e.currentTarget.textContent = 'Copy', 2000); }} style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>Copy</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '32px', maxWidth: '1000px', margin: '32px auto 0' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>Contextual & Full Modes</h3>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.5' }}>Smart toolbar appears on selection or stays visible. Your choice.</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>Rich Formatting Tools</h3>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.5' }}>Tables, images, colors, math formulas, code blocks, and more.</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>7 Languages Built-in</h3>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.5' }}>English, Spanish, French, German, Italian, Persian, Polish.</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>Auto-Save Built-in</h3>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.5' }}>LocalStorage persistence with storageKey and autoSave props.</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>SEO Analysis</h3>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.5' }}>Real-time content analysis with word count and structure tips.</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>Flex Blocks</h3>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.5' }}>8 prebuilt layout templates with customizable spacing and borders.</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>Configuration</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Mode</label>
              <div style={{ display: 'flex', gap: '8px', padding: '4px', background: '#f3f4f6', borderRadius: '10px' }}>
                <button onClick={() => setMode('contextual')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: mode === 'contextual' ? 'white' : 'transparent', color: mode === 'contextual' ? '#667eea' : '#6b7280', cursor: 'pointer', fontWeight: '600', fontSize: '13px', boxShadow: mode === 'contextual' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>Contextual</button>
                <button onClick={() => setMode('full')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: mode === 'full' ? 'white' : 'transparent', color: mode === 'full' ? '#667eea' : '#6b7280', cursor: 'pointer', fontWeight: '600', fontSize: '13px', boxShadow: mode === 'full' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>Full</button>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: mode === 'full' ? '#374151' : '#9ca3af' }}>Toolbar Position</label>
              <select value={toolbarPosition} onChange={(e) => setToolbarPosition(e.target.value)} disabled={mode !== 'full'} style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', fontWeight: '500', color: mode === 'full' ? '#374151' : '#9ca3af', cursor: mode === 'full' ? 'pointer' : 'not-allowed', background: mode === 'full' ? 'white' : '#f9fafb', opacity: mode === 'full' ? 1 : 0.6 }}>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Language</label>
              <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer', background: 'white' }}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="fa">فارسی</option>
                <option value="pl">Polski</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Min Height</label>
              <input type="text" value={minHeight} onChange={(e) => setMinHeight(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', fontWeight: '500', color: '#374151' }} />
            </div>
          </div>
          
          <div style={{ paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Features</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', background: showSeoGuide ? '#f0f4ff' : 'white', borderColor: showSeoGuide ? '#667eea' : '#e5e7eb', transition: 'all 0.2s' }}>
                <input type="checkbox" checked={showSeoGuide} onChange={(e) => setShowSeoGuide(e.target.checked)} style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#667eea' }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: showSeoGuide ? '#374151' : '#6b7280' }}>SEO Guide</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', background: autoResize ? '#f0f4ff' : 'white', borderColor: autoResize ? '#667eea' : '#e5e7eb', transition: 'all 0.2s' }}>
                <input type="checkbox" checked={autoResize} onChange={(e) => setAutoResize(e.target.checked)} style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#667eea' }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: autoResize ? '#374151' : '#6b7280' }}>Auto Resize</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', background: spellCheck ? '#f0f4ff' : 'white', borderColor: spellCheck ? '#667eea' : '#e5e7eb', transition: 'all 0.2s' }}>
                <input type="checkbox" checked={spellCheck} onChange={(e) => setSpellCheck(e.target.checked)} style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#667eea' }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: spellCheck ? '#374151' : '#6b7280' }}>Spell Check</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', background: customTheme ? '#f0f4ff' : 'white', borderColor: customTheme ? '#667eea' : '#e5e7eb', transition: 'all 0.2s' }}>
                <input type="checkbox" checked={customTheme} onChange={(e) => setCustomTheme(e.target.checked)} style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#667eea' }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: customTheme ? '#374151' : '#6b7280' }}>Custom Theme</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', background: showExportOptions ? '#f0f4ff' : 'white', borderColor: showExportOptions ? '#667eea' : '#e5e7eb', transition: 'all 0.2s' }}>
                <input type="checkbox" checked={showExportOptions} onChange={(e) => setShowExportOptions(e.target.checked)} style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#667eea' }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: showExportOptions ? '#374151' : '#6b7280' }}>Export Options</span>
              </label>
            </div>
          </div>
          
          <div style={{ paddingTop: '20px', borderTop: '1px solid #e5e7eb', marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Available Tools</label>
            <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '13px' }}>Select which tools to show in the editor toolbar</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', marginBottom: '12px' }}>
            {allTools.map(tool => {
              const isSelected = selectedTools.includes(tool);
              return (
                <label key={tool} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: `2px solid ${isSelected ? '#667eea' : '#e5e7eb'}`, borderRadius: '8px', background: isSelected ? '#f0f4ff' : 'white', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }} onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#d1d5db'; }} onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#e5e7eb'; }}>
                  <input type="checkbox" checked={isSelected} onChange={() => setSelectedTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool])} style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#667eea' }} />
                  <span style={{ display: 'flex', alignItems: 'center', color: isSelected ? '#667eea' : '#6b7280' }}>{toolIcons[tool]}</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: isSelected ? '#374151' : '#6b7280', flex: 1 }}>{toolLabels[selectedLang][tool]}</span>
                </label>
              );
            })}
          </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => setSelectedTools(allTools)} style={{ flex: 1, padding: '12px 24px', border: '2px solid #667eea', borderRadius: '10px', background: '#667eea', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'; }}>Select All Tools</button>
              <button onClick={() => setSelectedTools([])} style={{ flex: 1, padding: '12px 24px', border: '2px solid #e5e7eb', borderRadius: '10px', background: 'white', color: '#6b7280', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}>Clear All</button>
            </div>
            

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#4ec9b0' }}>Code Example</h3>
            <button onClick={(e) => { navigator.clipboard.writeText(getCodeExample()); e.currentTarget.textContent = 'Copied!'; setTimeout(() => e.currentTarget.textContent = 'Copy', 2000); }} onMouseEnter={(e) => e.currentTarget.style.background = '#3e3e3e'} onMouseLeave={(e) => e.currentTarget.style.background = '#2d2d2d'} style={{ padding: '6px 12px', background: '#2d2d2d', color: '#d4d4d4', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', transition: 'all 0.2s' }}>Copy</button>
          </div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '20px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.6', overflowX: 'auto', margin: 0, fontFamily: '"Consolas", "Monaco", "Courier New", monospace' }}><code>{getCodeExample()}</code></pre>
        </div>

          </div>
        </div>



        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>Interactive Demo</h2>
          <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>Try the editor with your configuration</p>
          <WysiwygEditor
            value={content}
            onChange={setContent}
            mode={mode}
            toolbarPosition={toolbarPosition}
            tools={selectedTools}
            showSeoGuide={showSeoGuide}
            autoResize={autoResize}
            minHeight={minHeight}
            assetLibrary={assetLibrary}
            spellCheck={spellCheck}
            language={language}
            lang={selectedLang}
            showExportOptions={showExportOptions}
            placeholder="Start typing..."
            storageKey="wysiwyg_demo_content"
            autoSave={true}
            theme={customTheme ? { primary: '#10b981', background: '#f9fafb', border: '#d1d5db', text: '#111827', toolbarBg: '#ffffff', toolbarHover: '#f3f4f6', buttonActive: '#d1fae5' } : undefined}
            customButtons={[
              { 
                name: 'highlight', 
                icon: <span style={{ fontSize: '16px' }}>H</span>, 
                title: 'Highlight Text', 
                action: () => { 
                  const s = window.getSelection(); 
                  if (s?.rangeCount) { 
                    const r = s.getRangeAt(0); 
                    const sp = document.createElement('span'); 
                    sp.style.backgroundColor = 'yellow'; 
                    sp.appendChild(r.extractContents()); 
                    r.insertNode(sp); 
                  } 
                } 
              }, 
              { 
                name: 'uppercase', 
                icon: <span style={{ fontWeight: 'bold' }}>AA</span>, 
                title: 'Convert to Uppercase', 
                action: () => { 
                  const s = window.getSelection(); 
                  const t = s?.toString().toUpperCase(); 
                  if (t) document.execCommand('insertText', false, t); 
                } 
              }
            ]}
            onContentChange={(html, text, wordCount) => setStats({ words: wordCount, chars: text.length })}
            onSelectionChange={(hasSelection, selectedText) => setSelectedText(selectedText)}
            onToolClick={(toolName) => setLastTool(toolName)}
          />
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Event Callbacks</h3>
          <p style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>Track user interactions and content changes with built-in callback props. The stats below update in real-time as you use the editor.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '2px solid #e5e7eb' }}><div style={{ fontSize: '12px', color: '#6b7280' }}>Words</div><div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>{stats.words}</div></div>
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '2px solid #e5e7eb' }}><div style={{ fontSize: '12px', color: '#6b7280' }}>Characters</div><div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>{stats.chars}</div></div>
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '2px solid #e5e7eb' }}><div style={{ fontSize: '12px', color: '#6b7280' }}>Last Tool</div><div style={{ fontSize: '16px', fontWeight: '600', color: '#6366f1' }}>{lastTool || 'None'}</div></div>
          </div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '16px', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6', overflowX: 'auto', margin: 0, fontFamily: '"Consolas", "Monaco", "Courier New", monospace' }}><code>{`<WysiwygEditor
  onContentChange={(html, text, wordCount) => {
    console.log('Content:', html);
    console.log('Words:', wordCount);
  }}
  onSelectionChange={(hasSelection, selectedText) => {
    console.log('Selected:', selectedText);
  }}
  onToolClick={(toolName) => {
    console.log('Tool used:', toolName);
  }}
/>`}</code></pre>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>HTML Output</h3>
            <pre style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', fontSize: '12px', overflow: 'auto', maxHeight: '300px', border: '2px solid #e5e7eb', margin: 0, color: '#374151', lineHeight: '1.5' }}>{content || '<empty>'}</pre>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>Rendered Preview</h3>
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '2px solid #e5e7eb', minHeight: '100px', maxHeight: '300px', overflow: 'auto', fontSize: '14px', lineHeight: '1.6', color: '#374151' }} dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Asset Library</h3>
          <p style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>Provide your own image library for users to select from when inserting images. Pass an array of asset objects with url, thumbnail, alt, and name properties.</p>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '16px', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6', overflowX: 'auto', margin: 0, fontFamily: '"Consolas", "Monaco", "Courier New", monospace' }}><code>{`const assetLibrary = [
  {
    url: 'https://your-cdn.com/image1.jpg',
    thumbnail: 'https://your-cdn.com/thumb1.jpg',
    alt: 'Product photo',
    name: 'Product 1'
  },
  {
    url: 'https://your-cdn.com/image2.jpg',
    thumbnail: 'https://your-cdn.com/thumb2.jpg',
    alt: 'Banner image',
    name: 'Banner'
  }
];

<WysiwygEditor assetLibrary={assetLibrary} />`}</code></pre>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Custom Buttons</h3>
          <p style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>Add your own custom toolbar buttons with custom functionality. Each button needs a name, icon, title, and action function.</p>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '16px', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6', overflowX: 'auto', margin: 0, fontFamily: '"Consolas", "Monaco", "Courier New", monospace' }}><code>{`<WysiwygEditor
  customButtons={[
    {
      name: 'highlight',
      icon: <span>H</span>,
      title: 'Highlight Text',
      action: () => {
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
      name: 'insertDate',
      icon: <span>D</span>,
      title: 'Insert Date',
      action: () => {
        const date = new Date().toLocaleDateString();
        document.execCommand('insertText', false, date);
      }
    }
  ]}
/>`}</code></pre>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', color: 'white', opacity: 0.9 }}>
          <p style={{ margin: 0, fontSize: '14px' }}>Made with ❤️ May you be free of React one day | MIT License</p>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Demo />);