import React from 'react';
import Header from './Header';
import AppContent from './AppContent';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <AppContent />
      </div>
    )
  }
}