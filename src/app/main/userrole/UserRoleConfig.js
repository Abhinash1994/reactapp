import {FuseLoadable} from '@fuse';
// import {Redirect} from 'react-router-dom';

export const UserRoleConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : '/userrole',
            component: FuseLoadable({
                loader: () => import('./UserRolePage')
            })
        },
    ]
};