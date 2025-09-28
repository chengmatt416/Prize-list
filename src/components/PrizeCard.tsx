'use client';

import { motion } from 'framer-motion';
import { Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Prize } from '@/types/prize';
import Image from 'next/image';

interface PrizeCardProps {
  prize: Prize;
  onToggle: (prizeId: string, isRedeemed: boolean) => void;
}

export default function PrizeCard({ prize, onToggle }: PrizeCardProps) {
  const handleClick = () => {
    onToggle(prize.id, !prize.isRedeemed);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group"
      onClick={handleClick}
    >
      <div className={`
        relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border transition-all duration-300 h-80
        ${prize.isRedeemed 
          ? 'border-gray-500/30 bg-gray-900/20' 
          : 'border-white/20 hover:border-white/40 hover:bg-white/15'
        }
      `}>
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {prize.isRedeemed ? (
            <div className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Redeemed</span>
            </div>
          ) : (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Available</span>
            </div>
          )}
        </div>

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {prize.image ? (
            <div className="relative h-full w-full">
              <Image
                src={prize.image}
                alt={prize.name}
                fill
                className={`object-cover transition-all duration-300 ${
                  prize.isRedeemed 
                    ? 'grayscale contrast-50 brightness-75' 
                    : 'group-hover:scale-110'
                }`}
              />
              {prize.isRedeemed && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-white/80" />
                </div>
              )}
            </div>
          ) : (
            <div className={`
              h-full w-full flex items-center justify-center
              ${prize.isRedeemed ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-500 to-pink-500'}
            `}>
              <Sparkles className={`h-16 w-16 ${prize.isRedeemed ? 'text-gray-400' : 'text-white'}`} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-semibold text-lg leading-tight ${
              prize.isRedeemed ? 'text-gray-400' : 'text-white'
            }`}>
              {prize.name}
            </h3>
          </div>
          
          <p className={`text-sm mb-3 line-clamp-2 ${
            prize.isRedeemed ? 'text-gray-500' : 'text-purple-200'
          }`}>
            {prize.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-1 text-sm ${
              prize.isRedeemed ? 'text-gray-500' : 'text-yellow-300'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{prize.requiredStamps} stamps</span>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                prize.isRedeemed 
                  ? 'bg-gray-600 text-gray-300' 
                  : 'bg-purple-500 text-white'
              }`}
            >
              {prize.isRedeemed ? 'Tap to restore' : 'Tap to redeem'}
            </motion.div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        {!prize.isRedeemed && (
          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
}