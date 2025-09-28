import { Prize, PrizeInput, PrizeUpdate } from '@/types/prize';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'prizes.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load prizes from file
const loadPrizes = (): Prize[] => {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading prizes:', error);
    return [];
  }
};

// Save prizes to file
const savePrizes = (prizes: Prize[]) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(prizes, null, 2));
  } catch (error) {
    console.error('Error saving prizes:', error);
    throw new Error('Failed to save prizes');
  }
};

export const prizeStorage = {
  // Get all prizes
  getAll: (): Prize[] => {
    return loadPrizes();
  },

  // Get prize by id
  getById: (id: string): Prize | undefined => {
    const prizes = loadPrizes();
    return prizes.find(p => p.id === id);
  },

  // Create new prize
  create: (prizeInput: PrizeInput): Prize => {
    const prizes = loadPrizes();
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
    savePrizes(prizes);
    return newPrize;
  },

  // Update existing prize
  update: (prizeUpdate: PrizeUpdate): Prize | null => {
    const prizes = loadPrizes();
    const index = prizes.findIndex(p => p.id === prizeUpdate.id);
    
    if (index === -1) {
      return null;
    }

    prizes[index] = {
      ...prizes[index],
      ...prizeUpdate,
      updatedAt: new Date().toISOString()
    };
    
    savePrizes(prizes);
    return prizes[index];
  },

  // Delete prize
  delete: (id: string): boolean => {
    const prizes = loadPrizes();
    const index = prizes.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }

    prizes.splice(index, 1);
    savePrizes(prizes);
    return true;
  }
};