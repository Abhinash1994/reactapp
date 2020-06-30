import { FuseLoadable } from '@fuse';
// import {Redirect} from 'react-router-dom';

export const GodownConfig = {
  settings: {
    layout: {}
  },
  routes: [{
    path: '/godown',
    component: FuseLoadable({
      loader: () => import('./GodownPage')
    })
  }]
};