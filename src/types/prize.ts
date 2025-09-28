export interface Prize {
  id: string;
  name: string;
  description: string;
  image: string; // base64 encoded image or URL
  requiredStamps: number;
  isRedeemed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrizeInput {
  name: string;
  description: string;
  image?: string; // Made optional
  requiredStamps: number;
}

export interface PrizeUpdate {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  requiredStamps?: number;
  isRedeemed?: boolean;
}