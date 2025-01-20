let lastNavTimeVendor = 0;

const throttleNavigateVendor = (navigate, url) => {
  const now = Date.now();
  if (now - lastNavTimeVendor >= 1500) { // Slightly longer throttle for vendors
    navigate(url);
    lastNavTimeVendor = now;
  }
};

export const globalNavigateVendor = (navigate, url) => {
  console.log("Vendor navigation");
  throttleNavigateVendor(navigate, url);
};
