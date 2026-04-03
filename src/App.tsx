import React, { useState } from 'react';
import { Ruler, Sparkles, Menu, X, ScanFace, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SizeCalculator from './components/SizeCalculator';
import VirtualTryOn from './components/VirtualTryOn';
import BodyScanner from './components/BodyScanner';
import ARMirror from './components/ARMirror';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sizes' | 'tryon' | 'scanner' | 'armirror'>('sizes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-neutral-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col ${
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
            onClick={() => { setActiveTab('scanner'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'scanner' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <ScanFace size={20} />
            <span>الكشف التلقائي (AI)</span>
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
          <button
            onClick={() => { setActiveTab('armirror'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'armirror' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Camera size={20} />
            <span>تقنية AR</span>
          </button>
        </nav>
        
        <div className="mt-auto p-6 border-t border-neutral-100">
          <p className="text-sm text-neutral-500 text-center leading-relaxed">
            مع تحيات المطور<br />
            <span className="font-bold text-neutral-900 text-base">Amir Lamay</span>
          </p>
        </div>
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
              {activeTab === 'sizes' && (
                <motion.div key="sizes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <SizeCalculator />
                </motion.div>
              )}
              {activeTab === 'scanner' && (
                <motion.div key="scanner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <BodyScanner />
                </motion.div>
              )}
              {activeTab === 'tryon' && (
                <motion.div key="tryon" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <VirtualTryOn />
                </motion.div>
              )}
              {activeTab === 'armirror' && (
                <motion.div key="armirror" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <ARMirror />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
