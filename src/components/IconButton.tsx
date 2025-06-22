import React from "react";
import { motion } from "framer-motion";

interface IconButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}

export default function IconButton({
  onClick,
  disabled = false,
  title = "",
  children,
}: IconButtonProps) {
  return (
    <motion.button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      whileHover={
        !disabled
          ? {
              rotate: 6,
              scale: 1.1,
              transition: {
                type: "spring",
                stiffness: 300,
              },
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
}
