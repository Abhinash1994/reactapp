import { FuseLoadable } from '@fuse';
export const PayRollConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/payroll',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};