export function getProductImages(product) {
  const { images } = product;
  if (!images || images.length === 0) {
    return ["/placeholder.png"];
  } else {
    return images.map(
      (image) => `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${image}`,
    );
  }
}

export function getProductThumbnail(product) {
  const { images } = product;
  return (
    `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${images[0]}` ||
    "/placeholder.png"
  );
}

export function getCategoryThumbnail(category) {
  return (
    `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${category.image}` ||
    "/placeholder.png"
  );
}

export function getOrderItemThumbnail(image) {
  return (
    `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${image}` ||
    "/placeholder.png"
  );
}
