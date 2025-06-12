import React from 'react';
import supabase from '../config/supabase';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const uploadImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('images') // 🔁 Replace with your bucket name
    .upload(filePath, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

const saveImageMetadata = async (url) => {
  await addDoc(collection(db, 'images'), {
    url,
    uploadedAt: new Date()
  });
};

export default function ImageUploader() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      await saveImageMetadata(imageUrl);
      alert('✅ Uploaded and saved!');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}
