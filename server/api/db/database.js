const prisma = require("./prisma").prisma;

async function fetchUser({ id = null, githubId = null } = {}) {
  if (id)
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
        id: true,
      },
    });

  if (githubId)
    return await prisma.user.findUnique({
      where: {
        githubId,
      },
      select: {
        githubId: true,
        id: true,
      },
    });
}

async function fetchCredentials({ username }) {
  return await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      password: true,
      id: true,
    },
  });
}

async function createUser({
  githubId = null,
  username = null,
  password = null,
} = {}) {
  if (githubId)
    return await prisma.user.create({
      data: {
        githubId,
      },
      select: {
        githubId: true,
        id: true,
      },
    });

  if (username && password)
    return await prisma.user.create({
      data: {
        username,
        password,
      },
      select: {
        username: true,
        id: true,
      },
    });
}

async function fetchProfile() {
  return;
}

module.exports = { fetchCredentials, fetchUser, createUser };
