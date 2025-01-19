import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { globalNavigate, clearDebounce } from "./path-to-navigation-utils";

const MyComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup debounce timeout if component is unmounted
    return () => {
      clearDebounce();
    };
  }, []);

  const handleNavigate = (url) => {
    globalNavigate(navigate, url);
  };

  return (
    <div>
      <button onClick={() => handleNavigate('/some-url')}>Navigate</button>
    </div>
  );
};

export default MyComponent;
