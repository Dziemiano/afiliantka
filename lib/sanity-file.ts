import { client } from "../sanity/lib/client";

export function getFileUrl(fileRef: string): string | null {
  if (!fileRef) return null;

  try {
    // Extract file ID from reference like 'file-09ad2cecbac53e61755adfea09da343393751936-pdf'
    const fileId = fileRef.replace("file-", "").replace("-pdf", "");
    return `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${fileId}.pdf`;
  } catch (error) {
    console.error("Error generating file URL:", error);
    return null;
  }
}
