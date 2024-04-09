import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Principal'
  },
  {
    displayName: 'Dashboard',
    iconName: 'chart-histogram',
    route: '/',
  },

  {
    navCap: 'Metas',
  },
  {
    displayName: 'Diário',
    iconName: 'chart-histogram',
    route: '/sellers/goalsBySellers',
  },
  {
    displayName: 'Mensal',
    iconName: 'chart-histogram',
    route: '/sellers/goalsBySellersByMonth',
  },
  {
    navCap: 'Vendas',
  },
  {
    displayName: 'Semanal',
    iconName: 'chart-histogram',
    route: '/sellers/salesByDayOfWeek',
  },
  {
    displayName: 'Mensal',
    iconName: 'chart-histogram',
    route: '/sellers/salesByMonth',
  },
  {
    displayName: 'Sub Grupos',
    iconName: 'chart-histogram',
    route: '/sellers/subGroupsSold',
  },
  {
    displayName: 'Fabricantes',
    iconName: 'chart-histogram',
    route: '/sellers/salesByManufacturers',
  },
  {
    displayName: 'Estados',
    iconName: 'chart-histogram',
    route: '/sellers/salesByStates',
  },
  {
    displayName: 'Produtos',
    iconName: 'chart-histogram',
    route: '/sellers/productsSold',
  },
  {
    navCap: 'Gestão',
  },
  {
    displayName: 'Clientes / Vendedor',
    iconName: 'chart-histogram',
    route: '/sellers/newCustomersPerSellers',
  },
  {
    displayName: 'Clientes / Mês',
    iconName: 'chart-histogram',
    route: 'sellers/newCustomersPerMonth',
  },
  {
    navCap: 'Margens',
  },
  {
    displayName: 'Produtos',
    iconName: 'chart-histogram',
    route: 'sellers/marginByProducts',
  },
  {
    displayName: 'Sub Grupos',
    iconName: 'chart-histogram',
    route: 'sellers/marginBySubGroups',
  },
];
