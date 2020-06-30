import {FuseLoadable} from '@fuse';

export const ResetPassword2PageConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes  : [
        {
            path     : '/reset-password',
            component: FuseLoadable({
                loader: () => import('./ResetPassword2Page')
            })
        }
    ]
};
