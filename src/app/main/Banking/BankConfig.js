import { FuseLoadable } from '@fuse';

export const BankConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/banking/bankManager',
      component: FuseLoadable({
        loader: () => import('./BankManager/BankManager')
      })
    },
    {
      path: '/banking/bankDeposit',
      component: FuseLoadable({
        loader: () => import('./BankTransaction')
      })
    },
    {
      path: '/banking/bankWithdraw',
      component: FuseLoadable({
        loader: () => import('./BankTransaction')
      })
    },
    {
      path: '/banking/bankStatement',
      component: FuseLoadable({
        loader: () => import('./BankStatement')
      })
    },
  ]
};
