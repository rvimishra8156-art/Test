const products = [
  {
    id: "tray-001",
    name: "Classic Serving Tray",
    description: "Premium mango wood serving tray with handles. Perfect for breakfasts and gifting.",
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532634896-26909d0d84b8?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526178614020-1b40d1c54f24?w=1200&q=80&auto=format&fit=crop"
    ],
    price_min: 50,
    price_max: 120,
    tags: ["tray", "kitchen", "gift"],
    category: "serveware",
    sku: "TRAY-001",
    stock: 20,
    featured: true
  },
  {
    id: "pen-001",
    name: "Desk Pen Holder",
    description: "Minimal teak wood pen holder to keep your workspace tidy.",
    images: [
      "https://images.unsplash.com/photo-1553456558-aff63285bdd2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80&auto=format&fit=crop"
    ],
    price_min: 60,
    price_max: 110,
    tags: ["office", "desk", "penholder"],
    category: "accessories",
    sku: "PEN-001",
    stock: 40,
    featured: false
  },
  {
    id: "frame-001",
    name: "Handmade Picture Frame",
    description: "Solid walnut frame handcrafted. Available in multiple sizes.",
    images: [
      "https://images.unsplash.com/photo-1505691723518-36a5f3a2b5a2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497377246324-9fba39c6f5c5?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542317854-9d9e7b512f3b?w=1200&q=80&auto=format&fit=crop"
    ],
    price_min: 70,
    price_max: 120,
    tags: ["frame", "home", "decor"],
    category: "decor",
    sku: "FRAME-001",
    stock: 15,
    featured: false
  }
  // Add more products following same shape
];

export default products;