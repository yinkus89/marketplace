-- Create Table for Product
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Added default value
    "categoryId" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Create Table for Order
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Added default value
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create Table for OrderItem
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Create Table for User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Table for Customer
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Added default value

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- Create Table for Category
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Create Unique Index for User's email
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create Unique Index for Customer's email
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- Create Unique Index for Category's name
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- Add Foreign Key for Product categoryId referencing Category
ALTER TABLE "Product" 
    ADD CONSTRAINT "Product_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Add Foreign Key for Order customerId referencing Customer
ALTER TABLE "Order" 
    ADD CONSTRAINT "Order_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key for OrderItem productId referencing Product
ALTER TABLE "OrderItem" 
    ADD CONSTRAINT "OrderItem_productId_fkey" 
    FOREIGN KEY ("productId") REFERENCES "Product"("id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key for OrderItem orderId referencing Order
ALTER TABLE "OrderItem" 
    ADD CONSTRAINT "OrderItem_orderId_fkey" 
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Trigger Function to auto-update updatedAt field
CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger for Product to auto-update updatedAt
CREATE TRIGGER update_updatedAt_trigger_product
BEFORE UPDATE ON "Product"
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();

-- Create Trigger for Order to auto-update updatedAt
CREATE TRIGGER update_updatedAt_trigger_order
BEFORE UPDATE ON "Order"
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();

-- Create Trigger for Customer to auto-update updatedAt
CREATE TRIGGER update_updatedAt_trigger_customer
BEFORE UPDATE ON "Customer"
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();

-- Create Trigger for Category to auto-update updatedAt
CREATE TRIGGER update_updatedAt_trigger_category
BEFORE UPDATE ON "Category"
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();

-- Soft Delete Support: Add deletedAt column (optional)
ALTER TABLE "Product" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "OrderItem" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Customer" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Category" ADD COLUMN "deletedAt" TIMESTAMP(3);
