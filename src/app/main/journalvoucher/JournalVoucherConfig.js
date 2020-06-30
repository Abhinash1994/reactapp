import {FuseLoadable} from '@fuse';

export const JournalVoucherConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/journalvoucher',
            component: FuseLoadable({
                loader: () => import('./index')
            })
        }
    ]
};
