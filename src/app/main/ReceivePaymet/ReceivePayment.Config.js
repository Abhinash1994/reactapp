import { FuseLoadable } from '@fuse';

export const ReceivePaymentConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/receivePayment',
      component: FuseLoadable({
        loader: () => import('./ReceivePaymentPage')
      })
    }
  ]
};