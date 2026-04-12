import { Config } from '@core/Config';
import { useUser } from '@core/useUser';
import { supabase } from '@core/SupabaseClient';
import { DrawCanvas } from '@components/DrawCanvas'
import SupabaseLogin from '@components/SupabaseLogin';
import '@/App.css';

export interface UploadResponse {
  ok: boolean,
  error?: string,
}

export default function App() {
  const user = useUser();

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    if (!user) {
      return { ok: false, error: "User not authenticated" };
    }
    if (file.type !== "image/svg+xml") {
      return { ok: false, error: "Only SVG files are allowed" };
    }
    const { error } = await supabase.storage
      .from(Config.BucketName)
      .upload(`${Config.UploadFolder}/${file.name}`, file, {
        contentType: "image/svg+xml",
        upsert: false,
      });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  };

  if (!user) {
    return <SupabaseLogin />
  }

  return (
    <DrawCanvas uploadFile={uploadFile} />
  )
}