import { useEffect, useState } from "react";

export default function Filters({ filter, setFilter, sort, setSort }) {
  const [localFilter, setLocalFilter] = useState(filter);
  const [localSort, setLocalSort] = useState(sort);

  // Debounce filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter(localFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [localFilter, setFilter]);

  // Debounce sort changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setSort(localSort);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSort, setSort]);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Filter:</label>
        <select
          value={localFilter}
          onChange={(e) => setLocalFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
        >
          <option value="all">All Paintings</option>
          <option value="cheap">Under 400 RON</option>
          <option value="premium">Premium (400+ RON)</option>
        </select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Sort:</label>
        <select
          value={localSort}
          onChange={(e) => setLocalSort(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
        >
          <option value="none">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}