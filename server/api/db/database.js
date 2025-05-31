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

async function fetchProfile({ userId }) {
  return await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: {
      firstName: true,
      lastName: true,
      bio: true,
      title: true,
      userId: true,
      _count: {
        select: {
          followers: true,
          following: true,
          requests: true,
          comments: true,
          reaction: true,
        },
      },
    },
  });
  return;
}

async function addProfile(opts) {
  return await prisma.profile.create({
    data: opts,
  });
}

async function putProfile(opts) {
  return await prisma.profile.update({
    where: {
      userId: opts.userId,
    },
    data: opts,
  });
}

module.exports = {
  fetchCredentials,
  fetchUser,
  createUser,
  fetchProfile,
  addProfile,
  putProfile,
};
