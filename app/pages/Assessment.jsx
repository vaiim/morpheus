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
    return 'Assessment | JAC';
  };

  pageMeta = () => {
    return [
      { name: 'description', content: 'JAC' }
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

