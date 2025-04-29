import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "../../../../lib/cloudinary";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: "No file provided" });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "asso_stock",
    });

    // Ici tu peux envoyer l'URL vers ta DB
    console.log(result.secure_url);

    return NextResponse.json(
      { success: true, url: result.secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}


function extractPublicId(url: string) {
  const matches = url.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return matches ? matches[1] : '';
}
export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    const public_id = extractPublicId(imageUrl);
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Chemin invalide." },
        { status: 400 }
      );
    }
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== "ok") {
      return NextResponse.json(
        { success: false, message: "Failed to delete image" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
