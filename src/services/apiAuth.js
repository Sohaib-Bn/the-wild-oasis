import supabase, { supabaseAdminAuthClient, supabaseUrl } from "./supabase";

export async function loginUser({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function singupUser({
  email,
  password,
  fullname,
  role,
  created_with,
}) {
  let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        fullname: fullname,
        role: role,
        created_with: created_with,
        avatar: "",
      },
    },
  });

  if (error) {
    console.error(error.message);
    throw new Error("There was a problem while signing up. Try again");
  }

  return data;
}

export async function getCurrentUser() {
  // CHECK IF THERE IS AN ACTIVE SESSION
  const { data: session } = await supabase.auth.getSession();

  // IF THERE IS'T AN ACTIVE SESSION RETURN NULL
  if (!session.session) return null;

  // IF THERE IS AN ACTIVE SESSION NOW AND ONLY NOW FETCH CURRENT USER FROM SUPABASE
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function updateUser({ fullname, avatar, password, role }) {
  // 1. UPDATE USER FULLNAME AND ROLE (ONLY ADMINS) OR PASSWORD
  let updatedField;

  if (fullname || role)
    updatedField = {
      data: {
        fullname: fullname,
        role: role,
      },
    };

  if (password) updatedField = { password: password };

  const { data, error: error1 } = await supabase.auth.updateUser(updatedField);

  if (error1) throw new Error(error1.message);

  if (!avatar) return data;

  // 2. UPLOAD AVATAR
  const avatarName = `${Math.random()}-${data.user.id}-avatar`;

  const { error: error2 } = await supabase.storage
    .from("avatars")
    .upload(avatarName, avatar);

  if (error2) throw new Error(error2.message);

  // 3. UPDATE USER AVATAR
  const avatarPath = `${supabaseUrl}/storage/v1/object/public/avatars/${avatarName}`;

  const { data: updatedUser, error3 } = await supabase.auth.updateUser({
    data: {
      avatar: avatarPath,
    },
  });

  if (error3) throw new Error(error3.message);

  return updatedUser;
}

/////////////////////////////////////////////////////////////
// WARNING: DON'T USED THIS IN REAL WORD
// INSTED THAT CODE SHOULD BE IN SERVER SIDE

export async function getAllUsers() {
  const {
    data: { users },
    error,
  } = await supabaseAdminAuthClient.listUsers();

  if (error) throw new Error("Users could not be loaded");

  return users;
}

export async function deleteUser(id) {
  const { data, error } = await supabaseAdminAuthClient.deleteUser(id);

  if (error) throw new Error("User could not be deleted");

  return data;
}

export async function updateUserById({ id, data }) {
  let updatedField;
  const { role } = data;

  if (role)
    updatedField = {
      user_metadata: {
        role: role,
      },
    };

  const { data: user, error } = await supabase.auth.admin.updateUserById(
    id,
    updatedField
  );

  if (error) throw new Error("User could not be updated");

  return user;
}
