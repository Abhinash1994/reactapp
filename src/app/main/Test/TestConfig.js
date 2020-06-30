import {FuseLoadable} from '@fuse';
// import {Redirect} from 'react-router-dom';
import * as Links from 'app/links/commonLinks';

export const TestConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : Links.MyLink,
            component: FuseLoadable({
                loader: () => import('./TestPage')
            })
        },
    ]
};