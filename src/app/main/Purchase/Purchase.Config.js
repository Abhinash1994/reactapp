import { FuseLoadable } from '@fuse';
export const PurchaseConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/newpurchase',
      component: FuseLoadable({
        loader: () => import('./index')
      }),
    }
  ]
};