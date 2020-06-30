

import { FuseLoadable } from '@fuse';
export const statementConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/Statement',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};