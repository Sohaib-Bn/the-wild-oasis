import { MAX_RESULT_PER_PAGE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase, { supabaseAuth } from "./supabase";

export async function getBookings(filter, sort, page) {
  let query = supabase
    .from("bookings")
    .select("*, guests(fullName, email), cabins(name)", { count: "exact" });

  // FILTERING

  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // SORTING

  if (sort)
    query = query.order(sort.field, {
      ascending: sort.direction === "asc",
    });

  // PAGINATION
  if (page) {
    const from = (page - 1) * MAX_RESULT_PER_PAGE;
    const to = from + MAX_RESULT_PER_PAGE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error.message);
    throw new Error("Bookings could not be uploaded");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice, status")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return bookings;
}

export async function updateBooking(id, newBookingData) {
  const { data: booking, error } = await supabase
    .from("bookings")
    .update(newBookingData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Booking could not be updated");
  }

  console.log(booking);

  if (booking.source === "user") {
    const { error: error1 } = await supabaseAuth
      .from("bookings")
      .update({ status: newBookingData.status })
      .eq("guestId", booking.guestId)
      .select()
      .single();

    if (error1) {
      console.error(error1.message);
      await supabase.from("bookings").delete().eq("id", id);
      throw new Error("Booking could not be updated");
    }
  }

  return booking;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function createBooking(bookingData) {
  // 1. PREPARING DATA
  const {
    fullName,
    email,
    nationalID,
    nationality,

    numNights,
    numGuests,
    observations,
    startDate,
    endDate,
    cabinPrice,
    cabinId,
    totalPrice,
    extrasPrice,
    status,
    isPaid,
    hasBreakfast,
  } = bookingData;

  // 2. CREATE COUNTRY FLAG

  const res = await fetch(`https://restcountries.com/v3.1/name/${nationality}`);

  if (!res.ok) throw new Error("Nationality is invalid");

  const countryData = await res.json();

  // 3. CREATE NEW GUEST

  const { data: guestData, error: guestsError } = await supabase
    .from("guests")
    .insert([
      {
        fullName,
        email,
        nationalID,
        nationality,
        countryFlag: countryData[0].flags.svg,
      },
    ])
    .select()
    .single();

  if (guestsError) throw new Error("Booking could not be created ");

  // 4. CREATE NEW BOOKING

  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        numGuests,
        numNights,
        cabinPrice,
        totalPrice,
        status,
        isPaid,
        hasBreakfast,
        cabinId,
        guestId: guestData.id,
        extrasPrice,
        observations,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Booking could not be created ");
  }

  return data;
}
