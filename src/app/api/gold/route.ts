import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    // 后台url
    const url = process.env.BASE_URL as string;
    console.info("url:", url);
    const req = await axios.post(url, { type: "weibo" });
    const data = req.data;
    console.info(data?.data?.list);
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
      message: "error",
    });
  }
}
