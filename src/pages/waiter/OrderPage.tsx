import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuGrid from "../../design-system/organisms/MenuGrid";
import OrderSummaryPanel from "../../design-system/organisms/OrderSummaryPanal";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  isAvailable?: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note: string;
}

// Mock menu data - replace with API call
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Paneer Butter Masala",
    price: 220,
    category: "Main Course",
    description: "Rich and creamy curry",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Veg Fried Rice",
    price: 180,
    category: "Main Course",
    description: "Indo-Chinese favorite",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Garlic Naan",
    price: 45,
    category: "Breads",
    description: "Soft tandoori bread",
    isAvailable: true,
  },
  {
    id: "4",
    name: "Spring Rolls",
    price: 120,
    category: "Starters",
    description: "Crispy vegetable rolls",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Dal Makhani",
    price: 180,
    category: "Main Course",
    description: "Black lentils in butter",
    isAvailable: true,
  },
  {
    id: "6",
    name: "Gulab Jamun",
    price: 80,
    category: "Desserts",
    description: "Sweet milk dumplings",
    isAvailable: true,
  },
  {
    id: "7",
    name: "Tandoori Roti",
    price: 30,
    category: "Breads",
    description: "Whole wheat bread",
    isAvailable: true,
  },
  {
    id: "8",
    name: "Paneer Tikka",
    price: 200,
    category: "Starters",
    description: "Grilled cottage cheese",
    isAvailable: true,
  },
  {
    id: "9",
    name: "Biryani",
    price: 250,
    category: "Main Course",
    description: "Aromatic rice dish",
    isAvailable: false,
  },
  {
    id: "10",
    name: "Raita",
    price: 60,
    category: "Sides",
    description: "Yogurt with cucumber",
    isAvailable: true,
  },
];

const CATEGORIES = [
  "All",
  "Starters",
  "Main Course",
  "Breads",
  "Sides",
  "Desserts",
];

export default function OrderPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch menu items and table info on mount
  useEffect(() => {
    // TODO: Replace with actual API calls
    // fetchMenuItems().then(data => setMenuItems(data));
    // fetchTableInfo(tableId).then(data => setTableNumber(data.number));
    // fetchExistingOrder(tableId).then(data => setOrderItems(data));

    // Simulate API call
    setTimeout(() => {
      setMenuItems(MOCK_MENU_ITEMS);
      setTableNumber(`T-${tableId?.padStart(2, "0")}`);
      setLoading(false);
    }, 500);
  }, [tableId]);

  // Add item to order
  const handleAddToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find((oi) => oi.id === item.id);

    if (existingItem) {
      // Increase quantity if item already exists
      setOrderItems(
        orderItems.map((oi) =>
          oi.id === item.id ? { ...oi, quantity: oi.quantity + 1 } : oi
        )
      );
    } else {
      // Add new item
      const newOrderItem: OrderItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        note: "",
      };
      setOrderItems([...orderItems, newOrderItem]);
    }
  };

  // Update quantity
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      setOrderItems(orderItems.filter((item) => item.id !== id));
    } else {
      setOrderItems(
        orderItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Update note
  const handleUpdateNote = (id: string, note: string) => {
    setOrderItems(
      orderItems.map((item) => (item.id === id ? { ...item, note } : item))
    );
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  // Clear all items
  const handleClearOrder = () => {
    const confirm = window.confirm(
      "Are you sure you want to clear the entire order?"
    );
    if (confirm) {
      setOrderItems([]);
    }
  };

  // Send to kitchen
  const handleSendToKitchen = async () => {
    if (orderItems.length === 0) {
      alert("Please add items to the order first!");
      return;
    }

    // TODO: Replace with actual API call
    // await sendOrderToKitchen({ tableId, items: orderItems });

    // Simulate API call
    const confirm = window.confirm(
      `Send order to kitchen?\n\nTable: ${tableNumber}\nItems: ${
        orderItems.length
      }\nTotal: ₹${orderItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2)}`
    );

    if (confirm) {
      console.log("Order sent to kitchen:", {
        tableId,
        tableNumber,
        items: orderItems,
        timestamp: new Date().toISOString(),
      });

      // Show success message
      alert("Order sent to kitchen successfully!");

      // Navigate back to tables page
      navigate("/waiter/tables");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Side - Menu */}
      <div className="flex-1">
        <MenuGrid
          items={menuItems}
          categories={CATEGORIES}
          onAddToOrder={handleAddToOrder}
        />
      </div>

      {/* Right Side - Order Summary */}
      <div className="w-96">
        <OrderSummaryPanel
          items={orderItems}
          tableNumber={tableNumber}
          onUpdateQuantity={handleUpdateQuantity}
          onUpdateNote={handleUpdateNote}
          onRemoveItem={handleRemoveItem}
          onSendToKitchen={handleSendToKitchen}
          onClearOrder={handleClearOrder}
        />
      </div>
    </div>
  );
}
