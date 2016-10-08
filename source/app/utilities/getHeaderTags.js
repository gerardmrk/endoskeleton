import React from 'react'
import Helmet from 'react-helmet'

import ROUTES from '#configs/routes'
import APP_META from '#configs/app.meta'

const {
  DOMAIN_NAME,
  SOC_IMG_URL,
  SOC_IMG_WIDTH,
  SOC_IMG_HEIGHT
} = APP_META

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
    twitterCardType,
    googleTranslate,
    articleAuthor
  } = ROUTES[componentName]

  const canonicalURL = `${DOMAIN_NAME}${pattern}`
  const pageTitle = title || componentName
  const socialImg = imageURL || SOC_IMG_URL
  const desc = description || `${pageTitle} Page`

  const link = [{ rel: 'canonical', href: canonicalURL }]

  const meta = [
    /* --- VANILLA --- */
    { name: 'url', content: canonicalURL },
    { name: 'description', content: desc },
    { name: 'abstract', content: desc },
    { name: 'subject', content: desc },
    { name: 'topic', content: desc },
    { name: 'summary', content: desc },
    { name: 'rating', content: rating || 'general' },
    /* --- TWITTER --- */
    { name: 'twitter:card', content: twitterCardType || 'summary' },
    { name: 'twitter:url', content: canonicalURL },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: socialImg },
    /* --- OPEN GRAPH --- */
    { property: 'og:url', content: canonicalURL },
    { property: 'og:type', content: type || 'website' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: desc },
    { property: 'og:locale', content: languageCode || 'en_US' },
    { property: 'og:image', content: socialImg },
    { property: 'og:image:width', content: imageWidth || SOC_IMG_WIDTH },
    { property: 'og:image:height', content: imageHeight || SOC_IMG_HEIGHT }
  ]

  if (googleTranslate && googleTranslate === 'notranslate') {
    meta.push({ name: 'google', content: 'notranslate' })
  }

  if (articleAuthor) {
    meta.push({ property: 'article:author', content: articleAuthor })
  }

  return (
    <Helmet
      title={title}
      meta={meta}
      link={link}
    />
  )
}

export default getHeaderTags
