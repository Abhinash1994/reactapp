import React from 'react';
import {withStyles, Card, Icon, Typography} from '@material-ui/core';

const Widget3 = ({data, theme}) => {

    return (
        <Card className="w-full rounded-8 shadow-none border-1 bg-pink-lighter">

            <div className="p-16 pb-0 flex flex-row flex-wrap items-end">

                <div className="pr-16">
                    <Typography className="h3" color="textSecondary">New Customer</Typography>
                    <Typography className="text-56 font-300 leading-none mt-8">
                        {data.value}
                    </Typography>
                </div>

                <div className="py-4 text-16 flex flex-row items-center">
                    <div className="flex flex-row items-center">
                        {data.ofTarget > 0 && (
                            <Icon className="text-green mr-4">trending_up</Icon>
                        )}
                        {data.ofTarget < 0 && (
                            <Icon className="text-red mr-4">trending_down</Icon>
                        )}
                        <Typography>{data.ofTarget}%</Typography>
                    </div>
                    <Typography className="ml-4 whitespace-no-wrap"></Typography>
                </div>

            </div>
        </Card>
    );
};

export default withStyles(null, {withTheme: true})(Widget3);
