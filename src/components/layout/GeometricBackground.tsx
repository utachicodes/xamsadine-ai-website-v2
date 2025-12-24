import React from "react";
import { motion } from "framer-motion";

const shapes = [
  { size: 220, x: "-10%", y: "8%", color: "bg-islamic-gold/10" },
  { size: 180, x: "78%", y: "16%", color: "bg-islamic-teal/10" },
  { size: 260, x: "5%", y: "68%", color: "bg-islamic-blue/8" },
];

const GeometricBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern opacity-[0.03] animate-pattern-rotate" />

      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${shape.color}`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: [0.98, 1.03, 0.98],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 2.5,
          }}
        />
      ))}
    </div>
  );
};

export default GeometricBackground;


