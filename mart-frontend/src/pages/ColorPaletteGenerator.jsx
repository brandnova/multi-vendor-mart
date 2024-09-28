import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { FaExpand, FaCompress, FaCopy, FaSave, FaUndo, FaRedo, FaLock, FaUnlock, FaMagic, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import namer from 'color-namer';

const ColorPaletteGenerator = () => {
  const [colors, setColors] = useState([
    { hex: '#000000', locked: false, role: 'primary' },
    { hex: '#ffffff', locked: false, role: 'secondary' },
    { hex: '#cccccc', locked: false, role: 'accent' },
  ]);
  const [savedPalettes, setSavedPalettes] = useState(
    JSON.parse(localStorage.getItem('savedPalettes')) || []
  );
  const [showPaletteHistory, setShowPaletteHistory] = useState(false);
  const [history, setHistory] = useState([colors]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeColorIndex, setActiveColorIndex] = useState(null);
  const [harmonyMode, setHarmonyMode] = useState('complementary');
  const [showPreview, setShowPreview] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showColorRoles, setShowColorRoles] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z') {
          undo();
        } else if (event.key === 'y') {
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex]);

  const addToHistory = (newColors) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newColors);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setColors(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setColors(history[historyIndex + 1]);
    }
  };

  const generateHarmoniousPalette = () => {
    const baseHue = Math.floor(Math.random() * 360);
    let newColors;

    switch (harmonyMode) {
      case 'complementary':
        newColors = [
          hslToHex(baseHue, 70, 50),
          hslToHex((baseHue + 180) % 360, 70, 50),
          hslToHex((baseHue + 90) % 360, 70, 50),
        ];
        break;
      case 'analogous':
        newColors = [
          hslToHex(baseHue, 70, 50),
          hslToHex((baseHue + 30) % 360, 70, 50),
          hslToHex((baseHue + 60) % 360, 70, 50),
        ];
        break;
      case 'triadic':
        newColors = [
          hslToHex(baseHue, 70, 50),
          hslToHex((baseHue + 120) % 360, 70, 50),
          hslToHex((baseHue + 240) % 360, 70, 50),
        ];
        break;
      default:
        newColors = [
          `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
          `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
          `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
        ];
    }

    const updatedColors = colors.map((color, index) => ({
      ...color,
      hex: color.locked ? color.hex : newColors[index],
    }));

    setColors(updatedColors);
    addToHistory(updatedColors);
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard!`);
  };

  const savePalette = () => {
    const newPalette = {
      id: Date.now(),
      colors: colors,
    };
    setSavedPalettes([...savedPalettes, newPalette]);
    localStorage.setItem('savedPalettes', JSON.stringify([...savedPalettes, newPalette]));
    toast.success('Palette saved successfully!');
  };

  const loadPalette = (palette) => {
    setColors(palette.colors);
    addToHistory(palette.colors);
  };

  const deletePalette = (paletteId) => {
    const updatedPalettes = savedPalettes.filter((palette) => palette.id !== paletteId);
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
    toast.success('Palette deleted successfully!');
  };

  const exportPaletteAsImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = colors.length * 100;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    colors.forEach((color, index) => {
      ctx.fillStyle = color.hex;
      ctx.fillRect(index * 100, 0, 100, 200);
    });

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Color Palette', 10, 230);

    const link = document.createElement('a');
    link.download = 'color-palette.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleLock = (index) => {
    const newColors = [...colors];
    newColors[index].locked = !newColors[index].locked;
    setColors(newColors);
    addToHistory(newColors);
  };

  const handleColorChange = (color) => {
    if (activeColorIndex !== null) {
      const newColors = [...colors];
      newColors[activeColorIndex].hex = color;
      setColors(newColors);
      addToHistory(newColors);
    }
  };

  const getColorName = (hex) => {
    const names = namer(hex);
    return names.ntc[0].name;
  };

  const getContrastRatio = (color1, color2) => {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
  };

  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const [rL, gL, bL] = [r, g, b].map(c => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
  };

  const checkAccessibility = (textColor, backgroundColor) => {
    const ratio = getContrastRatio(textColor, backgroundColor);
    return ratio >= 4.5 ? 'Accessible' : 'Not accessible';
  };

  const SimplePreview = () => (
    <div className="mt-8 border rounded-lg overflow-hidden" style={{ backgroundColor: colors[1].hex }}>
      <div className="p-4" style={{ backgroundColor: colors[0].hex, color: colors[1].hex }}>
        <h2 className="text-2xl font-bold">Store Name</h2>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-lg p-4 mb-4" style={{ color: colors[0].hex }}>
          <h3 className="text-xl font-semibold mb-2">Featured Product</h3>
          <p>Product description goes here.</p>
          <button className="mt-2 px-4 py-2 rounded" style={{ backgroundColor: colors[2].hex, color: colors[1].hex }}>
            Buy Now
          </button>
        </div>
        <div className="bg-white rounded-lg p-4" style={{ color: colors[0].hex }}>
          <h3 className="text-xl font-semibold mb-2">About Us</h3>
          <p>Store description and information goes here.</p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-grow flex flex-col md:flex-row">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="flex-grow relative"
            style={{ backgroundColor: color.hex }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="flex justify-between">
                <button
                  className="bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 font-bold p-2 rounded"
                  onClick={() => copyToClipboard(color.hex)}
                >
                  <FaCopy />
                </button>
                <button
                  className="bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 font-bold p-2 rounded"
                  onClick={() => toggleLock(index)}
                >
                  {color.locked ? <FaLock /> : <FaUnlock />}
                </button>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-2xl shadow-sm">{color.hex}</p>
                <p className="text-white font-semibold mt-2">{color.role} color</p>
                <p className="text-white mt-1">{getColorName(color.hex)}</p>
                <p className="text-white mt-1">
                  Accessibility: {checkAccessibility(color.hex, colors[1].hex)}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 font-bold p-2 rounded"
                  onClick={() => setActiveColorIndex(index)}
                >
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-white shadow-lg p-4 flex flex-wrap justify-center gap-2">
        <select
          className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
          value={harmonyMode}
          onChange={(e) => setHarmonyMode(e.target.value)}
        >
          <option value="complementary">Complementary</option>
          <option value="analogous">Analogous</option>
          <option value="triadic">Triadic</option>
          <option value="random">Random</option>
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={generateHarmoniousPalette}
        >
          <FaMagic className="inline-block mr-2" />
          Generate Palette
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
          onClick={() => setShowPaletteHistory(!showPaletteHistory)}
        >
          {showPaletteHistory ? <FaCompress className="inline-block mr-2" /> : <FaExpand className="inline-block mr-2" />}
          {showPaletteHistory ? 'Hide' : 'Show'} Saved
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={savePalette}
        >
          <FaSave className="inline-block mr-2" />
          Save
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          onClick={exportPaletteAsImage}
        >
          <FaDownload className="inline-block mr-2" />
          Export
        </button>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
          onClick={undo}
          disabled={historyIndex <= 0}
        >
          <FaUndo className="inline-block mr-2" />
          Undo
        </button>
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
        >
          <FaRedo className="inline-block mr-2" />
          Redo
        </button>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowAccessibility(!showAccessibility)}
        >
          {showAccessibility ? 'Hide Accessibility' : 'Show Accessibility'}
        </button>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowColorRoles(!showColorRoles)}
        >
          {showColorRoles ? 'Hide Color Roles' : 'Show Color Roles'}
        </button>
      </div>
      {activeColorIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <HexColorPicker color={colors[activeColorIndex].hex} onChange={handleColorChange} />
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setActiveColorIndex(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showPaletteHistory && (
        <div className="bg-white shadow-lg p-4 mt-4">
          <h3 className="text-xl font-semibold mb-4">Saved Palettes</h3>
          <div className="flex overflow-x-auto pb-4">
            {savedPalettes.map((palette) => (
              <div key={palette.id} className="flex-shrink-0 mr-4">
                <div className="flex mb-2">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                  onClick={() => loadPalette(palette)}
                >
                  Load
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                  onClick={() => deletePalette(palette.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SimplePreview />
        </motion.div>
      )}

      {showAccessibility && (
        <motion.div
          className="bg-white shadow-lg p-4 mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4">Accessibility Information</h3>
          <p>Primary on Secondary: {checkAccessibility(colors[0].hex, colors[1].hex)}</p>
          <p>Secondary on Primary: {checkAccessibility(colors[1].hex, colors[0].hex)}</p>
          <p>Accent on Secondary: {checkAccessibility(colors[2].hex, colors[1].hex)}</p>
        </motion.div>
      )}

      {showColorRoles && (
        <motion.div
          className="bg-white shadow-lg p-4 mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4">Color Roles</h3>
          <p>Primary Color: Used for navbar, modals, buttons, text color, and badges</p>
          <p>Secondary Color: Used for main page background</p>
          <p>Accent Color: Used for cards and other page components</p>
        </motion.div>
      )}
      <nav className="bg-gray-800 text-white p-4 mt-4">
        <ul className="flex justify-center space-x-4">
          <li><Link to="/dashboard" className="hover:text-gray-300">Return to Dashboard</Link></li>
          <li><a href="#" className="hover:text-gray-300">Store</a></li>
          <li><a href="#" className="hover:text-gray-300">Help</a></li>
        </ul>
      </nav>
    </motion.div>
  );
};

export default ColorPaletteGenerator;