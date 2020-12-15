let resizeObserver = null;
const CLASS_LIST = {
    MODAL: 'modal',
    MODAL_ACTIVE: 'modal--active',
    MODAL_HAS_SCROLL: 'modal--has-scroll',
    MODAL_DIALOG_BODY: 'modal__dialog-body',
    TRIGGER_OPEN: 'js-modal-open',
    TRIGGER_CLOSE: 'js-button-close'
}

const showScroll = (e) => {
    if (e.propertyName === 'transform') {
        document.body.style.paddingRight = ''
        document.body.style.overflow = 'visible'

        e.target.closest(`.${CLASS_LIST.MODAL}`).removeEventListener('transitionend', showScroll)
    }
}

document.addEventListener('click', (e) => {
    // open
    if (e.target.closest(`.${CLASS_LIST.TRIGGER_OPEN}`)) {
        e.preventDefault();
        const target = e.target.closest(`.${CLASS_LIST.TRIGGER_OPEN}`)
        const modalId = target.getAttribute('href').replace('#', '')
        const modal = document.getElementById(modalId)

        
        document.body.style.paddingRight = `${getScrollBarWidth()}px`
        document.body.style.overflow = 'hidden'

        modal.classList.add(CLASS_LIST.MODAL_ACTIVE)

        bindResizeObserver(modal)
    }
    // close
    if (
        e.target.closest(`.${CLASS_LIST.TRIGGER_CLOSE}`) ||
        e.target.classList.contains(CLASS_LIST.MODAL_ACTIVE)
        ) {
        e.preventDefault();

        const modal = e.target.closest(`.${CLASS_LIST.MODAL}`)
        modal.classList.remove(CLASS_LIST.MODAL_ACTIVE)

        unbindResizeObserver(modal)
        modal.addEventListener('transitionend', showScroll)
    }
})

const getScrollBarWidth = () => {
    const item = document.createElement('div')

    item.style.position = 'absolute'
    item.style.top = '-99999px'
    item.style.width = '50px'
    item.style.height = '50px'
    item.style.overflow = 'scroll'
    item.style.visibility = 'hidden'

    document.body.appendChild(item)
    const scrollBarWidth = item.offsetWidth - item.clientWidth
    document.body.removeChild(item)

    return scrollBarWidth
}

const bindResizeObserver = (modal) => {
    const content = modal.querySelector(`.${CLASS_LIST.MODAL_DIALOG_BODY}`)
    
    const toggleShadows = () => {
        modal.classList.toggle(
            CLASS_LIST.MODAL_HAS_SCROLL,
            content.scrollHeight > content.clientHeight
        )
    }

    resizeObserver = new ResizeObserver(toggleShadows)
    resizeObserver.observe(content)
}

const unbindResizeObserver = (modal) => {
    const content = modal.querySelector(`.${CLASS_LIST.MODAL_DIALOG_BODY}`)
    resizeObserver.unobserve(content)
    resizeObserver = null
}

document.getElementById('js-add-content-temp').addEventListener('click', (e) => {
    const div = document.createElement('div')
    div.textContent = 'Text content'
    div.style.height = '1000px'
    document.querySelector(`.${CLASS_LIST.MODAL_DIALOG_BODY}`).appendChild(div)
})
