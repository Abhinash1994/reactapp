import { FuseLoadable } from '@fuse';
// import {Redirect} from 'react-router-dom';

export const ProductGroupConfig = {
  settings: {
    layout: {}
  },
  routes: [{
    path: '/productGroup',
    component: FuseLoadable({
      loader: () => import('./ProductGroupPage')
    })
  }]
};