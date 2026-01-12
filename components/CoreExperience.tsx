"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function CoreExperience() {
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              // Fixed: Use Set.add() method instead of spreading Set
              setRevealedItems((prev) => {
                const newSet = new Set(prev);
                newSet.add(id);
                return newSet;
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-id]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Component content */}
    </div>
  );
}

