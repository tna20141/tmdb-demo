import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MainLayout from './components/layouts/MainLayout';
import MovieList from './components/pages/MovieList';
import MovieDetails from './components/pages/MovieDetails';
import './css/App.scss';

class RouteWrapper extends React.Component {
  render() {
    const { component: Component, layout: Layout, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) => {
          if (!Layout) {
            return <Component {...props} />;
          }
          return (
            <Layout {...props}>
              <Component {...props} />
          </Layout>
          );
        }}
      />
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <RouteWrapper path='/movie/:movieid' component={MovieDetails} layout={MainLayout} />
          <RouteWrapper path='/' component={MovieList} layout={MainLayout} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
