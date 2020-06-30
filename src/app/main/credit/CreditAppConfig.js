import {FuseLoadable} from '@fuse';

export const CreditAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/credit',
            component: FuseLoadable({
                loader: () => import('./CreditApp')
            })
        }
    ]
};
