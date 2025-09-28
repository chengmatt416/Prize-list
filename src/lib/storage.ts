import { Prize, PrizeInput, PrizeUpdate } from '@/types/prize';
import { v4 as uuidv4 } from 'uuid';
import { kv } from '@vercel/kv';

const PRIZES_KEY = 'prizes';

// Load prizes from KV store
const loadPrizes = async (): Promise<Prize[]> => {
  try {
    const data = await kv.get<Prize[]>(PRIZES_KEY);
    return data || [];
  } catch (error) {
    console.error('Error loading prizes:', error);
    return [];
  }
};

// Save prizes to KV store
const savePrizes = async (prizes: Prize[]) => {
  try {
    await kv.set(PRIZES_KEY, prizes);
  } catch (error) {
    console.error('Error saving prizes:', error);
    throw new Error('Failed to save prizes');
  }
};

export const prizeStorage = {
  // Get all prizes
  getAll: async (): Promise<Prize[]> => {
    return await loadPrizes();
  },

  // Get prize by id
  getById: async (id: string): Promise<Prize | undefined> => {
    const prizes = await loadPrizes();
    return prizes.find(p => p.id === id);
  },

  // Create new prize
  create: async (prizeInput: PrizeInput): Promise<Prize> => {
    const prizes = await loadPrizes();
    const newPrize: Prize = {
      id: uuidv4(),
      name: prizeInput.name,
      description: prizeInput.description,
      image: prizeInput.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEYzOUZGIi8+CjxwYXRoIGQ9Im0xNjAgMTMwIDQwIDM0LTQwIDM0IDE2IDEwIDI0LTM0IDI0IDM0IDE2LTEwem0wLTI0IDQ4IDQwIDQ4LTQwLTQ4LTQwLTQ4IDQweiIgZmlsbD0iI0ZGRiIvPgo8dGV4dCB4PSIyMDAiIHk9IjIwMCIgZmlsbD0iI0ZGRiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlByaXplIEltYWdlPC90ZXh0Pgo8L3N2Zz4K',
      requiredStamps: prizeInput.requiredStamps,
      isRedeemed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    prizes.push(newPrize);
    await savePrizes(prizes);
    return newPrize;
  },

  // Update existing prize
  update: async (prizeUpdate: PrizeUpdate): Promise<Prize | null> => {
    const prizes = await loadPrizes();
    const index = prizes.findIndex(p => p.id === prizeUpdate.id);
    
    if (index === -1) {
      return null;
    }

    prizes[index] = {
      ...prizes[index],
      ...prizeUpdate,
      updatedAt: new Date().toISOString()
    };
    
    await savePrizes(prizes);
    return prizes[index];
  },

  // Delete prize
  delete: async (id: string): Promise<boolean> => {
    const prizes = await loadPrizes();
    const index = prizes.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }

    prizes.splice(index, 1);
    await savePrizes(prizes);
    return true;
  }
};