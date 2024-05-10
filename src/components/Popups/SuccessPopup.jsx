import React from 'react';

const SuccessPopup = ({ message, onClose }) => {
return (
<div className="fixed bottom-0 pr-6 left-0 w-full h-fit flex items-center justify-end">
    <div className="p-4 mb-4  w-1/2 flex justify-between text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
<span className="font-medium">{message}</span>
    <div className="text-white text-xl font-semibold">Success</div>
        <button
        onClick={onClose}
        className="text-green-800 focus:outline-none focus:ring focus:border-blue-300"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
            />
        </svg>
        </button>
</div>
</div>
);
};

export default SuccessPopup;
