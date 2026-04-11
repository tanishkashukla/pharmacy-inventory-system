export const ALL_NAV_ITEMS = [
  'Dashboard',
  'Medicines',
  'Orders',
  'Buy Medicine',
  'Sales',
  'Reports',
  'Users',
]

export function getNavItemsForRole(role) {
  if (role === 'Buyer') {
    return ['Buy Medicine']
  }
  if (role === 'Inventory Manager') {
    return ALL_NAV_ITEMS.filter((item) => item !== 'Buy Medicine')
  }
  return [...ALL_NAV_ITEMS]
}

export function isPageAllowedForRole(role, page) {
  return getNavItemsForRole(role).includes(page)
}
