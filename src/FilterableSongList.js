import React, { useCallback } from 'react';
import { Typography, Grid, AppBar, Toolbar, Container } from '@material-ui/core';

import Filters from './Filters';
import SongList from './SongList';
import songData from './SongData';
import { matchDifficulty } from './util/matchDifficulty';
import { usePersistedState } from './util/usePersistedState';
import { formatInteger } from './util/formatNumber';

const initialValues = {
  difficulty: [1, songData.maxNumericDifficulty() + 1],
  showNoteCounts: false,
  showFavorites: false,
  artist: null,
  platform: null,
};

// Renders a song list with interactive filters.
// Manages the filter state.
export function FilterableSongList(props) {
  let [filters, setFilters] = usePersistedState('deemoFilters', {});
  let [favorites, setFavorites] = usePersistedState('deemoFavorites', {});

  // Provide defaults, otherwise React considers the inputs to be
  // 'uncontrolled'. We do it in a seperate step so we can support older
  // LocalStorage values even after adding new inputs.
  filters = {
    ...initialValues,
    ...filters,
  };

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prevState => {
      return { ...prevState, [name]: value };
    });
  }, [setFilters]);

  const handleFilterClear = useCallback(() => {
    setFilters(initialValues);
  }, [setFilters]);

  const handleToggleFavorite = useCallback((songID) => {
    setFavorites(favorites => {
      console.log("toggle favorite", songID);
      let newFavorites = Object.assign({}, favorites);
      if (favorites[songID]) {
        delete newFavorites[songID];
      }
      else {
        newFavorites[songID] = true;
      }
      return newFavorites;
    });
  }, [setFavorites]);

  const filterSongs = (songs, filter) => {
    let deviceSongTotal = 0;

    const filteredSongs = songs.filter((song) => {
      if (filters.showFavorites && !favorites[song.id]) {
        return false;
      }

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
      <AppBar position="fixed" color="secondary">
        <Grid container>
          <Grid item xs={12}>
            <Filters onChange={handleFilterChange} onClear={handleFilterClear} filters={filters} />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '-0.2em', paddingTop: '0.3em', paddingBottom: '0.2em' }}>
            <Typography variant="caption">
              Showing {
                filteredCount === totalCount ? `${formatInteger(totalCount)}`
                                             : `${formatInteger(filteredCount)} of ${formatInteger(totalCount)}`
              } song{filteredCount === 1 ? '' : 's'}
            </Typography>
          </Grid>
        </Grid>
      </AppBar>
      {/* extra Toolbar element so SongList is offset and they don't overlap */}
      <Toolbar />
      <Container>
        <SongList
          collections={filtered}
          filters={filters}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite} />
      </Container>
    </>
  );
}