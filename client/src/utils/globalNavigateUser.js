let debounceTimeoutUser;

const debounceNavigateUser = (navigate, url) => {
  clearTimeout(debounceTimeoutUser);
  debounceTimeoutUser = setTimeout(() => {
    navigate(url);
  }, 1000); // 1 second debounce
};

export const globalNavigateUser = (navigate, url) => {
  console.log("User navigation");
  debounceNavigateUser(navigate, url);
};
