import React, { FormEvent, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { styled } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import withStyles from '@material-ui/core/styles/withStyles'
import MenuItem from '@material-ui/core/MenuItem'

import { Colors } from '../../shared-theme/colors'
import { PopupProps } from '../types'

const CoilBar = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderTop: `0.5px solid ${Colors.Grey89}`,
  backgroundColor: Colors.White,
  height: '40px',
  textAlign: 'center'
})

const BarBadge = styled('img')({
  position: 'relative',
  top: '0.13em',
  marginRight: '4px'
})

const CoilMenu = withStyles({
  paper: {
    minWidth: '113px'
  }
})(Menu)

type ClickEvent = FormEvent<HTMLElement>

export const WebMonetizedBar = (props: PopupProps) => {
  const { monetized, adapted, coilSite } = props.context.store
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const handleMenuClick = (event: ClickEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (event: ClickEvent) => {
    setAnchorEl(null)
  }

  if (coilSite && !monetized) {
    return null
  } else {
    // TODO: adapted here should mean adaptable
    const contentOrSite = adapted ? 'content' : 'site'
    return (
      <CoilBar>
        <Typography variant='caption'>
          {monetized && hovered ? (
            <span>
              <a
                style={{
                  position: 'relative',
                  top: '-1px',
                  height: '14px',
                  width: '13px'
                }}
                onMouseLeave={() => setHovered(false)}
                onClick={handleMenuClick}
              >
                🚫
              </a>
            </span>
          ) : (
            <BarBadge
              onMouseEnter={() => setHovered(true)}
              src='/res/dollar.svg'
              width='13'
              height='14'
            />
          )}
          {adapted && monetized
            ? ' Coil can donate to this channel'
            : ' This ' + contentOrSite + ' is'}
          {monetized ? '' : ' not'}
          {monetized && adapted ? '' : ' Web-Monetized'}
        </Typography>
        <CoilMenu
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          onClose={handleMenuClose}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
        >
          <MenuItem dense divider>
            a
          </MenuItem>
          <MenuItem dense divider>
            b
          </MenuItem>
          <MenuItem dense>c</MenuItem>
        </CoilMenu>
      </CoilBar>
    )
  }
}
