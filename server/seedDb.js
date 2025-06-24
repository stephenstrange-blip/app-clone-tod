const bcrypt = require("bcrypt");
const {
  addUser,
  addProfile,
  addCategory,
  addReacts,
  fetchUser,
  getCategory,
  getProfile,
  getReacts,
} = require("./api/db/database");

const initDbValues = async () => {
  let _admin;

  const password = await bcrypt.hash("Admin", 10);
  const adminProfile = {
    firstName: "Admin",
    lastName: "Admin",
    bio: "Admin",
    title: "Admin",
  };

  const admin = {
    username: "Admin",
    password: password,
  };

  const category = {
    name: "Generic",
  };

  const reactions = {
    like: "like",
    heart: "heart",
  };

  const seedAdmin = fetchUser({ id: 1 });
  const seedCategory = getCategory({ id: 1 });
  const seedProfile = getProfile({ userId: 1 });
  const seedReacts = getReacts();

  const [_seedAdmin, _seedCategory, _seedProfile, _seedReacts] =
    await Promise.all([seedAdmin, seedCategory, seedProfile, seedReacts]);

  console.log("Creating admin user...");
  if (!_seedAdmin) _admin = await addUser(admin);

  console.log("Creating admin profile...");
  if (!_seedProfile)
    await addProfile({
      ...adminProfile,
      userId: _admin.id,
    });

  console.log("Creating default category");
  if (!_seedCategory) await addCategory(category);

  console.log("Creating default reacts");
  if (_seedReacts && _seedReacts.length === 1)
    if (_seedReacts[0].name === reactions.like)
      // Add heart reaction if like is present
      await addReacts({ name: reactions.heart });
    else
      // Otherwise, add like reaction
      await addReacts({ name: reactions.like });

  if (!_seedReacts)
    await addReacts({
      data: [{ name: reactions.like }, { name: reactions.heart }],
    });

  return "Finished seeding database...";
};

initDbValues()
  .then((resolve) => console.log(resolve))
  .catch((err) => console.error(err));
