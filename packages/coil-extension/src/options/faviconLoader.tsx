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

export const FaviconLoader = (props: { src: string | undefined }) => {
  const { src } = props
  const [imgPath, setImgPath] = useState(src)
  const classes = useStyles()

  useEffect(() => {
    if (src === undefined) {
      setImgPath('../res/pp.svg')
    }
  }, [])

  const onFaviconError = () => {
    setImgPath('../res/no-favicon.svg')
  }

  return (
    <img className={classes.favicon} src={imgPath} onError={onFaviconError} />
  )
}
