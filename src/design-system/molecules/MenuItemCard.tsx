// src/components/molecules/MenuItemCard/MenuItemCard.tsx
import { Card } from "../atoms/Card/Card";
import { Button } from "../atoms/Button/Button";

export interface MenuItemCardProps {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  isAvailable?: boolean;
  quantity?: number;
  onAdd?: (id: string) => void;
  onRemove?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const MenuItemCard = ({
  id,
  name,
  price,
  description,
  image,
  category,
  isAvailable = true,
  quantity = 0,
  onAdd,
  onRemove,
  onClick,
}: MenuItemCardProps) => {
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd?.(id);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(id);
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  return (
    <Card
      variant="default"
      padding="md"
      hoverable={isAvailable}
      clickable={!!onClick && isAvailable}
      onClick={isAvailable ? handleCardClick : undefined}
      className={!isAvailable ? "opacity-60" : ""}
    >
      <div className="flex gap-3">
        {/* Image */}
        {image && (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-kot-light flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {category && (
            <span className="text-xs text-kot-text uppercase tracking-wide">
              {category}
            </span>
          )}

          <h3 className="font-semibold text-kot-darker text-base mb-1">
            {name}
          </h3>

          {description && (
            <p className="text-sm text-kot-text line-clamp-2 mb-2">
              {description}
            </p>
          )}

          <p className="text-lg font-bold text-kot-primary">
            ₹{price.toFixed(2)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center">
          {!isAvailable ? (
            <span className="text-xs text-red-500 font-medium px-2 py-1 bg-red-50 rounded">
              Out of Stock
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRemoveClick}
                className="w-8 h-8 rounded-full bg-kot-primary text-white flex items-center justify-center text-lg font-bold hover:bg-kot-primary/90 transition-colors active:scale-95"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-kot-darker">
                {quantity}
              </span>
              <button
                onClick={handleAddClick}
                className="w-8 h-8 rounded-full bg-kot-primary text-white flex items-center justify-center text-lg font-bold hover:bg-kot-primary/90 transition-colors active:scale-95"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <Button variant="secondary" onClick={handleAddClick}>
              Add
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;

// // Simple - just name and price
// <MenuItemCard
//   id="1"
//   name="Masala Dosa"
//   price={120}
//   onAdd={handleAdd}
// />

// // With all features
// <MenuItemCard
//   id="2"
//   name="Paneer Butter Masala"
//   price={280}
//   description="Rich and creamy curry"
//   category="Main Course"
//   image="/images/paneer.jpg"
//   quantity={2}
//   onAdd={handleAdd}
//   onRemove={handleRemove}
//   onClick={handleShowDetails}
// />

// // Out of stock
// <MenuItemCard
//   id="3"
//   name="Biryani"
//   price={350}
//   isAvailable={false}
// />
