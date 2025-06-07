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

async function deleteUser({ id }) {
  return await prisma.user.delete({
    where: {
      id,
    },
    select: {
      profile: {
        select: {
          firstName: true,
          lastName: true,
          bio: true,
          title: true,
        },
      },
    },
  });
}

async function updateUser({ id, password }) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      password,
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

// requester is the user currently logged in
// and target is user being requested to follow
async function addRequest({ targetId, requesterId }) {
  return await prisma.followRequest.create({
    data: {
      targetId,
      requesterId,
    },
  });
}

async function getRequest(opts, selectFields) {
  return await prisma.followRequest.findMany({
    where: opts,
    select: selectFields || {
      targetId: true, // currently logged in user's id
      requester: {
        select: {
          firstName: true,
          lastName: true,
          userId: true,
        },
      },
    },
  });
}

async function deleteRequest({ targetId, requesterId }) {
  return await prisma.followRequest.delete({
    where: {
      requestId: {
        requesterId,
        targetId,
      },
    },
  });
}

async function addNetwork({ followingId, followerId }) {
  return await prisma.userNetwork.create({
    data: {
      followingId,
      followerId,
    },
    select: {
      assignedAt: true,
    },
  });
}

async function getNetwork(opts, selectFields) {
  return await prisma.userNetwork.findMany({
    where: opts,
    select: selectFields || {
      follower: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

async function deleteNetwork({ followingId, followerId }) {
  return await prisma.userNetwork.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
}

module.exports = {
  fetchCredentials,
  fetchUser,
  fetchProfile,
  getRequest,
  getPost,
  getNetwork,
  addUser,
  addPost,
  addProfile,
  addRequest,
  addNetwork,
  putProfile,
  putPost,
  deletePost,
  deleteNetwork,
  deleteRequest,
  deleteUser,
  updateUser,
};
