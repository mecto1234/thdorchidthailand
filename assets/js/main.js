'use strict';

const SITE_CONTACT = Object.freeze({
    whatsapp: '66825553113',
    email: 'thdorchidthailand@gmail.com'
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', () => {
    initScrollState();
    initMobileNavigation();
    initRevealAnimations();
    initFloatingContact();
    initProductFilters();
    initLightbox();
    initProductInquiry();
    initAccordions();
    initCopyButtons();
});

function initScrollState() {
    const header = document.getElementById('navbar');
    const floatingWidget = document.getElementById('floatingWidget');
    const hero = document.getElementById('hero');

    if (!header && !floatingWidget) return;

    const update = () => {
        const scrollY = window.scrollY;
        header?.classList.toggle('scrolled', scrollY > 40);

        if (floatingWidget) {
            const shouldShow = hero ? scrollY > Math.max(hero.offsetHeight - 150, 100) : true;
            floatingWidget.classList.toggle('visible', shouldShow);
        }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
}

function initMobileNavigation() {
    const menuButton = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('navMenu');

    if (!menuButton || !menu) return;

    const setOpen = (isOpen) => {
        menu.classList.toggle('open', isOpen);
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    menuButton.addEventListener('click', () => {
        setOpen(!menu.classList.contains('open'));
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setOpen(false);
    }, { passive: true });
}

function initRevealAnimations() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('active'));
        return;
    }

    const observer = new IntersectionObserver((entries, revealObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach((element) => observer.observe(element));
}

function initFloatingContact() {
    const button = document.getElementById('fabToggle');
    const popover = document.getElementById('widgetPopover');

    if (!button || !popover) return;

    const setOpen = (isOpen) => {
        popover.classList.toggle('active', isOpen);
        button.setAttribute('aria-expanded', String(isOpen));
    };

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        setOpen(!popover.classList.contains('active'));
    });

    document.addEventListener('click', (event) => {
        if (!popover.contains(event.target) && !button.contains(event.target)) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setOpen(false);
    });
}

function initProductFilters() {
    const buttons = Array.from(document.querySelectorAll('.filter-btn'));
    const cards = Array.from(document.querySelectorAll('.catalog-card'));

    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter || 'all';

            buttons.forEach((item) => {
                const selected = item === button;
                item.classList.toggle('active', selected);
                item.setAttribute('aria-pressed', String(selected));
            });

            cards.forEach((card) => {
                const shouldShow = filter === 'all' || card.dataset.category === filter;
                card.hidden = !shouldShow;
                if (shouldShow) card.classList.add('active');
            });
        });
    });
}

function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const image = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const closeButton = document.getElementById('lightboxClose');
    const previousButton = document.getElementById('lightboxPrev');
    const nextButton = document.getElementById('lightboxNext');
    const triggers = Array.from(document.querySelectorAll('[data-lightbox]'));

    if (!modal || !image || !caption || !closeButton || !triggers.length) return;

    let currentTrigger = null;
    let lastFocusedElement = null;

    const visibleTriggers = () => triggers.filter((trigger) => !trigger.closest('[hidden]'));

    const open = (trigger) => {
        if (!trigger) return;

        currentTrigger = trigger;
        lastFocusedElement = document.activeElement;
        const title = trigger.dataset.title || 'Image preview';

        image.src = trigger.dataset.lightbox || '';
        image.alt = title;
        caption.textContent = title;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
        closeButton.focus();
    };

    const close = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        image.src = '';
        currentTrigger = null;
        lastFocusedElement?.focus?.();
    };

    const move = (direction) => {
        const items = visibleTriggers();
        if (!items.length) return;

        let index = items.indexOf(currentTrigger);
        if (index < 0) index = 0;
        index = (index + direction + items.length) % items.length;
        open(items[index]);
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => open(trigger));
        trigger.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            open(trigger);
        });
    });

    closeButton.addEventListener('click', close);
    previousButton?.addEventListener('click', () => move(-1));
    nextButton?.addEventListener('click', () => move(1));

    modal.addEventListener('click', (event) => {
        if (event.target === modal) close();
    });

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('active')) return;

        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') move(-1);
        if (event.key === 'ArrowRight') move(1);
    });
}

function initProductInquiry() {
    const buttons = document.querySelectorAll('.btn-inquire');
    const popover = document.getElementById('widgetPopover');
    const fabButton = document.getElementById('fabToggle');
    const whatsappLink = document.getElementById('waDirectLink');
    const emailLink = document.getElementById('mailDirectLink');

    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const productName = button.dataset.product || 'orchid product';
            const whatsappMessage = encodeURIComponent(
                `Hello THD Orchid, I would like to inquire about wholesale pricing for "${productName}". Please share pricing, availability, and shipping details.`
            );
            const emailSubject = encodeURIComponent(`Wholesale Inquiry: ${productName}`);
            const emailBody = encodeURIComponent(
                `Dear THD Orchid Team,\n\nI would like to request wholesale pricing and shipping information for ${productName}.\n\nEstimated quantity / boxes: \nDestination: \nPreferred delivery date: \n\nThank you.`
            );

            if (whatsappLink) {
                whatsappLink.href = `https://wa.me/${SITE_CONTACT.whatsapp}?text=${whatsappMessage}`;
            }

            if (emailLink) {
                emailLink.href = `mailto:${SITE_CONTACT.email}?subject=${emailSubject}&body=${emailBody}`;
            }

            if (popover && fabButton) {
                popover.classList.add('active');
                fabButton.setAttribute('aria-expanded', 'true');
            } else {
                window.open(`https://wa.me/${SITE_CONTACT.whatsapp}?text=${whatsappMessage}`, '_blank', 'noopener,noreferrer');
            }
        });
    });
}

function initAccordions() {
    const items = Array.from(document.querySelectorAll('.accordion-item'));
    if (!items.length) return;

    const syncItem = (item) => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if (!header || !content) return;

        const isOpen = item.classList.contains('active');
        header.setAttribute('aria-expanded', String(isOpen));
        content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : '0px';
    };

    items.forEach((item) => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;

        syncItem(item);
        header.addEventListener('click', () => {
            item.classList.toggle('active');
            syncItem(item);
        });
    });

    window.addEventListener('resize', () => {
        items.filter((item) => item.classList.contains('active')).forEach(syncItem);
    }, { passive: true });
}

function initCopyButtons() {
    const buttons = document.querySelectorAll('[data-copy]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener('click', async () => {
            const text = button.dataset.copy || '';
            if (!text) return;

            const originalLabel = button.textContent;
            const copied = await copyText(text);

            button.textContent = copied ? 'Copied ✓' : 'Copy failed';
            button.classList.toggle('is-copied', copied);

            window.setTimeout(() => {
                button.textContent = originalLabel;
                button.classList.remove('is-copied');
            }, 1800);
        });
    });
}

async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        textarea.remove();
        return success;
    } catch (error) {
        console.error('Copy failed:', error);
        return false;
    }
}
