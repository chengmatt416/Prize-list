'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Save, 
  X, 
  ArrowLeft, 
  Settings,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { Prize, PrizeInput } from '@/types/prize';
import Image from 'next/image';

export default function AdminPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [formData, setFormData] = useState<PrizeInput>({
    name: '',
    description: '',
    image: '',
    requiredStamps: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingPrize) {
        // Update existing prize
        const response = await fetch(`/api/prizes/${editingPrize.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const updatedPrize = await response.json();
          setPrizes(prev => prev.map(p => p.id === editingPrize.id ? updatedPrize : p));
          setEditingPrize(null);
        }
      } else {
        // Create new prize
        const response = await fetch('/api/prizes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newPrize = await response.json();
          setPrizes(prev => [...prev, newPrize]);
          setShowAddForm(false);
        }
      }

      // Reset form
      setFormData({ name: '', description: '', image: '', requiredStamps: 1 });
    } catch (error) {
      console.error('Error saving prize:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prize?')) return;

    try {
      const response = await fetch(`/api/prizes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPrizes(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting prize:', error);
    }
  };

  const startEdit = (prize: Prize) => {
    setEditingPrize(prize);
    setFormData({
      name: prize.name,
      description: prize.description,
      image: prize.image,
      requiredStamps: prize.requiredStamps
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingPrize(null);
    setFormData({ name: '', description: '', image: '', requiredStamps: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white hover:text-purple-200 transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </motion.button>
              </Link>
              <div className="flex items-center space-x-3">
                <Settings className="h-8 w-8 text-purple-400" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                  <p className="text-purple-200">Manage your prize collection</p>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowAddForm(true);
                setEditingPrize(null);
                setFormData({ name: '', description: '', image: '', requiredStamps: 1 });
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Prize</span>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Form */}
        <AnimatePresence>
          {(showAddForm || editingPrize) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingPrize ? 'Edit Prize' : 'Add New Prize'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    cancelEdit();
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Prize Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter prize name..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Required Stamps
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.requiredStamps}
                      onChange={(e) => setFormData(prev => ({ ...prev, requiredStamps: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe the prize..."
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Prize Image
                  </label>
                  <div
                    className={`
                      relative border-2 border-dashed rounded-lg p-6 transition-colors
                      ${dragActive 
                        ? 'border-purple-400 bg-purple-500/10' 
                        : 'border-white/30 hover:border-white/50'
                      }
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {formData.image ? (
                      <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                          <Image
                            src={formData.image}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">Image uploaded successfully</p>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="text-red-400 hover:text-red-300 text-sm mt-1"
                          >
                            Remove image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70 mb-2">Drop image here or click to upload</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                          id="imageUpload"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Choose File</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{submitting ? 'Saving...' : 'Save Prize'}</span>
                  </motion.button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      cancelEdit();
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prizes List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            All Prizes ({prizes.length})
          </h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-lg h-24 animate-pulse" />
              ))}
            </div>
          ) : prizes.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-4">No prizes added yet</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Add Your First Prize
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {prizes.map((prize) => (
                <motion.div
                  key={prize.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {prize.image && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={prize.image}
                          alt={prize.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-medium truncate">{prize.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          prize.isRedeemed 
                            ? 'bg-gray-600 text-gray-300' 
                            : 'bg-green-600 text-white'
                        }`}>
                          {prize.isRedeemed ? 'Redeemed' : 'Available'}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm line-clamp-2 mb-2">{prize.description}</p>
                      <p className="text-purple-300 text-sm">{prize.requiredStamps} stamps required</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startEdit(prize)}
                        className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(prize.id)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}