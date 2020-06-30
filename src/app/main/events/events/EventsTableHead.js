import React from 'react';
import {
    TableHead,
    TableSortLabel,
    TableCell,
    TableRow,
    Tooltip,
    withStyles
} from '@material-ui/core';

const rows = [
    {
        id            : 'sn',
        align         : 'left',
        disablePadding: false,
        label         : 'SN.',
        sort          : true
    },
    {
        id            : 'customername',
        align         : 'left',
        disablePadding: false,
        label         : 'Name',
        sort          : true
    },
 
    {
        id            : 'address',
        align         : 'right',
        disablePadding: false,
        label         : 'Address',
        sort          : true
    },
    {
        id            : 'telepohone',
        align         : 'right',
        disablePadding: false,
        label         : 'Telephone No.',
        sort          : true
    },
    {
        id            : 'mobile',
        align         : 'right',
        disablePadding: false,
        label         : 'Mobile No.',
        sort          : true
    },
    {
        id            : 'emailid',
        align         : 'left',
        disablePadding: false,
        label         : 'Email ID',
        sort          : true
    },
    {
        id            : 'netdues',
        align         : 'left',
        disablePadding: false,
        label         : 'Net Dues',
        sort          : true
    },
 
];

const styles = theme => ({
    actionsButtonWrapper: {
        background: theme.palette.background.paper
    }
});

class EventsTableHead extends React.Component {
    state = {
        selectedEventsMenu: null
    };

    createSortHandler = property => event => {

        this.props.onRequestSort(event, property);
    };

    openSelectedEventsMenu = (event) => {
        this.setState({selectedEventsMenu: event.currentTarget});
    };

    closeSelectedEventsMenu = () => {
        this.setState({selectedEventsMenu: null});
    };

    render()
    {
        const {order, orderBy} = this.props;

        return (
            <TableHead>
                <TableRow className="h-64">
                    {rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                align={row.align}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                {row.sort && (
                                    <Tooltip
                                        title="Sort"
                                        placement={row.align === "right" ? 'bottom-end' : 'bottom-start'}
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
                                            active={orderBy === row.id}
                                            direction={order}
                                            onClick={this.createSortHandler(row.id)}
                                        >
                                            {row.label}
                                        </TableSortLabel>
                                    </Tooltip>
                                )}
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

export default withStyles(styles, {withTheme: true})(EventsTableHead);
