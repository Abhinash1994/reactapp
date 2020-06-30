import { FuseLoadable } from '@fuse';
export const BudgetConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/budgeting',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};