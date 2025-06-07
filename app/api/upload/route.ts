import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION_NAME!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});



export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json()

    const fileKey = `uploads/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: fileKey,
        ContentType: fileType,
    });

    try {
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });


        return NextResponse.json({
        presignedUrl,
        url: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME!}.s3.${process.env.NEXT_PUBLIC_S3_REGION_NAME!}.amazonaws.com/${fileKey}`,
        key: fileKey,
        })
    } catch (error) {
        console.error('Recording error:', error)
        return NextResponse.json({ error: 'Recording failed' }, { status: 500 })
    }
    
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
    }

    
}