import { MAX_RESULT_PER_PAGE } from "../utils/constants";
import supabase from "./supabase";

export async function getMenu({ filterObj, sortByObj, page }) {
  let query = supabase.from("restaurantMenu").select("*", { count: "exact" });

  //FILTERTING
  if (filterObj)
    query = query[filterObj.method || "eq"](filterObj.field, filterObj.value);
  //SORTING
  if (sortByObj) {
    query = query.order(sortByObj.field, {
      ascending: sortByObj.direction === "asc",
    });
    if (sortByObj.field === "name") {
      // If sorting by name, add secondary sorting to ensure consistent order
      query = query.order("id", { ascending: true });
    }
  }

  //PAGINATION
  if (page) {
    const from = (page - 1) * MAX_RESULT_PER_PAGE;
    const to = from + MAX_RESULT_PER_PAGE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error.message);
    throw new Error("Menu could not be uploaded");
  }

  return { data, count };
}

export async function deleteItem(id) {
  const { data, error } = await supabase
    .from("restaurantMenu")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error(error.message);
    throw new Error("Item could not be deleted");
  }

  return data;
}

export async function createUpdateItem({ id, newItemObj }) {
  let query = supabase.from("restaurantMenu");

  if (id) query = query.update(newItemObj).eq("id", id);
  if (!id) query = query.insert([newItemObj]);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error.message);
    throw new Error("item could not be added");
  }

  return data;
}

//////////////////////////////////////////
// RESTAURANT BILLS

export async function getBills(bookingId) {
  const { data, error } = await supabase
    .from("restaurantBills")
    .select("*")
    .eq("bookingId", bookingId);

  if (error) {
    console.error(error.message);
    throw new Error("Bills could not be loaded");
  }

  return data;
}

export async function createBill(billData) {
  const { data, error } = await supabase
    .from("restaurantBills")
    .insert([billData])
    .select()
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Bill could not be created");
  }

  return { data };
}

export async function updateBills({ bookingId, updatedData }) {
  const { data, error } = await supabase
    .from("restaurantBills")
    .update(updatedData)
    .eq("bookingId", bookingId)
    .select();

  if (error) {
    console.error(error.message);
    throw new Error("Bills could be updated");
  }

  return data;
}
