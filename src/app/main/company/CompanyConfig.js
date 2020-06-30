import {FuseLoadable} from '@fuse';
// import {Redirect} from 'react-router-dom';

export const CompanyConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : '/company',
            component: FuseLoadable({
                loader: () => import('./CompanyPage')
            })
        },
    ]
};