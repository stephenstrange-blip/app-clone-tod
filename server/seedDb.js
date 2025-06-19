const bcrypt = require("bcrypt");
const {
  addUser,
  addProfile,
  addCategory,
  addReacts,
} = require("./api/db/database");

const initDbValues = async () => {
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

  console.log("Creating admin user...");
  const _admin = await addUser(admin);

  console.log("Creating admin profile...");
  await addProfile({
    ...adminProfile,
    userId: _admin.id,
  });

  console.log("Creating default category");
  await addCategory(category);

  console.log("Creating default reacts");
  await addReacts({
    data: [{ name: reactions.like }, { name: reactions.heart }],
  });

  return "Finished seeding database...";
};

initDbValues()
  .then((resolve) => console.log(resolve))
  .catch((err) => console.error(err));
