const Button = ({ label, type = "button" }) => {
    return (
      <button
        type={type}
        className="w-full px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
      >
        {label}
      </button>
    );
  };
  
  export default Button;