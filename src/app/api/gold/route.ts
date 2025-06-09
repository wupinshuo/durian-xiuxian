import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 后台url
    const url = process.env.BASE_URL as string;
    console.info("url:", url);
    const response = await fetch(url);
    const data = await response.json();
    console.info(data?.data);
    return NextResponse.json({
      status: 200,
      data: data?.data,
      message: "success",
    });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json({
      status: 500,
      data: "error",
      message: "error" + error,
    });
  }
}
