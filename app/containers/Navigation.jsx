import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { logOut } from '../actions/users';
import styles from '../css/components/navigation';
import LOGO_JAC from '../images/jac_1.png';
import LOGO_JAC_RED from '../images/jac_logo_red.jpg';

const cx = classNames.bind(styles);

const Navigation = ({ user, logOut }) => {
    return (
      <nav className={cx('navigation')} role="navigation">
        <span className={cx('title')}>James An College Assessment Test</span>
        {/*<Link className={cx('item')} to="/dashboard">Dashboard</Link>*/}
        {/*<Link to="/about" className={cx('item')} activeClassName={cx('active')}>About</Link>*/}
        <Link
          to="/"
          className={cx('logo')}
          activeClassName={cx('active')}>
          <img src={LOGO_JAC_RED} style={{width:'200px'}} />
        </Link>
      </nav>
    );
};

Navigation.propTypes = {
  user: PropTypes.object,
  logOut: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, { logOut })(Navigation);
