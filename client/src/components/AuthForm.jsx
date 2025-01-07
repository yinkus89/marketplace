import React from "react";

const AuthForm = ({ title, fields, onSubmit, buttonText }) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1" htmlFor={field.name}>
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              placeholder={field.placeholder || ""}
              value={field.value}
              onChange={field.onChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required={field.required}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
