export function formatDate(date_obj) {
  let date = Date.parse(date_obj);
  date = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    year: "numeric",
    hour12: true,
    hour: "2-digit",
    minute: "numeric",
    day: "2-digit",
  }).format(date);

  return date;
}

export function showBtns(e) {
  e.currentTarget.nextElementSibling.style["display"] = "revert";
}

export function hideBtns(e) {
  e.preventDefault();
  e.currentTarget.parentElement.previousElementSibling.value = "";
  return (e.currentTarget.parentElement.style["display"] = "none");
}

export const acceptRequest = async (e) => {
  let li = e.currentTarget.parentElement;
  let input = {
    targetId: li.dataset.targetid,
    requesterId: li.dataset.requesterid,
  };

  const response = removeRequest(input);
  const result = createNetwork({ followerId: input.requesterId });
  const [_response, _result] = await Promise.allSettled([response, result]);

  console.log(_response, _result);
  return setTimeout(() => window.location.reload(), 500);
};

export const rejectRequest = async (e) => {
  let li = e.currentTarget.parentElement;
  let input = {
    targetId: li.dataset.targetid,
    requesterId: li.dataset.requesterid,
  };

  const response = removeRequest(input);
  const _response = await Promise.allSettled([response]);
  console.log(_response);

  return setTimeout(() => window.location.reload(), 1500);
};

export const REGEX = {
  POSTID: new RegExp(/^[0-9]+$/),
};
export const FULFILLED = ["fulfilled", 200];

export const PROFILE_KEYS = ["firstName", "lastName", "title", "bio"];

const RETRY_STATUS_CODES = [408, 429];

export function isValidForRetry(config, status) {
  return (
    config.retry < 4 &&
    config.method !== "post" &&
    (status >= 500 || RETRY_STATUS_CODES.includes(status))
  );
}
