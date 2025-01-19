let debounceTimeout;
let lastNavTime = 0;

// Function to check the user role (adapt it to your system)
// In a real app, this should dynamically fetch the user role from state or context
const getUserRole = () => {
  // Example dynamic role fetch from context or state
  const role = 'admin';  // Replace with dynamic logic to fetch the actual role
  return role;
};

// Debounced Navigation Function
const navigateWithDebounce = (navigate, url) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    navigate(url);
  }, 1000); // Increased debounce time to 1000ms (1 second)
};

// Throttled Navigation Function
const throttleNavigate = (navigate, url) => {
  const now = Date.now();
  const timeDifference = now - lastNavTime;

  // Allow navigation only if 1000ms have passed since last navigation
  if (timeDifference >= 1000) { // Increased throttle time to 1000ms (1 second)
    navigate(url);
    lastNavTime = now;
  }
};

// Global Navigation Function (debounce or throttle based on user role)
const globalNavigate = (navigate, url) => {
  const role = getUserRole();

  // Apply debounce or throttle depending on role
  if (role === 'admin') {
    console.log('Admin navigating...');
    throttleNavigate(navigate, url);  // Admin uses throttle
  } else if (role === 'user') {
    console.log('User navigating...');
    navigateWithDebounce(navigate, url);  // User uses debounce
  } else {
    console.log('Unknown role navigating...');
    throttleNavigate(navigate, url);  // Default to throttle for unknown roles
  }
};

// Clear debounce on component unmount (important for React)
const clearDebounce = () => {
  clearTimeout(debounceTimeout);
};

// Export for use in other files
export { globalNavigate, clearDebounce };
