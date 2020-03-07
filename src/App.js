import React from 'react';
import './App.css';
import { FilterableSongList } from './FilterableSongList';

// The app manages the filter state as it is needed by both
// child components.
export default function App() {
  return (
    <div className="App">
      <FilterableSongList />
    </div>
  );
}