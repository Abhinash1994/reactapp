import { FuseLoadable } from '@fuse';

export const UsersAppConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/users',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};
