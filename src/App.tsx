import { Config } from '@core/Config';
import { useUser } from '@core/useUser';
import { supabase } from '@core/SupabaseClient';
import { DrawCanvas } from '@components/DrawCanvas'
import SupabaseLogin from '@components/SupabaseLogin';
import '@/App.css'

export type UploadResult = {
  path: string;
  url: string;
};

type UploadFn = (file: File) => Promise<UploadResult>;

export default function App() {
  const user = useUser();

  const uploadFile: UploadFn = async (file: File) => {
    // Ensure user is logged in
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
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
    const { data, error } = await supabase.storage
      .from(Config.BucketName)
      .upload(file.name, file, {
        contentType: "image/svg+xml",
        upsert: false,
      });
    if (error) {
      throw error;
    }
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(file.name);
    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  };

  if (!user) {
    return <SupabaseLogin />
  }

  return (
    <DrawCanvas uploadFile={uploadFile} />
  )
}