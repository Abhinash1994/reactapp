import { FuseLoadable } from '@fuse';

export const ChartOfAccountConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/chartofaccount',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};
