import { useState } from "react";
import { Search, Plus } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  isAvailable?: boolean;
}

interface MenuGridProps {
  items: MenuItem[];
  categories: string[];
  onAddToOrder?: (item: MenuItem) => void;
  className?: string;
}

export default function MenuGrid({
  items,
  categories,
  onAddToOrder,
  className = "",
}: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredByCategory =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const filteredItems = searchQuery
    ? filteredByCategory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredByCategory;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-kot-chart bg-kot-white">
        <h1 className="text-2xl font-semibold text-kot-darker mb-4">Menu</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kot-text"
            size={20}
          />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-kot-chart rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-kot-dark text-white"
                  : "bg-kot-light text-kot-text hover:bg-kot-stats hover:text-kot-darker"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-kot-primary">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-kot-text">
            <Search size={48} className="mb-3 text-kot-chart" />
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-kot-white rounded-lg shadow-kot border border-kot-chart p-4 hover:shadow-kot-lg transition-shadow ${
                  !item.isAvailable ? "opacity-60" : ""
                }`}
              >
                {/* Item Image */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-kot-light to-kot-stats rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-kot-text text-sm">No image</span>
                  </div>
                )}

                {/* Item Details */}
                <div className="flex-1 mb-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-kot-darker">
                      {item.name}
                    </h3>
                    {!item.isAvailable && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Out
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-sm text-kot-text mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <span className="text-sm text-kot-text">{item.category}</span>
                </div>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between pt-3 border-t border-kot-chart">
                  <span className="text-lg font-bold text-kot-darker">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => onAddToOrder?.(item)}
                    disabled={!item.isAvailable}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      item.isAvailable
                        ? "bg-kot-dark hover:bg-kot-darker text-white"
                        : "bg-kot-chart text-kot-text cursor-not-allowed"
                    }`}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredItems.length > 0 && (
        <div className="px-6 py-3 border-t border-kot-chart bg-kot-white">
          <p className="text-sm text-kot-text">
            Showing{" "}
            <span className="font-medium text-kot-darker">
              {filteredItems.length}
            </span>{" "}
            items
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      )}
    </div>
  );
}
