import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { fetchVoteData, fetchExamData } from './fetch-data';
import { App, Vote, Dashboard, Assessment, About, LoginOrRegister, Main } from './pages';

/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default (store) => {
  const requireAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState();
    if (!authenticated) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
    callback();
  };

  const redirectAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState();
    if (authenticated) {
      replace({
        pathname: '/'
      });
    }
    callback();
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Main} onEnter={requireAuth}  fetchData={fetchExamData} />
      <Route path="login" component={LoginOrRegister} onEnter={redirectAuth} />
      <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
      <Route path="assessment/:examId" component={Assessment} onEnter={requireAuth} fetchData={fetchExamData} />
      <Route path="assessment" component={Assessment} onEnter={requireAuth} />
      <Route path="about" component={About} />
    </Route>
  );
};
