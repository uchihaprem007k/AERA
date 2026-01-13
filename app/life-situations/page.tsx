"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { Heart, ChevronDown, ChevronUp, Filter, Search } from "lucide-react";

export default function LifeSituationsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliesToMe, setAppliesToMe] = useState<Record<string, boolean>>({});
  const [situationNotes, setSituationNotes] = useState<Record<string, string>>({});
  const [situationFrequencies, setSituationFrequencies] = useState<Record<string, string>>({});

  const categories = Array.from(new Set(mockData.lifeSituations.map((s) => s.category)));

  const filteredSituations = mockData.lifeSituations.filter((situation) => {
    const matchesCategory = !selectedCategory || situation.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      situation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      situation.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Life Situations</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Understanding common human struggles and how to navigate them</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search situations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg border transition-colors min-h-[44px] ${
              !selectedCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-foreground"
            }`}
          >
            All
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg border transition-colors min-h-[44px] ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-foreground"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Situations List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredSituations.map((situation, i) => {
            const isExpanded = expandedId === situation.id;
            return (
              <motion.div
                key={situation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <motion.button
                  onClick={() => setExpandedId(isExpanded ? null : situation.id)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <Heart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{situation.title}</h3>
                      <span className="text-xs bg-muted px-2 py-1 rounded">{situation.category}</span>
                      <span className="text-xs text-muted-foreground">{situation.commonality}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAppliesToMe((prev) => ({
                            ...prev,
                            [situation.id]: !prev[situation.id],
                          }));
                        }}
                        className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          appliesToMe[situation.id]
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {appliesToMe[situation.id] ? "✓ Applies to me" : "This applies to me"}
                      </motion.button>
                    </div>
                    <p className="text-sm text-muted-foreground">{situation.description}</p>
                    {appliesToMe[situation.id] && (
                      <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <p className="text-sm text-primary font-medium">You&apos;ve marked this as relevant to you.</p>
                      </div>
                    )}
                  </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 space-y-4">
                        <div className="pt-4 border-t border-border">
                          <h4 className="font-semibold mb-2">What this means</h4>
                          <p className="text-sm text-muted-foreground">{situation.explanation}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">What helps</h4>
                          <ul className="space-y-2">
                            {situation.helpful.map((tip, tipIndex) => (
                              <motion.li
                                key={tipIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: tipIndex * 0.1 }}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="text-primary mt-1">•</span>
                                <span>{tip}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        
                        {appliesToMe[situation.id] && (
                          <div className="mt-4 pt-4 border-t border-border space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">How often does this come up?</label>
                              <select
                                value={situationFrequencies[situation.id] || "sometimes"}
                                onChange={(e) => {
                                  setSituationFrequencies((prev) => ({
                                    ...prev,
                                    [situation.id]: e.target.value,
                                  }));
                                }}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              >
                                <option value="rarely">Rarely</option>
                                <option value="sometimes">Sometimes</option>
                                <option value="often">Often</option>
                                <option value="very-often">Very Often</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Personal notes (optional)</label>
                              <textarea
                                value={situationNotes[situation.id] || ""}
                                onChange={(e) => {
                                  setSituationNotes((prev) => ({
                                    ...prev,
                                    [situation.id]: e.target.value,
                                  }));
                                }}
                                placeholder="How does this show up in your life? What do you notice?"
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                                rows={3}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSituations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No situations found matching your filters.</p>
        </motion.div>
      )}
    </div>
  );
}

