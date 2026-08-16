import { useEffect } from 'react'

const MOBILE_CSS = `
@media (max-width: 700px) {
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }

  .vl-mobile-topbar {
    height: auto !important;
    min-height: 0 !important;
    padding: 12px 14px !important;
    gap: 10px !important;
    flex-direction: column !important;
    align-items: stretch !important;
    box-sizing: border-box !important;
  }

  .vl-mobile-brand-row {
    width: 100% !important;
    min-width: 0 !important;
  }

  .vl-mobile-actions {
    width: 100% !important;
    display: grid !important;
    grid-template-columns: auto 1fr 1fr !important;
    gap: 7px !important;
    align-items: stretch !important;
    min-width: 0 !important;
  }

  .vl-mobile-actions > * {
    min-width: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    box-sizing: border-box !important;
    white-space: normal !important;
    text-align: center !important;
  }

  .vl-mobile-filterbar {
    padding: 12px 14px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
    box-sizing: border-box !important;
  }

  .vl-mobile-filter-left {
    width: 100% !important;
    min-width: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 9px !important;
  }

  .vl-mobile-search-wrap,
  .vl-mobile-search {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
  }

  .vl-mobile-categories {
    width: 100% !important;
    min-width: 0 !important;
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
  }

  .vl-mobile-filter-right {
    width: 100% !important;
    min-width: 0 !important;
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 8px !important;
    align-items: stretch !important;
  }

  .vl-mobile-filter-right > * {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .vl-mobile-main {
    padding: 18px 14px 96px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }

  .vl-mobile-stats {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 9px !important;
    width: 100% !important;
    min-width: 0 !important;
  }

  .vl-mobile-stats > * {
    min-width: 0 !important;
    width: auto !important;
    overflow-wrap: anywhere !important;
  }

  .vl-mobile-vendor-grid {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    width: 100% !important;
    min-width: 0 !important;
  }

  .vl-mobile-vendor-grid > * {
    min-width: 0 !important;
    max-width: 100% !important;
  }

  .vl-mobile-action-centre {
    right: 14px !important;
    left: auto !important;
    bottom: 14px !important;
    max-width: calc(100vw - 28px) !important;
    padding: 11px 16px !important;
    font-size: 13px !important;
    white-space: nowrap !important;
  }
}

@media (max-width: 420px) {
  .vl-mobile-actions {
    grid-template-columns: 1fr 1fr !important;
  }

  .vl-mobile-actions > span:first-child {
    grid-column: 1 / -1 !important;
  }

  .vl-mobile-topbar button,
  .vl-mobile-topbar span {
    font-size: 11px !important;
  }

  .vl-mobile-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}
`

function applyMobileClasses() {
  const root = document.getElementById('root')
  if (!root) return

  const allDivs = Array.from(root.querySelectorAll('div'))

  const searchInput = root.querySelector('input[placeholder*="Search vendors"]')
  if (!searchInput) return

  searchInput.classList.add('vl-mobile-search')
  if (searchInput.parentElement) searchInput.parentElement.classList.add('vl-mobile-search-wrap')

  const topBar = allDivs.find(el =>
    el.style.position === 'sticky' &&
    el.style.top === '0px' &&
    el.style.height === '60px' &&
    el.style.justifyContent === 'space-between'
  )

  if (topBar) {
    topBar.classList.add('vl-mobile-topbar')
    if (topBar.children[0]) topBar.children[0].classList.add('vl-mobile-brand-row')
    if (topBar.children[1]) topBar.children[1].classList.add('vl-mobile-actions')
  }

  const filterBar = allDivs.find(el =>
    el.contains(searchInput) &&
    el.style.justifyContent === 'space-between' &&
    el.style.flexWrap === 'wrap' &&
    el.style.padding.includes('32px')
  )

  if (filterBar) {
    filterBar.classList.add('vl-mobile-filterbar')
    const children = Array.from(filterBar.children).filter(el => el.tagName === 'DIV')
    if (children[0]) {
      children[0].classList.add('vl-mobile-filter-left')
      const leftChildren = Array.from(children[0].children).filter(el => el.tagName === 'DIV')
      const categories = leftChildren.find(el => el !== searchInput.parentElement && el.style.flexWrap === 'wrap')
      if (categories) categories.classList.add('vl-mobile-categories')
    }
    if (children[1]) children[1].classList.add('vl-mobile-filter-right')

    const main = filterBar.nextElementSibling
    if (main?.tagName === 'DIV') main.classList.add('vl-mobile-main')
  }

  const statsGrid = allDivs.find(el =>
    el.style.display === 'grid' &&
    el.style.gridTemplateColumns === 'repeat(4, 1fr)' &&
    el.children.length === 4
  )
  if (statsGrid) statsGrid.classList.add('vl-mobile-stats')

  const vendorGrid = allDivs.find(el =>
    el.style.display === 'grid' &&
    el.style.gridTemplateColumns.includes('minmax(290px')
  )
  if (vendorGrid) vendorGrid.classList.add('vl-mobile-vendor-grid')

  Array.from(root.querySelectorAll('button')).forEach(button => {
    if ((button.textContent || '').includes('Action Centre')) {
      button.classList.add('vl-mobile-action-centre')
    }
  })
}

export default function MobileResponsive() {
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'vl-mobile-responsive'
    style.textContent = MOBILE_CSS
    document.head.appendChild(style)

    const run = () => window.requestAnimationFrame(applyMobileClasses)
    run()

    const observer = new MutationObserver(run)
    const root = document.getElementById('root')
    if (root) observer.observe(root, { childList: true, subtree: true })

    window.addEventListener('resize', run)
    const timer = window.setInterval(run, 750)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', run)
      window.clearInterval(timer)
      document.getElementById('vl-mobile-responsive')?.remove()
    }
  }, [])

  return null
}
