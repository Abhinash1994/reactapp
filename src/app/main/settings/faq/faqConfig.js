import {FuseLoadable} from '@fuse';
// import {Redirect} from 'react-router-dom';

export const faqConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : '/createbank',
            component: FuseLoadable({
                loader: () => import('./createbank')
            })
        },
    ]
};