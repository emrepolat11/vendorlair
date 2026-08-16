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
    min-height: 60px !important;
    padding: 10px 14px !important;
    gap: 9px !important;
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .vl-mobile-topbar > .vl-mobile-actions {
    width: 100% !important;
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: flex-start !important;
    gap: 6px !important;
    min-width: 0 !important;
  }

  .vl-mobile-topbar > .vl-mobile-actions > * {
    max-width: 100% !important;
  }

  .vl-mobile-filterbar {
    padding: 12px 14px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
  }

  .vl-mobile-filter-left {
    width: 100% !important;
    min-width: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 9px !important;
  }

  .vl-mobile-search-wrap {
    width: 100% !important;
  }

  .vl-mobile-search {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
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
    padding: 18px 14px 90px !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }

  .vl-mobile-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 9px !important;
  }

  [style*="minmax(290px"] {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .vl-mobile-action-centre {
    right: 14px !important;
    bottom: 14px !important;
    max-width: calc(100vw - 28px) !important;
    white-space: nowrap !important;
  }
}

@media (max-width: 420px) {
  .vl-mobile-filter-right {
    grid-template-columns: 1fr 1fr !important;
  }

  .vl-mobile-topbar button,
  .vl-mobile-topbar span {
    font-size: 11px !important;
  }
}
`

function applyMobileClasses() {
  const root = document.getElementById('root')
  if (!root) return

  const searchInput = root.querySelector('input[placeholder*="Search vendors"]')
  if (!searchInput) return

  const filterBar = searchInput.closest('div[style*="border-bottom"]')
  if (filterBar) {
    filterBar.classList.add('vl-mobile-filterbar')
    const directChildren = Array.from(filterBar.children).filter(el => el.tagName === 'DIV')
    if (directChildren[0]) directChildren[0].classList.add('vl-mobile-filter-left')
    if (directChildren[1]) directChildren[1].classList.add('vl-mobile-filter-right')
  }

  searchInput.classList.add('vl-mobile-search')
  if (searchInput.parentElement) searchInput.parentElement.classList.add('vl-mobile-search-wrap')

  const dashboardDivs = Array.from(root.querySelectorAll('div'))
  const topBar = dashboardDivs.find(el => {
    const text = el.textContent || ''
    return text.includes('VendorLair') && text.includes('Add vendor') && text.includes('Log out') && el.children.length <= 4
  })

  if (topBar) {
    topBar.classList.add('vl-mobile-topbar')
    const actionGroup = Array.from(topBar.children).find(el => {
      const text = el.textContent || ''
      return text.includes('Add vendor') && text.includes('Log out')
    })
    if (actionGroup) actionGroup.classList.add('vl-mobile-actions')
  }

  if (filterBar) {
    let main = filterBar.nextElementSibling
    while (main && main.tagName !== 'DIV') main = main.nextElementSibling
    if (main) main.classList.add('vl-mobile-main')
  }

  const statsGrid = dashboardDivs.find(el => {
    const text = el.textContent || ''
    return text.includes('Total vendors') && text.includes('Categories') && text.includes('Avg rating') && el.children.length === 4
  })
  if (statsGrid) statsGrid.classList.add('vl-mobile-stats')

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

    applyMobileClasses()
    const observer = new MutationObserver(applyMobileClasses)
    observer.observe(document.getElementById('root'), { childList: true, subtree: true })

    const timer = window.setInterval(applyMobileClasses, 1000)

    return () => {
      observer.disconnect()
      window.clearInterval(timer)
      document.getElementById('vl-mobile-responsive')?.remove()
    }
  }, [])

  return null
}
