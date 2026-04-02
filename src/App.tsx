import React, { useState, useEffect } from 'react';
import { Ruler, Sparkles, Menu, X, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SizeCalculator from './components/SizeCalculator';
import VirtualTryOn from './components/VirtualTryOn';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sizes' | 'tryon'>('sizes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const aistudio = (window as any).aistudio;
    if (aistudio?.hasSelectedApiKey) {
      aistudio.hasSelectedApiKey().then(setHasKey);
    }
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio?.openSelectKey) {
      await aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  if (!hasKey) {
    return (
      <div dir="rtl" className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 max-w-md text-center">
          <Key className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">مطلوب مفتاح API</h2>
          <p className="text-neutral-600 mb-6">
            لاستخدام ميزة القياس الافتراضي عالية الجودة، يرجى اختيار مفتاح API الخاص بك.
          </p>
          <button
            onClick={handleSelectKey}
            className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors w-full"
          >
            اختيار مفتاح API
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-200 flex">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-neutral-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-neutral-900 text-white rounded-xl">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3a3 3 0 0 0-6 0L4 7l1 3 2-1v6h10v-6l2 1 1-3-5-4z" />
                <path d="M7 15v7h3l2-4 2 4h3v-7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" dir="ltr">Clothes</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-neutral-500 hover:text-neutral-900">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => { setActiveTab('sizes'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'sizes' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Ruler size={20} />
            <span>حاسبة المقاسات</span>
          </button>
          <button
            onClick={() => { setActiveTab('tryon'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'tryon' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Sparkles size={20} />
            <span>القياس الافتراضي</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden w-full">
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center px-4 lg:hidden sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-neutral-600 hover:text-neutral-900">
            <Menu size={24} />
          </button>
          <div className="ml-auto mr-4 flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-neutral-900 text-white rounded-lg">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3a3 3 0 0 0-6 0L4 7l1 3 2-1v6h10v-6l2 1 1-3-5-4z" />
                <path d="M7 15v7h3l2-4 2 4h3v-7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold" dir="ltr">Clothes</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'sizes' ? (
                <motion.div key="sizes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <SizeCalculator />
                </motion.div>
              ) : (
                <motion.div key="tryon" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <VirtualTryOn />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
