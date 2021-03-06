import React, { FormEvent, useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import More from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core'

import { Colors } from '../../shared-theme/colors'
import { PopupProps } from '../types'

const Flex = styled.div`
  flex: 1;
`

const Muted = styled.p`
  color: ${Colors.Grey500};
  font-size: 14px;
`

const CoilImg = styled.img`
  margin-right: 8px;
`

const CoilToolbar = styled(Toolbar)`
  background-color: ${Colors.White};
  border-bottom: 0.5px solid ${Colors.Grey89};
  height: 56px;
`

const CoilMenu = withStyles({
  paper: {
    minWidth: '113px'
  }
})(Menu)

type ClickEvent = FormEvent<HTMLElement>

export const AccountBar = (props: PopupProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleMenuClick = (event: ClickEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (event: ClickEvent) => {
    setAnchorEl(null)
  }
  const context = props.context
  const {
    coilDomain,
    store: { loggedIn, user },
    runtime: { tabOpener }
  } = context

  const onExploreClick = tabOpener(`${coilDomain}/explore`)
  const onAboutClick = tabOpener(`${coilDomain}/about`)
  const onSettingsClick = tabOpener(`${coilDomain}/settings`)

  return (
    <CoilToolbar>
      <CoilImg width='24' height='24' src='/res/CoilLogo.svg' alt='' />
      {loggedIn && user ? (
        <Typography variant='body1'>{user.fullName}</Typography>
      ) : (
        <Muted>Not Logged in</Muted>
      )}
      <Flex />
      <IconButton aria-label='Menu' onClick={handleMenuClick}>
        <More />
      </IconButton>

      <CoilMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        getContentAnchorEl={null}
      >
        <MenuItem dense component='a' onClick={onExploreClick} target='_blank'>
          <Typography variant='caption'>Explore</Typography>
        </MenuItem>

        <MenuItem
          divider
          dense
          component='a'
          onClick={onAboutClick}
          target='_blank'
        >
          <Typography variant='caption'>About</Typography>
        </MenuItem>

        <MenuItem dense component='a' onClick={onSettingsClick} target='_blank'>
          <Typography variant='caption'>Settings</Typography>
        </MenuItem>
      </CoilMenu>
    </CoilToolbar>
  )
}
