import {FuseLoadable} from '@fuse';
// import {Redirect} from 'react-router-dom';

export const BranchConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : '/branch',
            component: FuseLoadable({
                loader: () => import('./BranchPage')
            })
        },
    ]
};