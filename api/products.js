import axios from "axios";

export async function getFeaturedProducts({
  page = 1,
  limit = 10,
  sortBy,
  order,
  category,
} = {}) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/featured`,
    {
      params: { page, limit, sortBy, order, category },
    },
  );
  return res.data;
}

export async function getBestSellingProducts({
  page = 1,
  limit = 10,
  sortBy,
  order,
  category,
} = {}) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/bestsellers`,
    {
      params: { page, limit, sortBy, order, category },
    },
  );
  return res.data;
}

export async function getProducts({
  page = 1,
  limit = 10,
  sortBy,
  order,
  category,
} = {}) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
    {
      params: { page, limit, sortBy, order, category },
    },
  );
  return res.data;
}

export async function getProductsByCategory({
  page = 1,
  limit = 10,
  sortBy,
  order,
  categoryId,
} = {}) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/${categoryId}`,
    {
      params: { page, limit, sortBy, order },
    },
  );
  return res.data;
}

export async function getProductById(id) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
  );
  return res.data;
}
