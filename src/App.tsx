import { Config } from '@core/Config';
import { useUser } from '@core/useUser';
import { supabase } from '@core/SupabaseClient';
import { DrawCanvas } from '@components/DrawCanvas'
import SupabaseLogin from '@components/SupabaseLogin';
import '@/App.css';

export default function App() {
  const user = useUser();

  const uploadFile = async (file: File) => {
    if (!user) {
      alert("User not authenticated");
      throw new Error("User not authenticated");
    }
    // Validate file type
    if (file.type !== "image/svg+xml") {
      alert("Only SVG files are allowed");
      throw new Error("Only SVG files are allowed");
    }
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(Config.BucketName)
      .upload(`${Config.UploadFolder}/${file.name}`, file, {
        contentType: "image/svg+xml",
        upsert: false,
      });
    if (error) {
      throw error;
    }
  };

  if (!user) {
    return <SupabaseLogin />
  }

  return (
    <DrawCanvas uploadFile={uploadFile} />
  )
}