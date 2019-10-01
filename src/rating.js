const template = document.createElement('template');
template.innerHTML = `
<style>
div {
    display: flex;
    justify-content: center;
}
div[disabled] {
    filter: grayscale(1);
    pointer-events: none;
}
div::slotted > .rating-item {
    background: none;
}

div > .rating-item:hover ~ .rating-item:before{
    filter: none;
}

.rating-item {
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 166"><polygon fill="greenyellow" points="83 26.8 65.7 61.8 27.1 67.4 55 94.7 48.5 133.2 83 115 117.5 133.2 111 94.7 138.9 67.4 100.3 61.8 83 26.8 83 26.8"/></svg>');
    background-repeat: no-repeat;
    width: 60px;
    height: 60px;
    filter: grayscale(100%);
    cursor: pointer;
}
.rating-item.filled {
    filter: none;
}
</style>
<div>
    <slot></slot>
</div>
`;

export class Rating extends HTMLElement {
    static get observedAttributes() {
        return ['max-rating', 'rating', 'disabled'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.element = this.shadowRoot.querySelector('div');

        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', e => {
            console.log(slot.assignedNodes());
        });
    }

    // Properties
    get maxRating() {
        return this.getAttribute('max-rating');
    }

    set maxRating(value) {
        this.setAttribute('max-rating', value);
    }

    get rating() {
        return this.getAttribute('rating');
    }

    set rating(value) {
        this.setAttribute('rating', value);
    }

    get disabled() {
        const result = this.getAttribute('disabled');
        return result === 1 || result === true || result === 'true' || result === 'disabled' ? 'disabled' : false;
    }

    set disabled(value) {
        this.setDisabled(this, value);
    }

    setDisabled(target, value) {
        if (value === 1 || value === true || value === 'true' || value === 'disabled') {
            target.setAttribute('disabled', 'disabled');
            return;
        }

        target.removeAttribute('disabled');
    }


    changeRating(event) {
        this.rating = event;
        this.updateRating();
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: this.rating }));
    }

    connectedCallback() {
        // set default value
        if (!this.maxRating) {
            this.maxRating = 5;
        }
        this.render();
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this.render();
    }

    render() {
        this.element.innerHTML = '';
        for (let i = 0; i < this.maxRating; i++) {
            this.createRatingStars(i < this.rating, i + 1);
        }
        this.setDisabled(this.element, this.disabled);
    }

    // refactor this, maybe here is a sweeter way to do this
    createRatingStars(filled, i) {
        const ratingTemplate = document.createElement('div');
        ratingTemplate.className = filled ? `rating-item item-${i} filled` : `rating-item item-${i}`;

        this.element.appendChild(ratingTemplate);
        let item = this.element.getElementsByClassName(`item-${i}`)[0];
        item.addEventListener('click', value => {
            this.changeRating(i);
        });
    }

    updateRating() {
        for (let i = 0; i < this.maxRating; i++) {
            let currentRating = i + 1;
            let item = this.element.getElementsByClassName(`item-${currentRating}`)[0];
            if (currentRating <= this.rating) {
                if (item.className.indexOf('filled') < 0) {
                    item.className = item.className + ' filled';
                }
            } else {
                item.className = item.className.replace('filled', '');
            }
        }
    }
}

window.customElements.define('web-component-rating', Rating);
