import { FuseLoadable } from '@fuse';
export const StockAdjustmentConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/StockAdjusment',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};