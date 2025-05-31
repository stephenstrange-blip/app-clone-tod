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

async function addUser({
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
  // do not update userId, its for filter only
  const { userId, ...otherOpts } = opts;
  return await prisma.profile.update({
    where: {
      userId,
    },
    data: otherOpts,
  });
}

async function addPost(opts) {
  return await prisma.post.create({
    data: opts,
    select: {
      id: true,
      createdAt: true,
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

async function putPost(opts) {
  const { postId, ...otherOpts } = opts;
  return await prisma.post.update({
    where: {
      id: postId,
    },
    data: otherOpts,
    omit: {
      createdAt: true,
    },
  });
}

async function getPost({ postId }) {
  return await prisma.post.findUnique({
    where: {
      id: postId,
    },
    // TODO: Add reaction support for comments
    // Currently, only posts can have reactions
    select: {
      id: true,
      title: true,
      message: true,
      updatedAt: true,
      published: true,
      comments: {
        select: {
          id: true,
          depth: true,
          updatedAt: true,
          message: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}

async function deletePost({ postId }) {
  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
}

module.exports = {
  fetchCredentials,
  fetchUser,
  fetchProfile,
  getPost,
  addUser,
  addPost,
  addProfile,
  putProfile,
  putPost,
  deletePost,
};
