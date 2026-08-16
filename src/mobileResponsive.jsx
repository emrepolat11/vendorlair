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

  .vl-mobile-list {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow: hidden !important;
  }

  .vl-mobile-list-row {
    display: grid !important;
    grid-template-columns: 40px minmax(0, 1fr) auto !important;
    grid-template-rows: auto auto !important;
    column-gap: 10px !important;
    row-gap: 6px !important;
    align-items: center !important;
    width: 100% !important;
    min-width: 0 !important;
    padding: 12px 12px !important;
    box-sizing: border-box !important;
  }

  .vl-mobile-list-row > * {
    min-width: 0 !important;
    max-width: 100% !important;
  }

  .vl-mobile-list-accent {
    position: absolute !important;
  }

  .vl-mobile-list-avatar {
    grid-column: 1 !important;
    grid-row: 1 / span 2 !important;
  }

  .vl-mobile-list-name {
    grid-column: 2 !important;
    grid-row: 1 !important;
    width: auto !important;
    min-width: 0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    font-size: 15px !important;
  }

  .vl-mobile-list-status {
    grid-column: 3 !important;
    grid-row: 1 !important;
    justify-self: end !important;
    white-space: nowrap !important;
  }

  .vl-mobile-list-category {
    grid-column: 2 !important;
    grid-row: 2 !important;
    justify-self: start !important;
    width: fit-content !important;
    max-width: 100% !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .vl-mobile-list-edit {
    grid-column: 3 !important;
    grid-row: 2 !important;
    justify-self: end !important;
    width: auto !important;
    white-space: nowrap !important;
  }

  .vl-mobile-list-secondary {
    display: none !important;
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

  .vl-action-centre-panel {
    left: 14px !important;
    right: 14px !important;
    width: auto !important;
    max-width: none !important;
    box-sizing: border-box !important;
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

const CATEGORY_LABELS = [
  'Marketing','Finance','Legal','Logistics','Design','Consulting','IT Support',
  'Accounting & Tax','Payroll','Advertising & Media','Real Estate & Office',
  'Insurance','Energy & Utilities','Quality & Compliance','Other'
]

const STATUS_LABELS = ['Active', 'Inactive', 'On hold']

function markListRows(root, allDivs) {
  const listContainer = allDivs.find(el =>
    el.style.display === 'flex' &&
    el.style.flexDirection === 'column' &&
    el.style.borderRadius === '12px' &&
    el.style.overflow === 'hidden' &&
    el.children.length > 0 &&
    Array.from(el.children).some(child => child.style?.alignItems === 'center' && child.style?.gap === '12px')
  )

  if (!listContainer) return
  listContainer.classList.add('vl-mobile-list')

  Array.from(listContainer.children).forEach(row => {
    if (row.tagName !== 'DIV' || row.style.alignItems !== 'center') return
    row.classList.add('vl-mobile-list-row')

    const children = Array.from(row.children)
    let nameTagged = false
    let statusTagged = false
    let categoryTagged = false
    let editTagged = false

    children.forEach(child => {
      child.classList.remove(
        'vl-mobile-list-accent','vl-mobile-list-avatar','vl-mobile-list-name',
        'vl-mobile-list-status','vl-mobile-list-category','vl-mobile-list-edit','vl-mobile-list-secondary'
      )

      const text = (child.textContent || '').trim()

      if (child.style.position === 'absolute' && child.style.width === '2px') {
        child.classList.add('vl-mobile-list-accent')
        return
      }

      if ((child.style.width === '30px' && child.style.height === '30px') || child.style.flexShrink === '0') {
        child.classList.add('vl-mobile-list-avatar')
        return
      }

      if (!nameTagged && child.style.fontFamily.includes('Cormorant')) {
        child.classList.add('vl-mobile-list-name')
        nameTagged = true
        return
      }

      if (!statusTagged && STATUS_LABELS.includes(text)) {
        child.classList.add('vl-mobile-list-status')
        statusTagged = true
        return
      }

      if (!categoryTagged && CATEGORY_LABELS.some(label => text.includes(label))) {
        child.classList.add('vl-mobile-list-category')
        categoryTagged = true
        return
      }

      if (!editTagged && child.tagName === 'BUTTON' && text === 'Edit') {
        child.classList.add('vl-mobile-list-edit')
        editTagged = true
        return
      }

      child.classList.add('vl-mobile-list-secondary')
    })
  })
}

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

  markListRows(root, allDivs)

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
