// navigation.js

let debounceTimeout;
let lastNavTime = 0;

// Function to check the user role (adapt it to your system)
const getUserRole = () => {
  // Fetch the current user's role from your authentication context or state
  return 'admin';  // This should be dynamically fetched based on user role
};

// Debounced Navigation Function
const navigateWithDebounce = (url) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    window.location.href = url;
  }, 300); // 300ms debounce time
};

// Throttled Navigation Function
const throttleNavigate = (url) => {
  const now = Date.now();
  const timeDifference = now - lastNavTime;

  // Allow navigation only if 300ms have passed since last navigation
  if (timeDifference >= 300) {
    window.location.href = url;
    lastNavTime = now;
  }
};

// Global Navigation Function (debounce or throttle based on user role)
const globalNavigate = (url) => {
  const role = getUserRole();

  // Apply debounce or throttle depending on role
  if (role === 'admin') {
    console.log('Admin navigating...');
    throttleNavigate(url);  // Admin uses throttle
  } else if (role === 'user') {
    console.log('User navigating...');
    navigateWithDebounce(url);  // User uses debounce
  } else {
    console.log('Unknown role navigating...');
    throttleNavigate(url);  // Default to throttle for unknown roles
  }
};

// Export for use in other files
export { globalNavigate };
