import supabase from "./supabase.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const uploadFileToSupabase = async (file, folder = "projects") => {
  const fileBuffer = fs.readFileSync(file.path);
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from("portfolioimages") // bucket name
    .upload(filePath, fileBuffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("portfolioimages") // bucket name
    .getPublicUrl(filePath);
  return data.publicUrl;
};
