import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadStreamCloudinary = (
  buffer: Buffer,
  folder: string,
  resource_type: "image" | "video",
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `social/${folder}`, resource_type: resource_type },
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            if (!result) {
              reject("Cloudinary Upload Failed");
              return;
            }
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          },
        )
        .end(buffer);
    },
  );
};

export const removeCloudinary = async (
  public_id: string,
  resource_type: "image" | "video",
) => {
  return await cloudinary.uploader.destroy(public_id, {
    resource_type: resource_type,
  });
};

export async function getUploadSignatureFeed() {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "social/feeds";

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: folder,
    },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return { signature, timestamp, folder };
}

export async function getUploadSignatureStory() {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "social/stories";

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: folder,
    },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return { signature, timestamp, folder };
}
