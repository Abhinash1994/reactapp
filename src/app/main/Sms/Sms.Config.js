import { FuseLoadable } from '@fuse';
export const SmsConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/sms',
      component: FuseLoadable({
        loader: () => import('./index')
      })
    }
  ]
};