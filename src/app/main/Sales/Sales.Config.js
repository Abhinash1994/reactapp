import { FuseLoadable } from '@fuse';
export const SalesConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/sales',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};