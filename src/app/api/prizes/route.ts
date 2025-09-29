import { NextRequest, NextResponse } from 'next/server';
import { prizeStorage } from '@/lib/storage';
import { PrizeInput } from '@/types/prize';

// GET /api/prizes - Get all prizes
export async function GET() {
  try {
    const prizes = await prizeStorage.getAll();
    return NextResponse.json(prizes);
  } catch (error) {
    console.error('Error fetching prizes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prizes' },
      { status: 500 }
    );
  }
}

// POST /api/prizes - Create new prize
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image, requiredStamps }: PrizeInput = body;

    // Validation
    if (!name || !description || !requiredStamps) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use placeholder image if none provided
    const prizeImage = image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEYzOUZGIi8+CjxwYXRoIGQ9Im0xNjAgMTMwIDQwIDM0LTQwIDM0IDE2IDEwIDI0LTM0IDI0IDM0IDE2LTEwem0wLTI0IDQ4IDQwIDQ4LTQwLTQ4LTQwLTQ4IDQweiIgZmlsbD0iI0ZGRiIvPgo8dGV4dCB4PSIyMDAiIHk9IjIwMCIgZmlsbD0iI0ZGRiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlByaXplIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';

    if (requiredStamps < 1 || requiredStamps > 100) {
      return NextResponse.json(
        { error: 'Required stamps must be between 1 and 100' },
        { status: 400 }
      );
    }

    const newPrize = await prizeStorage.create({
      name,
      description,
      image: prizeImage,
      requiredStamps: Number(requiredStamps)
    });

    return NextResponse.json(newPrize, { status: 201 });
  } catch (error) {
    console.error('Error creating prize:', error);
    return NextResponse.json(
      { error: 'Failed to create prize' },
      { status: 500 }
    );
  }
}