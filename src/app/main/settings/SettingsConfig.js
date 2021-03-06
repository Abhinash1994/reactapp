import { FuseLoadable } from '@fuse';

export const SettingsConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/settings/categories',
      component: FuseLoadable({
        loader: () => import('./categories/Categories')
      })
    },
    {
      path: '/settings/support',
      component: FuseLoadable({
        loader: () => import('./support/Support')
      })
    },
    {
      path: '/settings/faq',
      component: FuseLoadable({
        loader: () => import('./faq/Faq')
      })
    },
    {
      path: '/settings/basedata',
      component: FuseLoadable({
        loader: () => import('./basedata/Basedata')
      })
    },
    {
      path: '/settings/landing',
      component: FuseLoadable({
        loader: () => import('./landing/LandingPage')
      })
    },
    {
      path: '/settings/AccountInventory/:page',
      component: FuseLoadable({
        loader: () => import('./landing/subpages/AccountInventorySubpage')
      })
    },
  ]
};
