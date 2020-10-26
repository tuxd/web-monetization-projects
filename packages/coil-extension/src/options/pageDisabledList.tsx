import React from 'react'
import {
  Grid,
  Button,
  Typography,
  styled,
  makeStyles,
  SvgIcon
} from '@material-ui/core'

import { Colors } from '../shared-theme/colors'

// styles for responsiveness
const useStyles = makeStyles(theme => {
  return {
    centerElement: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row'
    },
    domainRow: {
      marginTop: '12px'
    },
    domainH4: {
      display: 'inline-flex',
      color: Colors.Grey800,
      marginTop: '5px',
      fontSize: '20px',
      '& a': {
        color: 'inherit',
        textDecoration: 'none',
        transition: 'color 0.2s ease-in-out'
      },
      '&:hover': {
        color: Colors.Grey700
      }
    },
    favicon: {
      margin: '9px 8px 8px 0'
    },
    disabledListItem: {
      alignItems: 'center'
    },
    [theme.breakpoints.up('sm')]: {
      domainH4: {
        fontSize: '16px',
        margin: '6px 0'
      },
      centerElement: {
        justify: 'center',
        flexDirection: 'column'
      },
      favicon: {
        margin: '7px 8px 8px 0'
      },
      domainRow: {
        marginTop: 0
      }
    }
  } as const
})

const UnblockIcon = () => {
  return (
    <SvgIcon>
      <path
        id='unblock'
        d='M6,12a5.966,5.966,0,0,1-2.336-.471,6.032,6.032,0,0,1-.887-.466L4.545,9.3A3.619,3.619,0,0,0,7.553,9.25L6.072,7.769l1.7-1.7L9.25,7.553A3.62,3.62,0,0,0,9.3,4.545l1.768-1.768a6.034,6.034,0,0,1,.466.887A6,6,0,0,1,6,12ZM.934,9.218h0A6,6,0,0,1,9.217.934L7.449,2.7a3.627,3.627,0,0,0-3,.048L5.924,4.227l-1.7,1.7L2.75,4.447a3.62,3.62,0,0,0-.048,3L.934,9.217Z'
        fill='#cd6567'
      />
    </SvgIcon>
  )
}

const Favicon = styled('img')({
  width: '16px'
})

const Row = styled('div')({
  margin: '4px 8px 0',
  padding: '8px 16px',
  borderBottom: `2px solid ${Colors.Grey50}`,
  flexDirection: 'row'
})

const DomainRow = styled(Grid)({
  flexDirection: 'row'
})

const ButtonUnblock = styled(Button)({
  color: Colors.White,
  background: Colors.Grey800,
  paddingLeft: '20px',
  paddingRight: '20px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  '& .MuiButton-startIcon': {
    marginRight: 0,
    '& svg': {
      position: 'relative',
      top: '5px',
      '& path': {
        transition: 'fill 0.2s ease-in-out'
      }
    }
  },
  '&:hover': {
    '& .MuiButton-startIcon': {
      '& svg path': {
        fill: Colors.White
      }
    },
    background: Colors.Green800
  }
})

export const PageDisabledList = () => {
  const classes = useStyles()

  return (
    <>
      <Row>
        <Grid container direction='row' className={classes.disabledListItem}>
          <Grid item xs={12} sm={5}>
            <DomainRow container direction='row' className={classes.domainRow}>
              <Grid item>
                <Favicon
                  className={classes.favicon}
                  width='16'
                  src={'../../res/buzzfeed.ico'}
                />
              </Grid>
              <Grid item>
                <Typography variant='h4' className={classes.domainH4}>
                  <a href='http://www.buzzfeed.com'>http://www.buzzfeed.com</a>
                </Typography>
              </Grid>
            </DomainRow>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Grid
              container
              justify='center'
              alignItems='center'
              direction='row'
            >
              URL
            </Grid>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Grid
              container
              justify='center'
              alignItems='center'
              direction='row'
            >
              <Grid item xs={6} sm={12}>
                <div className={classes.centerElement}>
                  <ButtonUnblock startIcon={<UnblockIcon />}>
                    Unblock
                  </ButtonUnblock>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Row>

      <Row>
        <Grid container direction='row' className={classes.disabledListItem}>
          <Grid item xs={12} sm={5}>
            <DomainRow container direction='row' className={classes.domainRow}>
              <Grid item>
                <Favicon
                  className={classes.favicon}
                  width='16'
                  src={'../../res/masterclass.ico'}
                />
              </Grid>
              <Grid item>
                <Typography variant='h4' className={classes.domainH4}>
                  <a href='http://www.masterclass.com'>
                    http://www.masterclass.com
                  </a>
                </Typography>
              </Grid>
            </DomainRow>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Grid
              container
              justify='center'
              alignItems='center'
              direction='row'
            >
              URL
            </Grid>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Grid
              container
              justify='center'
              alignItems='center'
              direction='row'
            >
              <Grid item xs={6} sm={12}>
                <div className={classes.centerElement}>
                  <ButtonUnblock startIcon={<UnblockIcon />}>
                    Unblock
                  </ButtonUnblock>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Row>
    </>
  )
}
