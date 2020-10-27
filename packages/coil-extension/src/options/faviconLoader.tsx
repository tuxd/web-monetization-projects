import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  favicon: {
    marginRight: '10px',
    display: 'flex',
    width: '16px',
    height: '16px',
    flex: 1,
    justifyContent: 'center'
  }
})

export const FaviconLoader = (props: {
  origin: string
  src: string | undefined
}) => {
  // url or payment pointer
  const favicon =
    props.src ||
    `${new URL(origin.replace(/^$/, 'https://')).origin}/favicon.ico`

  // Start with /no-favicon
  const [imgPath, setImgPath] = useState('/res/no-favicon.svg')
  const classes = useStyles()

  function onError() {
    if (origin.startsWith('$')) {
      setImgPath('/res/pp.svg')
    }
  }

  return (
    <>
      <img
        style={{ display: 'none' }}
        src={favicon}
        onLoad={() => setImgPath(favicon)}
        onError={onError}
      />
      <img className={classes.favicon} src={imgPath} />
    </>
  )
}
