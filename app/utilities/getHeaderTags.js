import React from 'react'
import Helmet from 'react-helmet'

import { GENERAL, ROUTES } from 'configs/preferences'

const {
  DOMAIN_NAME,
  HEADER_IMG_URL,
  HEADER_IMG_WIDTH,
  HEADER_IMG_HEIGHT
} = GENERAL

const getHeaderTags = componentName => {
  const {
    pattern, // <-- NO DEFAULTS, MUST SPECIFY
    title,
    description,
    rating,
    type,
    languageCode,
    imageURL,
    imageWidth,
    imageHeight,
    twitterCardType
  } = ROUTES[componentName]

  const canonicalURL = `${DOMAIN_NAME}${pattern}`
  const pageTitle = title || componentName
  const socialImg = imageURL || HEADER_IMG_URL
  const desc = description || `${pageTitle} Page`

  const link = [{ rel: 'canonical', href: canonicalURL }]

  const meta = [
    // defaults
    { name: 'url', content: canonicalURL },
    { name: 'description', content: desc },
    { name: 'abstract', content: desc },
    { name: 'rating', content: rating || 'general' },
    // Twitter
    { name: 'twitter:card', content: twitterCardType || 'summary' },
    { name: 'twitter:url', content: canonicalURL },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: socialImg },
    // Open Graph
    { property: 'og:url', content: canonicalURL },
    { property: 'og:type', content: type || 'website' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: desc },
    { property: 'og:locale', content: languageCode || 'en_US' },
    { property: 'og:image', content: socialImg },
    { property: 'og:image:width', content: imageWidth || HEADER_IMG_WIDTH },
    { property: 'og:image:height', content: imageHeight || HEADER_IMG_HEIGHT },
    // itemprops ?
    { itemProp: 'name', content: pageTitle },
    { itemProp: 'description', content: desc },
    { itemProp: 'image', content: socialImg }
  ]

  return (
    <Helmet
      title={title}
      meta={meta}
      link={link}
    />
  )
}

export default getHeaderTags
