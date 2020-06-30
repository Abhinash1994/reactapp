import { FuseLoadable } from '@fuse';
// import {Redirect} from 'react-router-dom';

export const ProjectConfig = {
  settings: {
    layout: {}
  },
  routes: [{
    path: '/project',
    component: FuseLoadable({
      loader: () => import('./index')
    })
  }]
};