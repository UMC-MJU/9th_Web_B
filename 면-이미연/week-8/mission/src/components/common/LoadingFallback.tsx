import React from "react";

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center w-full h-full py-16">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
);

export default LoadingSpinner;