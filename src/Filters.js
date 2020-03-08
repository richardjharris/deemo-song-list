import songData from './SongData';

import React, { useState } from 'react';
import {
  Switch, Grid, TextField, Slider, Button, ButtonGroup, Typography,
  FormControlLabel, Drawer, makeStyles
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const _buildDifficultySelectorMarks = () => {
  const maxDiff = songData.maxNumericDifficulty();
  var difficultySelectorMarks = [];
  for (var i = 1; i <= maxDiff; i++) {
    difficultySelectorMarks.push({
      value: i,
      label: `${i}`,
    });
  }
  difficultySelectorMarks.push({
    value: maxDiff + 1,
    label: '🞷',
  });
  return difficultySelectorMarks;
};

const difficultySelectorMarks = _buildDifficultySelectorMarks();

const useStyles = makeStyles({
  formLabel: {
    fontWeight: 'bold',
  }
});

export default function Filters(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const filters = props.filters;
  const classes = useStyles();

  const handleChange = (name, value) => {
    props.onChange(name, value);
  }

  // Checkboxes are uncontrolled, so we manage the state.
  // TODO use state from props instead.
  const handleCheckbox = name => event => {
    const checked = event.target.checked;
    props.onChange(name, !!checked);
  }

  const selectPlatform = (platform) => {
    if (filters.platform === platform) {
      // Unset platform i.e. toggle the selected button
      platform = null;
    }
    props.onChange('platform', platform);
  }

  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  }

  const clearFilters = () => {
    props.onClear();
  }

  const difficultySlider = (
      <Slider
        id="difficulty-slider"
        value={filters.difficulty}
        marks={difficultySelectorMarks}
        valueLabelDisplay="off"
        min={1}
        max={songData.maxNumericDifficulty() + 1}
        onChangeCommitted={(_, value) => handleChange('difficulty', value)}
      />);
  const artistInput = (
    <Autocomplete
      id="artist-input"
      value={filters.artist}
      freeSolo
      selectOnFocus
      options={songData.artists()}
      size="small"
      onChange={(_, value) => handleChange('artist', value)}
      renderInput={params => <TextField {...params} variant="outlined" />}
    />);
  const platformSelect = (
    <ButtonGroup
      id="platform-select"
      variant="contained"
      size="small"
      fullWidth
    >
      {songData.platforms().map((platform) => {
        const selected = filters.platform === platform;
        return (
          <Button
            key={platform}
            onClick={(_) => { selectPlatform(platform) }}
            color={selected ? "primary" : "default"}
          >
            {platform}
          </Button>
        );
      })}
    </ButtonGroup>
  );

  const filterGridItems = [
    { name: 'Difficulty', element: difficultySlider },
    { name: 'Artist', element: artistInput },
    { name: 'Platform', element: platformSelect },
  ];

  const filterGrid = (
    // Hack to avoid scrollbars
    <div style={{maxWidth: '90%', margin: '0 auto', padding: '0.5em'}}>
      <Grid container spacing={1} alignItems='center'>
        {filterGridItems.map(item => {
          return (<React.Fragment key={item.name}>
            <Grid item sm={2} xs={12}>
              <Typography className={classes.formLabel}>{item.name}</Typography>
            </Grid>
            <Grid item sm={10} xs={12}>
              {item.element}
            </Grid>
          </React.Fragment>);
        })}
        <Grid item xs={6} align='center'>
            <FormControlLabel control={
              <Switch
                checked={filters.showNoteCounts}
                onChange={handleCheckbox('showNoteCounts')}
                value="showNoteCounts"
                color="primary"
              />
            }
            label="Show note counts"
            />
        </Grid>
        <Grid item xs={6} align='center'>
          <Button
            onClick={clearFilters}
            color="secondary"
          >Clear filters</Button>
        </Grid>
      </Grid>
    </div>
  );

  return (<>
    <Drawer
      anchor="top"
      open={drawerOpen}
      //open={true}
      onClose={toggleDrawer(false)}
    >{filterGrid}</Drawer>
    <Button
      style={{width: '100%' }}
      onClick={toggleDrawer(true)}
      variant="contained"
      color="primary"
    >Open filters</Button>
  </>);
}