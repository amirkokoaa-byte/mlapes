import React, { useState } from 'react';
import { Ruler, Shirt, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SizeCalculator from './components/SizeCalculator';
import VirtualTryOn from './components/VirtualTryOn';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sizes' | 'tryon'>('sizes');

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-200">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 text-white rounded-lg flex items-center justify-center">
              <Shirt size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">FitMatch</h1>
          </div>
          <nav className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('sizes')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'sizes' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Ruler size={16} />
                <span>المقاسات</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tryon')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tryon' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span>القياس الافتراضي</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'sizes' ? (
            <motion.div
              key="sizes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SizeCalculator />
            </motion.div>
          ) : (
            <motion.div
              key="tryon"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <VirtualTryOn />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
