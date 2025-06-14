import apiClient from "./client";

const URL = {
  TOKENLESS: ["auth/local", "signup", "auth/github", "auth/github/local"],
};

const RETRY_STATUS_CODES = [408, 429];

apiClient.interceptors.request.use(
  (config) => {
    // // for retries
    config.retry = config.retry ?? 0;

    // Skip token attachment for public/tokenless routes
    if (URL.TOKENLESS.includes(config.url)) return config;

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found!");

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error(
      "Something happened in setting up the request that triggered an Error"
    );
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    let message;
    console.log(error)
    if (error.message === "canceled")
      return Promise.resolve(
        "Canceled Request due likely to mounting and unmounting in react development"
      );

    const config = error.config;

    if (isValidForRetry(config, error.status)) {
      
      const retry_delay = Math.pow(2, config.retry) * 1000;

      config.retry += 1;
      console.log('Retrying request: ', config.retry)
      await new Promise((resolve) => setTimeout(resolve, retry_delay));
      return apiClient(config);
    }

    if (error.response) {
      console.error("Api Failed:", error.response?.data?.stack);
      message = error.response?.data?.message;
    } else {
      console.error("Api Failed:", error);
      message = error.message;
    }

    return Promise.reject(message);
  }
);

function isValidForRetry(config, status) {
  return (
    config.retry < 4 &&
    config.method !== "post" &&
    (status >= 500 || RETRY_STATUS_CODES.includes(status))
  );
}

export const signup = async (input) => {
  return apiClient.post("signup", input, {
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const login = async (input) => {
  return apiClient.post("auth/local", input, {
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const createRequest = async (input) => {
  return apiClient.post("users/request", input, {
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const createNetwork = async (input) => {
  return apiClient.post("users/network", input, {
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const createPost = async (input) => {
  console.dir(input);
  return apiClient.post("users/posts", input, {
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const createReaction = async (input) => {
  return apiClient.post("users/reaction", input, {
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const createComment = async (input) => {
  return apiClient.post(
    `users/posts/${input.postId}`,
    { message: input.message },
    { signal: AbortSignal.timeout(8000), timeout: 5000 }
  );
};

export const createReply = async (input) => {
  return apiClient.post(
    `users/posts/${input.postId}/comments/${input.commentId}`,
    { message: input.message },
    { signal: AbortSignal.timeout(8000), timeout: 5000 }
  );
};

export const loadProfile = async () => {
  return apiClient.get("users/profile", {
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const loadRequest = async (input) => {
  return apiClient.get("users/request", {
    params: input,
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const loadNetwork = async (input) => {
  return apiClient.get("users/network", {
    params: input,
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const loadManyPost = async (input) => {
  return apiClient.get("users/posts", {
    params: input,
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const loadPost = async (postId) => {
  return apiClient.get(`users/posts/${postId}`, {
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const loadComment = async (input) => {
  return apiClient.get(
    `users/posts/${input.postId}/comments/${input.commentId}`,
    {
      params: {
        getReplies: input.getReplies,
        signal: AbortSignal.timeout(8000),
        timeout: 5000,
      },
    }
  );
};

export const removeRequest = async (input) => {
  return apiClient.delete("users/request", {
    params: input,
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const removeReaction = async (input) => {
  return apiClient.delete("users/reaction", {
    params: input,
    signal: AbortSignal.timeout(8000),
    timeout: 5000,
  });
};

export const removeComment = async (input) => {
  return apiClient.delete(
    `users/posts/${input.postId}/comments/${input.commentId}`,
    { signal: AbortSignal.timeout(8000), timeout: 5000 }
  );
};
