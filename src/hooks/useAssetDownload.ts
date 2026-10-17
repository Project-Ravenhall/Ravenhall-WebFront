import { useState } from "react";

export default function useAssetDownload(assetId: string) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);

  const downloadAsset = async () => {
    try {
      setStatus('downloading');
      setProgress(0);

      const opfsRoot = await navigator.storage.getDirectory();
      const directoryHandle = await opfsRoot.getDirectoryHandle("Book folder", { create: true });
      const fileHandle = await directoryHandle.getFileHandle(`asset_${assetId}.pdf`, { create: true });

      const writable = await fileHandle.createWritable();

      const token = localStorage.getItem('token');
      
      const fileResponse = await fetch(`${import.meta.env.VITE_API_URL}/books/assets/${assetId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch asset: ${fileResponse.statusText}`);
      }

      const reader = fileResponse.body?.getReader();
      const totalSize: string = fileResponse.headers.get('Content-Length') || '0';
      let currentDownloadSize = 0;

      await reader?.read().then(async function process({ done, value }): Promise<any> {
        if (done) {
          await writable.close();
          return;
        }
        if (value) {
          await writable.write(value);
          currentDownloadSize += value.length;
          if (Number(totalSize) > 0) {
            const progress = (currentDownloadSize / Number(totalSize)) * 100;
            setProgress(progress);
          }
        }
        return reader?.read().then(process);
      });

      setStatus('done');

    } catch (error) {
      console.error("Error downloading asset:", error);
      setStatus('failed');
    }
  };

  return { status, progress, downloadAsset };
}
