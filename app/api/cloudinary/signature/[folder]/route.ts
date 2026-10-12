import { NextRequest, NextResponse } from "next/server";

import { getUploadSignature } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const url = request.nextUrl.pathname;
    console.log(url);
    const { signature, timestamp, folder } = await getUploadSignature(
      url.split("/").pop()!,
    );

    return NextResponse.json({
      signature,
      folder,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);
  }
}
