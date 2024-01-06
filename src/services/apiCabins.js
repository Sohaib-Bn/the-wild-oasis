import supabase, { supabaseUrl } from "./supabase";

//////////////////////////////////////
// GET CABIN

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

//////////////////////////////////////
// DELETE CABIN

export async function deleteCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cobin could not be deleted");
  }

  return data;
}

//////////////////////////////////////
// CREATE/Updated CABIN

export async function createUpdateCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. CREATE/Update CABIN

  let query = supabase.from("cabins");

  // A. CRATE CABIN

  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B. Update CABIN

  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error.message);
    throw new Error(`Cobin could not be ${id ? "Updated" : "Created"}`);
  }

  if (hasImagePath) return data;

  // 2. UPLOAD EMAGE IN CASE THE NEW IMAGE

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. DELETE COBIN IF THERE WAS ERROR WITH UPLAODING THE IMGAGE

  if (storageError) {
    const { error: deleteError } = await supabase
      .from("cabins")
      .delete()
      .eq("id", newCabin.id);

    if (deleteError) {
      console.error(deleteError);
      throw new Error(
        "Cabin image could not be uploaded and the cabin could not be created"
      );
    }
  }

  return data;
}

// export async function createUpdatedCabin(newCabin, id) {
//   const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

//   const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
//     "/",
//     ""
//   );
//   const imagePath = hasImagePath
//     ? newCabin.image
//     : `${supabaseUrl}/storage/v1/object/public/cabins-image/${imageName}`;

//   // 1. Create/Updated cabin
//   let query = supabase.from("cabins");

//   // A) CREATE
//   if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

//   // B) Updated
//   if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

//   const { data, error } = await query.select().single();

//   if (error) {
//     console.error(error);
//     throw new Error("Cabin could not be created");
//   }

//   // 2. Upload image
//   if (hasImagePath) return data;

//   const { error: storageError } = await supabase.storage
//     .from("cabins-image")
//     .upload(imageName, newCabin.image);

//   // 3. Delete the cabin IF there was an error while uplaoding image
//   if (storageError) {
//     await supabase.from("cabins").delete().eq("id", data.id);
//     console.error(storageError);
//     throw new Error(
//       "Cabin image could not be uploaded and the cabin was not created"
//     );
//   }

//   return data;
// }
