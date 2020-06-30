import { FuseLoadable } from '@fuse';
// import {Redirect} from 'react-router-dom';

export const ProductServiceConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/productservice',
      component: FuseLoadable({
        loader: () => import('./ProductServicePage')
      })
    },
  ]
};