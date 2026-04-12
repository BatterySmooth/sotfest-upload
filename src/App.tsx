import { useState } from 'react';
import { useGoogleLogin, type TokenResponse } from '@react-oauth/google';
import { Config } from './core/Config';
import { DrawCanvas } from '@components/DrawCanvas'
import { LoginButton } from '@components/LoginButton';
import '@/App.css'

export type UploadResult = {
  id: string;
  name: string;
};

type UploadFn = (file: File) => Promise<UploadResult>;

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.file',
    onSuccess: async (tokenResponse: TokenResponse) => {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      const expiry = Date.now() + tokenResponse.expires_in * 1000;
      setTokenExpiry(expiry);
    },
  });

  const uploadFile: UploadFn = async (file: File) => {
    if (!accessToken || !tokenExpiry || Date.now() > tokenExpiry) {
      login();
    }
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [Config.UploadFolderId],
    };
    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      })
    );
    form.append('file', file);
    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      console.error(errorText);
      throw new Error('Upload failed');
    }

    const data: { id: string; name: string } = await res.json();
    await setPublicPermission(data.id);
    return data;
  };

  const setPublicPermission = async (fileId: string) => {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      }
    );
    if (!res.ok) {
      throw new Error(await res.text());
    }
  };

  
  return (
    <>
    {!accessToken
      ? (
        <LoginButton onClick={login} />
      )
      : (
        <DrawCanvas uploadFile={uploadFile} />
      )
    }
    </>
  )
}