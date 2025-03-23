import React from "react";

const Button = ({label}) => {
  return (
    <div>
      <button className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
        {label}
      </button>
    </div>
  );
};

export default Button;
