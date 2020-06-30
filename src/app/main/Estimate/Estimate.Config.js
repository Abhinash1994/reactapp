import { FuseLoadable } from '@fuse';
export const EstiateConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/Estimate',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};