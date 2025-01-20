let lastNavTimeAdmin = 0;

const throttleNavigateAdmin = (navigate, url) => {
  const now = Date.now();
  if (now - lastNavTimeAdmin >= 1000) { // 1 second throttle
    navigate(url);
    lastNavTimeAdmin = now;
  }
};

export const globalNavigateAdmin = (navigate, url) => {
  console.log("Admin navigation");
  throttleNavigateAdmin(navigate, url);
};
