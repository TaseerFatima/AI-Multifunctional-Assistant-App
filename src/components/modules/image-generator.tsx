// src/components/modules/ImageGenerator.tsx
import { useState, useRef } from 'react';
import { Image as ImageIcon, Download, Copy, RefreshCw, Palette,Sparkles, Wand2,  Filter,  Heart,} from 'lucide-react';
import { useRAG } from '../../context/RAGContext';

const styles = [
  { id: 'realistic', name: 'Realistic', icon: '🎨', color: 'bg-blue-500' },
  { id: 'anime', name: 'Anime', icon: '🌸', color: 'bg-pink-500' },
  { id: 'fantasy', name: 'Fantasy', icon: '🧚', color: 'bg-purple-500' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖', color: 'bg-cyan-500' },
  { id: 'watercolor', name: 'Watercolor', icon: '🎨', color: 'bg-green-500' },
  { id: 'pixel-art', name: 'Pixel Art', icon: '👾', color: 'bg-yellow-500' },
  { id: 'oil-painting', name: 'Oil Painting', icon: '🖼️', color: 'bg-orange-500' },
  { id: 'minimal', name: 'Minimal', icon: '⚪', color: 'bg-gray-500' },
];

const aspectRatios = [
  { id: '1:1', name: 'Square', dimensions: '1024x1024' },
  { id: '16:9', name: 'Widescreen', dimensions: '1920x1080' },
  { id: '9:16', name: 'Portrait', dimensions: '1080x1920' },
  { id: '4:3', name: 'Standard', dimensions: '1200x900' },
  { id: '3:2', name: 'Photography', dimensions: '1800x1200' },
];

const imageSamples = [
  {
    id: 1,
    prompt: 'A majestic lion in the African savannah at sunset',
    style: 'realistic',
    aspect: '16:9'
  },
  {
    id: 2,
    prompt: 'Cyberpunk cityscape with neon lights and flying cars',
    style: 'cyberpunk',
    aspect: '16:9'
  },
  {
    id: 3,
    prompt: 'Ancient Japanese temple surrounded by cherry blossoms',
    style: 'anime',
    aspect: '9:16'
  },
  {
    id: 4,
    prompt: 'Astronaut floating in space with Earth in background',
    style: 'fantasy',
    aspect: '1:1'
  },
];

interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  aspect: string;
  timestamp: Date;
  url: string;
  likes: number;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedAspect, setSelectedAspect] = useState('1:1');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  
  const { addToKnowledgeBase } = useRAG();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImages = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    
    // Simulate AI image generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newImages: GeneratedImage[] = [];
    const styleName = styles.find(s => s.id === selectedStyle)?.name || selectedStyle;
    const aspectName = aspectRatios.find(a => a.id === selectedAspect)?.name || selectedAspect;
    
    for (let i = 0; i < numImages; i++) {
      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        prompt,
        style: selectedStyle,
        aspect: selectedAspect,
        timestamp: new Date(),
        url: `https://picsum.photos/seed/${seed + i}/800/600`,
        likes: Math.floor(Math.random() * 100)
      };
      newImages.push(newImage);
    }
    
    setGeneratedImages([...newImages, ...generatedImages]);
    setSelectedImage(newImages[0]);
    
    // Add to knowledge base
    addToKnowledgeBase({
      title: `Generated: ${prompt.substring(0, 30)}...`,
      text: `Prompt: ${prompt}\nStyle: ${styleName}\nAspect: ${aspectName}\nNegative: ${negativePrompt || 'None'}`,
      type: 'image',
      timestamp: new Date().toLocaleString(),
      tags: [selectedStyle, selectedAspect, 'image-generation']
    });
    
    setLoading(false);
  };

  const loadSample = (sample: typeof imageSamples[0]) => {
    setPrompt(sample.prompt);
    setSelectedStyle(sample.style);
    setSelectedAspect(sample.aspect);
  };

  const downloadImage = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `ai_image_${image.id}.jpg`;
    link.click();
  };

  const likeImage = (id: string) => {
    setGeneratedImages(images => 
      images.map(img => 
        img.id === id ? { ...img, likes: img.likes + 1 } : img
      )
    );
  };

  const regenerateSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  const applyFilter = (filter: string) => {
    if (canvasRef.current && selectedImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = selectedImage.url;
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Apply filter
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            if (filter === 'grayscale') {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg;
              data[i + 1] = avg;
              data[i + 2] = avg;
            } else if (filter === 'sepia') {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
              data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
              data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
            } else if (filter === 'invert') {
              data[i] = 255 - data[i];
              data[i + 1] = 255 - data[i + 1];
              data[i + 2] = 255 - data[i + 2];
            }
          }
          
          ctx?.putImageData(imageData, 0, 0);
          
          // Convert canvas to image URL
          const filteredUrl = canvas.toDataURL('image/jpeg');
          const updatedImage = { ...selectedImage, url: filteredUrl };
          setSelectedImage(updatedImage);
          setGeneratedImages(images => 
            images.map(img => img.id === selectedImage.id ? updatedImage : img)
          );
        }
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Describe your image
        </label>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A beautiful sunset over mountains with a lake reflection..."
            className="w-full h-32 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none"
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-500">
            {prompt.length}/1000
          </div>
        </div>
      </div>

      {/* Quick Samples */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Quick Ideas
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {imageSamples.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSample(sample)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left"
            >
              <div className="text-xs text-slate-400 mb-1">{sample.style}</div>
              <div className="text-sm text-slate-300 line-clamp-2">{sample.prompt}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Art Style
        </label>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                selectedStyle === style.id
                  ? `${style.color} text-white`
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="text-lg mb-1">{style.icon}</span>
              <span className="text-xs">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio & Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-5 gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setSelectedAspect(ratio.id)}
                className={`p-3 rounded-lg transition-colors ${
                  selectedAspect === ratio.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className="font-medium">{ratio.id}</div>
                <div className="text-xs text-slate-400">{ratio.dimensions}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Number of Images
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min="1"
                max="4"
                value={numImages}
                onChange={(e) => setNumImages(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="text-2xl font-bold text-blue-500">{numImages}</div>
          </div>
          <div className="text-xs text-slate-500 mt-2">Generate multiple variations</div>
        </div>
      </div>

      {/* Advanced Options */}
      <div>
        <button
          onClick={() => setAdvancedOptions(!advancedOptions)}
          className="flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <Wand2 className="w-4 h-4" />
          {advancedOptions ? 'Hide' : 'Show'} Advanced Options
        </button>
        
        {advancedOptions && (
          <div className="mt-4 space-y-4 p-4 bg-slate-800 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Negative Prompt
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Things to avoid (blurry, low quality, watermark...)"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Seed Value
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(parseInt(e.target.value))}
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                  <button
                    onClick={regenerateSeed}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
                  >
                    Random
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Quality
                </label>
                <select className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
                  <option>Standard (Fast)</option>
                  <option>High Quality</option>
                  <option>Maximum (Slow)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generateImages}
          disabled={loading || !prompt.trim()}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            loading || !prompt.trim()
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Images
            </>
          )}
        </button>
        
        <button
          onClick={() => setPrompt('')}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium"
        >
          Clear
        </button>
      </div>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Images</h3>
            <div className="text-sm text-slate-400">
              {generatedImages.length} images
            </div>
          </div>
          
          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="w-full h-auto max-h-96 object-contain bg-slate-950"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => likeImage(selectedImage.id)}
                    className="p-2 bg-slate-900/80 hover:bg-slate-800/80 rounded-full backdrop-blur-sm"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => downloadImage(selectedImage)}
                    className="p-2 bg-slate-900/80 hover:bg-slate-800/80 rounded-full backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-white">{selectedImage.prompt}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Palette className="w-4 h-4" />
                        {styles.find(s => s.id === selectedImage.style)?.name}
                      </span>
                      <span>{selectedImage.aspect}</span>
                      <span>{selectedImage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {selectedImage.likes}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Image Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => downloadImage(selectedImage)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedImage.prompt)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </button>
                  
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg">
                      <Filter className="w-4 h-4" />
                      Apply Filter
                    </button>
                    <div className="absolute left-0 mt-2 hidden group-hover:block bg-slate-800 rounded-lg shadow-lg z-10">
                      <div className="p-2 space-y-1">
                        <button onClick={() => applyFilter('grayscale')} className="block w-full px-4 py-2 text-left hover:bg-slate-700 rounded">
                          Grayscale
                        </button>
                        <button onClick={() => applyFilter('sepia')} className="block w-full px-4 py-2 text-left hover:bg-slate-700 rounded">
                          Sepia
                        </button>
                        <button onClick={() => applyFilter('invert')} className="block w-full px-4 py-2 text-left hover:bg-slate-700 rounded">
                          Invert Colors
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
                  selectedImage?.id === image.id
                    ? 'ring-2 ring-blue-500'
                    : 'hover:ring-2 hover:ring-slate-600'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span>{image.aspect}</span>
                        <Heart className="w-3 h-3" /> {image.likes}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(image);
                        }}
                        className="p-1 bg-white/20 hover:bg-white/30 rounded"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Empty State */}
      {generatedImages.length === 0 && !loading && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No Images Generated</h3>
          <p className="text-slate-600">Describe your image and click generate to create AI-powered artwork</p>
        </div>
      )}
    </div>
  );
}