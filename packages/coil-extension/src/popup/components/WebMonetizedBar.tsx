import React, { FormEvent, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { styled } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import withStyles from '@material-ui/core/styles/withStyles'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import { Colors } from '../../shared-theme/colors'
import { PopupProps } from '../types'

const CoilBar = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderTop: `0.5px solid ${Colors.Grey89}`,
  backgroundColor: Colors.White,
  height: '40px',
  textAlign: 'center',
  position: 'relative',
  cursor: 'pointer'
})

const BarBadge = styled('img')({
  position: 'relative',
  top: '0.20em',
  marginRight: '4px',
  height: '14px',
  width: '13px'
})

const BarBlock = styled('img')({
  position: 'relative',
  top: '0.25em',
  marginRight: '3px',
  height: '14px',
  width: '14px'
})

const CoilMenu = withStyles({
  paper: {
    minWidth: '113px'
  }
})(Menu)

const BlockSwitch = withStyles({
  switchBase: {
    color: Colors.Grey89,
    '&$checked': {
      color: Colors.Green700
    },
    '&$checked + $track': {
      backgroundColor: Colors.Green800
    }
  },
  checked: {},
  track: {}
})(Switch)

type ClickEvent = FormEvent<HTMLElement>

export const WebMonetizedBar = (props: PopupProps) => {
  const { monetized, adapted, coilSite } = props.context.store
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const [blockOptions, setBlockOptions] = useState({
    option1: false,
    option2: false,
    option3: false
  })

  const handleBlockOptionsChange = (event: FormEvent<HTMLInputElement>) => {
    setBlockOptions({
      ...blockOptions,
      [event.currentTarget.name]: event.currentTarget.checked
    })
  }
  const handleMenuClick = (event: ClickEvent) => {
    setAnchorEl(event.currentTarget)
    setHovered(true)
  }

  const handleMenuClose = (event: ClickEvent) => {
    setAnchorEl(null)
    setHovered(false)
  }

  if (coilSite && !monetized) {
    return null
  } else {
    // TODO: adapted here should mean adaptable
    const contentOrSite = adapted ? 'content' : 'site'
    return (
      <CoilBar
        onMouseMove={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseEnter={() => setHovered(true)}
      >
        <Typography variant='caption'>
          <a onClick={handleMenuClick}>
            {monetized &&
            (hovered || Object.values(blockOptions).some(Boolean)) ? (
              <BarBlock src='/res/block.svg' width='14' height='14' />
            ) : (
              <BarBadge
                src={monetized ? '/res/dollar.svg' : '/res/nodollar.svg'}
                width='13'
                height='14'
              />
            )}

            {adapted && monetized
              ? ' Coil can donate to this channel'
              : ' This ' + contentOrSite + ' is'}
            {monetized ? '' : ' not'}
            {monetized && adapted ? '' : ' Web-Monetized'}
          </a>
          <CoilMenu
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            PaperProps={{
              style: {
                transform: 'translateY(-16px) translateX(-18px)'
              }
            }}
            onClose={handleMenuClose}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            getContentAnchorEl={null}
          >
            <MenuItem dense divider component='a'>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <BlockSwitch
                      checked={blockOptions.option1}
                      onChange={handleBlockOptionsChange}
                      name='option1'
                    />
                  }
                  label='Disable Domain'
                />
              </FormGroup>
            </MenuItem>
            <MenuItem dense divider>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <BlockSwitch
                      checked={blockOptions.option2}
                      onChange={handleBlockOptionsChange}
                      name='option2'
                    />
                  }
                  label='Disable URL'
                />
              </FormGroup>
            </MenuItem>
            <MenuItem dense>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <BlockSwitch
                      checked={blockOptions.option3}
                      onChange={handleBlockOptionsChange}
                      name='option3'
                    />
                  }
                  label='Disable Payment Pointer'
                />
              </FormGroup>
            </MenuItem>
          </CoilMenu>
        </Typography>
      </CoilBar>
    )
  }
}
