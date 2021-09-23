import React from 'react';

import '../../css/Header.scss';

class Header extends React.Component {
  render() {
    return <header className='header'>
      <div className='header-content'>
        <a href='/' className='logo'>MOVIE DATABASE</a>
      </div>
    </header>;
  }
}

export default Header;
