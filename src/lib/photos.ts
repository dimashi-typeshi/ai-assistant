import { supabase } from './supabase';

export type UploadedPhoto = {
  name: string;
  path: string;
  url: string;
};

const bucket = 'user-photos';

export async function uploadSectionPhoto(file: File, section: string): Promise<UploadedPhoto> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  const userId = userData.user?.id;
  if (!userId) throw new Error('Сначала войди в аккаунт, чтобы загрузить фото.');

  const extension = file.name.split('.').pop() ?? 'jpg';
  const safeSection = section.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const path = `${userId}/${safeSection}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { name: file.name, path, url: data.publicUrl };
}

export function readPhotoAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Не получилось прочитать фото.'));
    };
    reader.onerror = () => reject(new Error('Не получилось прочитать фото.'));
    reader.readAsDataURL(file);
  });
}

export function splitDataUrl(dataUrl: string) {
  const [meta, data] = dataUrl.split(',');
  const mimeType = meta.match(/^data:(.*);base64$/)?.[1] ?? 'image/jpeg';
  return { data, mimeType };
}
