import { NextResponse } from "next/server";

import { getUploadSignature } from "@/lib/cloudinary";

export async function POST() {
  try {
    const { signature, timestamp, folder } = await getUploadSignature();

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
