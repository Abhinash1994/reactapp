import { FuseLoadable } from '@fuse';

export const UserLogConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/userlog',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    },
  ]
};