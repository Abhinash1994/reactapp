import React, { Component } from 'react'
import {
    Button,
    TextField
} from '@material-ui/core';
export default class EditDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: props.content
        }
    };
    changeContent = () => {
        this.props.onClose(this.state.content, true);
    }
    onChange = (key, event) => {
        this.setState({
            content: {
                ...this.state.content,
                [key]: event.target.value
            }
        })
    }
    render() {
        const { content } = this.state
        return (
            <div className='edit-dialog'>
                <div className='dialog'>
                    <TextField
                        className='rows'
                        label="Account"
                        value={content.account}
                        variant="outlined"
                        onChange={(event) => this.onChange('account', event)}
                    />
                    <TextField
                        className='rows'
                        label="Debits"
                        value={content.debits}
                        variant="outlined"
                        onChange={(event) => this.onChange('debits', event)}
                    />
                    <TextField
                        className='rows'
                        label="Credits"
                        value={content.credits}
                        variant="outlined"
                        onChange={(event) => this.onChange('credits', event)}
                    />
                    <TextField
                        className='rows'
                        label="Description"
                        value={content.description}
                        variant="outlined"
                        onChange={(event) => this.onChange('description', event)}
                    />
                    <TextField
                        className='rows'
                        label="Name"
                        value={content.name}
                        variant="outlined"
                        onChange={(event) => this.onChange('name', event)}
                    />
                    <div className='actions'>
                        <Button onClick={this.changeContent}>Save</Button>
                        <Button onClick={this.props.onClose}>Cancel</Button>
                    </div>
                </div>
            </div>
        )
    }
}
