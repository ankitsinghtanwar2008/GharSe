import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      order: body,
      message: 'Order created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Order creation failed'
      },
      { status: 500 }
    );
  }
}