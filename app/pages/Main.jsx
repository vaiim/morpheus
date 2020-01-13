import React, { Component } from 'react';
import Page from '../pages/Page';
import MainContainer from '../containers/Main';

class Main extends Component {
  getMetaData() {
    return {
      title: this.pageTitle(),
      meta: this.pageMeta(),
      link: this.pageLink()
    };
  }

  pageTitle = () => {
    return 'Main | JAC';
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
        <MainContainer {...this.props} />
      </Page>
    );
  }
}

export default Main;

