import { NextRequest, NextResponse } from 'next/server';
import { prizeStorage } from '@/lib/storage';
import { PrizeUpdate } from '@/types/prize';

// GET /api/prizes/[id] - Get specific prize
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prize = await prizeStorage.getById(id);
    
    if (!prize) {
      return NextResponse.json(
        { error: 'Prize not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prize);
  } catch (error) {
    console.error('Error fetching prize:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prize' },
      { status: 500 }
    );
  }
}

// PATCH /api/prizes/[id] - Update specific prize
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: PrizeUpdate = {
      id,
      ...body
    };

    const updatedPrize = await prizeStorage.update(updateData);
    
    if (!updatedPrize) {
      return NextResponse.json(
        { error: 'Prize not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPrize);
  } catch (error) {
    console.error('Error updating prize:', error);
    return NextResponse.json(
      { error: 'Failed to update prize' },
      { status: 500 }
    );
  }
}

// DELETE /api/prizes/[id] - Delete specific prize
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await prizeStorage.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Prize not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Prize deleted successfully' });
  } catch (error) {
    console.error('Error deleting prize:', error);
    return NextResponse.json(
      { error: 'Failed to delete prize' },
      { status: 500 }
    );
  }
}