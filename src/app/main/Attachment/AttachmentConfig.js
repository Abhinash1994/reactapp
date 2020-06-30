import {FuseLoadable} from '@fuse';
// import {Redirect} from 'react-router-dom';

export const AttachmentConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : '/Attachment',
            component: FuseLoadable({
                loader: () => import('./AttachmentPage')
            })
        },
    ]
};