import { supabase } from "@/lib/supabase";

export async function uploadFile(
  bucket: string,
  path: string,
  file: { uri: string; type: string }
) {
  const response = await fetch(file.uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { contentType: file.type, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(userId: string, file: { uri: string; type: string }) {
  const ext = file.uri.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;
  return uploadFile("avatars", path, file);
}

export async function uploadPetPhoto(petId: string, file: { uri: string; type: string }, index: number) {
  const ext = file.uri.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${petId}/photo_${index}.${ext}`;
  return uploadFile("pet-photos", path, file);
}

export async function uploadVideo(userId: string, file: { uri: string; type: string }) {
  const ext = file.uri.split(".").pop()?.toLowerCase() ?? "mp4";
  const path = `${userId}/${Date.now()}.${ext}`;
  return uploadFile("videos", path, file);
}
