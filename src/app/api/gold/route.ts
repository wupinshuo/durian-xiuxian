import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    // const { searchParams } = new URL(request.url);
    // 后台url
    const url = process.env.BASE_URL + "/gold-price";
    console.info("url:", url);
    const req = await axios.get(url);
    const data = req.data;
    console.info("data:", data);
    console.info("list:", data?.data);
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
      message: "Hello, world!",
    });
  }
}
