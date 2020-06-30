import { FuseLoadable } from '@fuse';
// import {Redirect} from 'react-router-dom';

export const FiscalConfig = {
  settings: {
    layout: {}
  },
  routes: [{
    path: '/fiscal',
    component: FuseLoadable({
      loader: () => import('./FiscalPage')
    })
  }]
};