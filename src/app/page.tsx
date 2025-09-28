'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Crown, Sparkles, Settings } from 'lucide-react';
import Link from 'next/link';
import { Prize } from '@/types/prize';
import PrizeCard from '@/components/PrizeCard';

export default function Home() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'redeemed'>('all');

  useEffect(() => {
    fetchPrizes();
  }, []);

  const fetchPrizes = async () => {
    try {
      const response = await fetch('/api/prizes');
      if (response.ok) {
        const data = await response.json();
        setPrizes(data);
      }
    } catch (error) {
      console.error('Error fetching prizes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrizeToggle = async (prizeId: string, isRedeemed: boolean) => {
    try {
      const response = await fetch(`/api/prizes/${prizeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRedeemed }),
      });

      if (response.ok) {
        const updatedPrize = await response.json();
        setPrizes(prev => 
          prev.map(p => p.id === prizeId ? updatedPrize : p)
        );
      }
    } catch (error) {
      console.error('Error updating prize:', error);
    }
  };

  const filteredPrizes = prizes.filter(prize => {
    if (filter === 'available') return !prize.isRedeemed;
    if (filter === 'redeemed') return prize.isRedeemed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <Crown className="h-8 w-8 text-yellow-400" />
                <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Prize List</h1>
                <p className="text-purple-200">Collect stamps, win amazing prizes!</p>
              </div>
            </motion.div>
            
            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-white transition-colors flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 w-fit">
          {[
            { key: 'all', label: 'All Prizes', icon: Gift },
            { key: 'available', label: 'Available', icon: Sparkles },
            { key: 'redeemed', label: 'Redeemed', icon: Crown }
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(key as 'all' | 'available' | 'redeemed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                filter === key
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Prizes Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredPrizes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Gift className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No prizes found</h3>
            <p className="text-purple-200 mb-6">
              {filter === 'all' 
                ? "No prizes have been added yet. Check back later!"
                : `No ${filter} prizes at the moment.`
              }
            </p>
            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Add First Prize
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredPrizes.map((prize) => (
                <PrizeCard
                  key={prize.id}
                  prize={prize}
                  onToggle={handlePrizeToggle}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
