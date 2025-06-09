import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // const { searchParams } = new URL(request.url);
    return NextResponse.json({
      status: 200,
      data: "hello",
      message: "Hello, world!",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      data: "error",
      message: "Hello, world!",
    });
  }
}
