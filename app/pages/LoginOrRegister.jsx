import React, { Component } from 'react';
import Page from '../pages/Page';
import LoginOrRegisterContainer from '../containers/LoginOrRegister';

class LoginOrRegister extends Component {
  getMetaData() {
    return {
      title: this.pageTitle(),
      meta: this.pageMeta(),
      link: this.pageLink()
    };
  }

  pageTitle = () => {
    return 'LoginOrRegister | JAC';
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
        <LoginOrRegisterContainer {...this.props} />
      </Page>
    );
  }
}

export default LoginOrRegister;
