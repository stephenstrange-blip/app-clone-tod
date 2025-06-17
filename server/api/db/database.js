const prisma = require("./prisma").prisma;

const SELECT = {
  GITHUB: {
    githubId: true,
    id: true,
  },
  LOCAL: {
    username: true,
    id: true,
  },
  PROFILE: {
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
};

const FILTER = {
  BY_START_DATE: (date) => {
    return {
      createdAt: {
        gte: date,
      },
    };
  },
};

async function fetchUser(opts) {
  return await prisma.user.findUnique({
    where: opts,
    select: opts.githubId ? SELECT.GITHUB : SELECT.LOCAL,
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
      select: SELECT.GITHUB,
    });

  if (username && password)
    return await prisma.user.create({
      data: {
        username,
        password,
      },
      select: SELECT.LOCAL,
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

async function getProfile({ userId }) {
  return await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: SELECT.PROFILE,
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
    select: SELECT.PROFILE,
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
  });
}

async function getManyPosts(opts, reactorId) {
  return await prisma.post.findMany({
    where: opts,
    select: {
      id: true,
      title: true,
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      reactions: {
        where: {
          reactorId,
        },
        select: {
          reactorId: true,
          reactId: true,
          id: true,
        },
      },
      // message: true,
      updatedAt: true,
      _count: {
        select: {
          comments: {
            where: {
              isDeleted: false,
            },
          },
          reactions: true,
        },
      },
    },
  });
}

async function getPost({ postId, reactorId }) {
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
      author: {
        select: {
          lastName: true,
          firstName: true,
        },
      },
      reactions: {
        where: {
          reactorId,
        },
        select: {
          reactorId: true,
          reactId: true,
          id: true,
        },
      },
      comments: {
        where: {
          AND: [{ isDeleted: false }, { depth: 1 }],
        },
        select: {
          id: true,
          depth: true,
          updatedAt: true,
          numchild: true,
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

async function deleteManyPost(filter) {
  return await prisma.post.deleteMany({
    where: filter,
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

async function addReaction({ postId, reactId, reactorId }) {
  return await prisma.reactions.create({
    data: {
      reactId,
      reactorId,
      postId,
    },
  });
}

async function deleteReaction({ id_react }) {
  return await prisma.reactions.delete({
    where: {
      id: id_react,
    },
  });
}

// for top comments to a post
async function addComment({ message, postId, authorId, createdAt }) {
  return await prisma.comment.createRoot({
    data: {
      message,
      postId,
      authorId,
      createdAt,
    },
  });
}

async function addReply({ message, commentId, authorId, postId }) {
  return await prisma.comment.createChild({
    where: {
      id: commentId,
    },
    data: {
      message,
      authorId,
      postId,
      ignoreColumn: {
        createdAt: true,
      },
    },
  });
}

async function getReply({ commentId }) {
  return await prisma.comment.findChildren({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      isDeleted: true,
      numchild: true,
      message: true,
      updatedAt: true,
      depth: true,
      author: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

async function getComment({ commentId }) {
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      depth: true,
      numchild: true,
      isDeleted: true,
      message: true,
      updatedAt: true,
      postId: true,
    },
  });
}

// does not delete a comment, only marks it deleted
async function deleteComment({ id, isDeleted }) {
  return await prisma.comment.update({
    where: {
      id,
    },
    data: {
      isDeleted,
    },
  });
}

// this is for actual item(s) removal from db
async function deleteManyComment({ date }) {
  if (!date) return;
  return await prisma.comment.deleteMany({
    where: FILTER.BY_START_DATE(date),
  });
}

module.exports = {
  fetchCredentials,
  fetchUser,
  getProfile,
  getRequest,
  getPost,
  getNetwork,
  getManyPosts,
  getComment,
  getReply,
  addUser,
  addPost,
  addProfile,
  addRequest,
  addNetwork,
  addReaction,
  addComment,
  addReply,
  putProfile,
  putPost,
  deletePost,
  deleteNetwork,
  deleteRequest,
  deleteReaction,
  deleteUser,
  deleteManyPost,
  deleteComment,
  deleteManyComment,
  updateUser,
};
