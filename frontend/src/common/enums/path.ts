export enum PATH {
  // Client
  HOME = '/',
  ABOUT = '/about',
  CONTACT = '/contact',
  PRODUCTS = '/products',
  CART = '/cart',
  ORDER = '/order',
  ORDERED = '/ordered',
  ORDERED_CANCELED = '/ordered/canceled',
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  PROFILE = '/profile',

  // Admin
  DASHBOARD = '/admin/dashboard',
  USERS_MANAGEMENT = '/admin/dashboard/users',
  PRODUCTS_MANAGEMENT = '/admin/dashboard/products',
  ADD_PRODUCT = '/admin/dashboard/products/add',
  CATEGORIES_MANAGEMENT = '/admin/dashboard/categories',
  ADD_CATEGORY = '/admin/dashboard/categories/add',
  ORDERS_MANAGEMENT = '/admin/dashboard/orders',
}
