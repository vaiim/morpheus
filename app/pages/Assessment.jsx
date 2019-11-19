import React, { Component } from 'react';
import Page from '../pages/Page';
import AssessmentContainer from '../containers/Assessment';

class Assessment extends Component {
  getMetaData() {
    return {
      title: this.pageTitle(),
      meta: this.pageMeta(),
      link: this.pageLink()
    };
  }

  pageTitle = () => {
    return 'Assessment | reactGo';
  };

  pageMeta = () => {
    return [
      { name: 'description', content: 'A reactGo example of a Assessment page' }
    ];
  };

  pageLink = () => {
    return [];
  };

  render() {
    return (
      <Page {...this.getMetaData()}>
        <AssessmentContainer {...this.props} />
      </Page>
    );
  }
}

export default Assessment;

