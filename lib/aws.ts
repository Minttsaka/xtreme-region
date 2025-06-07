// types
export type UploadResult = {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
};

export async function uploadFileTos3(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    // Step 1: Get a presigned URL from your backend
    const presignedData = await getPresignedUrl(file.name, file.type);

    if (!presignedData?.presignedUrl) {
      return { success: false, error: "Failed to get upload URL" };
    }

    // Step 2: Upload the file directly to S3
    const xhr = new XMLHttpRequest();

    const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
      xhr.open("PUT", presignedData.presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve({
            success: true,
            url: presignedData.url,
            key: presignedData.key,
          });
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Upload failed due to network error"));
      };

      xhr.send(file);
    });

    return await uploadPromise;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during upload",
    };
  }
}
async function getPresignedUrl(
  fileName: string,
  fileType: string
): Promise<{ presignedUrl: string; key: string; url: string } | null> {
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, fileType }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get presigned URL");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    return null;
  }
}