import { FuseLoadable } from '@fuse';

export const AutoNumberingConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/autonumbering',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};
