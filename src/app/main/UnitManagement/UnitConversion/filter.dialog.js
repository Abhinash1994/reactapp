import React, { Component } from 'react'
import {
    Dialog, DialogContent, DialogActions,
    FormControl, FormLabel, Radio, RadioGroup, FormControlLabel, Checkbox
} from '@material-ui/core'
import PropTypes from 'prop-types';
import { Button } from 'antd';

class FilterDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: this.props.filter,
            eventType: 'all',
            events: [
                'Due',
                'Done',
                'In Progress'
            ]
        }
    }

    handleChange = name => event => {
        if (event.target.checked) {
            this.setState({
                filter: {
                    ...this.state.filter,
                    [name]: event.target.checked
                }
            });
        } else {
            this.setState({ filter: { ...this.state.filter, [name]: event.target.value } })
        }
    }
    changeFilter = () => {
        this.props.changeFilter(this.state.filter);
    }

    changeEvents = name => event => {
        let types = this.state.filter.types
        if (event.target.checked) {
            types.push(name);
        } else {
            types.splice(types.indexOf(name), 1);
        }
        this.setState({
            eventType: 'selected',
            filter: { ...this.state.filter, types }
        })
    }
    handleChangeEvent = event => {
        if (event.target.value === 'all') {
            this.setState({
                eventType: event.target.value,
                filter: {
                    ...this.state.filter,
                    types: []
                }
            });
        } else {
            this.setState({ eventType: event.target.value });
        }

    }
    render() {
        let { filter, events, eventType } = this.state;
        return (
            <Dialog
                className='user-log-filter-dialog'
                fullWidth
                open={this.props.open} onClose={this.props.onClose}>
                <DialogContent className='content'>
                    <div className='show-event'>
                        <FormControl component="fieldset">
                            <FormLabel component="div" className='title'>Event</FormLabel>
                            <RadioGroup value={eventType} onChange={this.handleChangeEvent}>
                                <FormControlLabel value="all" control={<Radio />} label="Show all status" />
                                <FormControlLabel value="selected" control={<Radio />} label="Show these status only" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className='event-content'>
                        {events.map((element, index) => (
                            <div className='event' key={index}>
                                <FormControlLabel value="all" label={element}
                                    control={<Checkbox checked={filter.types.includes(element)}
                                        onClick={this.changeEvents(element)} />}
                                />
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.changeFilter}>Filter</Button>
                    <Button onClick={this.props.onClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }
}
FilterDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    changeFilter: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired
}
export default FilterDialog;