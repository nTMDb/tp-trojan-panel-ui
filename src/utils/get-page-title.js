import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Trojan Panel  mini'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
