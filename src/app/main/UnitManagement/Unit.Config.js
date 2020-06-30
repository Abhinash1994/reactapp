import { FuseLoadable } from '@fuse';
// import {Redirect} from 'react-router-dom';

export const UnitConfig = {
  settings: {
    layout: {}
  },
  routes: [{
    path: '/Unit',
    component: FuseLoadable({
      loader: () => import('./index')
    })
  }]
};