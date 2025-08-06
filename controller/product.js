export const getProduct = (req, res) => {
  // Logic to get bikes
  res.json({ message: "List of bikes" });
};

export const createProduct = (req, res) => {
  // Logic to create a new bike
  res.status(201).json({ message: "Bike created successfully" });
};

export const updateProduct = (req, res) => {
  // Logic to update a bike
  res.json({ message: "Bike updated successfully" });
};

export const deleteProduct = (req, res) => {
  // Logic to delete a bike
  res.json({ message: "Bike deleted successfully" });
};
