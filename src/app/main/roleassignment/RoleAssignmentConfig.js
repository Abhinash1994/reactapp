import { FuseLoadable } from '@fuse';
// import {Redirect} from 'react-router-dom';

export const RoleAssignmentConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/roleassignment',
      component: FuseLoadable({
        loader: () => import('./RoleAssignmentPage')
      })
    },
  ]
};