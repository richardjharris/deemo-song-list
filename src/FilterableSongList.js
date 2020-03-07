import React from 'react';
import { Typography } from '@material-ui/core';

import Filters from './Filters';
import SongList from './SongList';
import songData from './SongData';
import { matchDifficulty } from './util/matchDifficulty';
import { usePersistedState } from './util/usePersistedState';

// Renders a song list with interactive filters.
// Manages the filter state.
export function FilterableSongList(props) {
  let [filters, setFilters] = usePersistedState('deemoFilters', {});

  // Provide defaults, otherwise React considers the inputs to be
  // 'uncontrolled'. We do it in a seperate step so we can support older
  // LocalStorage values even after adding new inputs.
  filters = {
    difficulty: [1, songData.maxNumericDifficulty() + 1],
    showNoteCounts: false,
    artist: null,
    platform: null,
    ...filters,
  };

  const handleFilterChange = (name, value) => {
    setFilters(prevState => {
      return { ...prevState, [name]: value };
    });
  }

  const filterSongs = (songs, filter) => {
    let deviceSongTotal = 0;

    const filteredSongs = songs.filter((song) => {
      // When showing song count (e.g. '12 of 300 songs shown') we don't
      // include songs from other devices, so filter that first.
      if (filter.platform) {
        let platformInfo = song.platforms || song.collection.platforms;
        if (platformInfo) {
          let status = platformInfo[filter.platform];
          if (status === '×') {
            return false;
          }
        }
      }

      deviceSongTotal++;

      if (filter.artist) {
        const artistLower = filter.artist.toLowerCase();
        if (song.artist.toLowerCase().indexOf(artistLower) === -1) {
          return false;
        }
      }
      if (filter.difficulty) {
        let hit = false;
        for (const diff of song.difficulty) {
          if (matchDifficulty(diff, filter.difficulty)) {
            hit = true;
            break;
          }
        }
        if (!hit) return false;
      }

      return true;
    });

    return { deviceSongTotal, filteredSongs };
  };

  const filterCollections = (collections, filter) => {
    let filtered = [];
    let totalCount = 0;
    let filteredCount = 0;
    for (const collection of collections) {
      const { deviceSongTotal, filteredSongs }
        = filterSongs(collection.songs, filter);

      totalCount += deviceSongTotal;

      if (filteredSongs.length > 0) {
        filtered.push({
          ...collection,
          songs: filteredSongs,
        });
        filteredCount += filteredSongs.length;
      }
    }

    return { filtered, totalCount, filteredCount };
  }

  const { filtered, totalCount, filteredCount } = filterCollections(songData.collections(), filters);
  return (
    <>
      <Filters onChange={handleFilterChange} filters={filters} />
      <Typography>Showing {filteredCount} of {totalCount} songs</Typography>
      <SongList collections={filtered} filters={filters} />
    </>
  );
}