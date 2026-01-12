"use client";

import { useEffect } from "react";

interface EntryScreenProps {
  bootMessages?: string[];
}

export function EntryScreen({ bootMessages = [] }: EntryScreenProps) {
  useEffect(() => {
    // Fixed: Removed dependency array as requested
    // This will run on every render - use with caution
    console.log("Entry screen mounted");
  });

  return (
    <div>
      {/* Component content */}
    </div>
  );
}

