import React from "react";

const Avatar = ({ name }: { name: string }) => {
  return (
    <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
      {name}
    </div>
  );
};

export default Avatar;
