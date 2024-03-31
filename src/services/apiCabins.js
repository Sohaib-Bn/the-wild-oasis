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
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${newCabin.location}&format=json&limit=1`
  );
  if (!res.ok) throw new Error("Nationality is invalid");

  const locationData = await res.json();

  const lat = locationData[0].lat;
  const lon = locationData[0].lon;

  const locationCoordinates = `(${lat},${lon})`;

  console.log(newCabin, locationCoordinates);

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

  if (!id)
    query = query.insert([
      {
        ...newCabin,
        image: imagePath,
        coordinates: locationCoordinates,
      },
    ]);

  // B. Update CABIN
  if (id)
    query = query
      .update({
        ...newCabin,
        image: imagePath,
        coordinates: locationCoordinates,
      })
      .eq("id", id);

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
