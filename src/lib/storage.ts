import { Prize, PrizeInput, PrizeUpdate } from '@/types/prize';
import { v4 as uuidv4 } from 'uuid';
import { createClient, RedisClientType } from 'redis';

const PRIZES_KEY = 'prizes';

// Global Redis client instance
let redisClient: RedisClientType | null = null;

// Initialize Redis client
const getRedisClient = async (): Promise<RedisClientType | null> => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await redisClient.connect();
  }

  return redisClient;
};

// Load prizes from Redis store or fallback to file system in development
const loadPrizes = async (): Promise<Prize[]> => {
  try {
    // Try Redis first (production on Vercel)
    const redis = await getRedisClient();
    if (redis) {
      const prizesData = await redis.get(PRIZES_KEY);
      
      if (prizesData) {
        return JSON.parse(prizesData);
      }
      return [];
    }
    
    // Fallback to file system for local development
    const fs = await import('fs');
    const path = await import('path');
    const DATA_FILE = path.join(process.cwd(), 'data', 'prizes.json');
    
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
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

// Save prizes to Redis store or fallback to file system in development
const savePrizes = async (prizes: Prize[]) => {
  try {
    // Try Redis first (production on Vercel)
    const redis = await getRedisClient();
    if (redis) {
      await redis.set(PRIZES_KEY, JSON.stringify(prizes));
      return;
    }
    
    // Fallback to file system for local development
    const fs = await import('fs');
    const path = await import('path');
    const DATA_FILE = path.join(process.cwd(), 'data', 'prizes.json');
    
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(prizes, null, 2));
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