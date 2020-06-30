import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';

class TestPage extends Component {
    render() {
         const { classes } = this.props;
        return (
             <FusePageSimple
        classes={{
          header: classes.layoutHeader,
          // toolbar: "px-16 sm:px-24"
        }}
        header={
          <div className="flex flex-col items-center w-full h-200">
          This is header
          </div>
        }
        content={
          <div>
            <FuseAnimate animation="transition.slideUpIn" delay={200}>
              <div>
                This is test page
              </div>
           </FuseAnimate>
        </div>
       }
       />
    );
  };
}
export default withStyles(null, { withTheme: true })(TestPage);
