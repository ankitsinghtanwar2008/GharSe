import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Temporary response
    // Baad me MongoDB se orders fetch karenge
    return NextResponse.json({
      success: true,
      orders: [],
      message: 'Orders route working'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch orders'
      },
      { status: 500 }
    );
  }
}