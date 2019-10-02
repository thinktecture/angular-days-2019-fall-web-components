const template = document.createElement('template');
document.body.appendChild(template);
template.innerHTML = `
<style>
div {
    display: flex;
    justify-content: center;
    flex-direction: row-reverse;
}
img {
    width: 60px;
    height: 60px;
}
slot {
   display: none; 
}
div[disabled] {
    filter: grayscale(1);
    pointer-events: none;
}
div ::slotted(img) {
    width: 60px;
    height: 60px;
}
div ::slotted(p) {
    font-size: 16px;
}

.rating-item {
    filter: grayscale(100%);
    cursor: pointer;
}

.rating-item.filled {
    filter: none;
}

.rating-item:hover, .rating-item:hover ~ .rating-item {
    filter: none;
}

.rating-star {
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 166"><polygon fill="greenyellow" points="83 26.8 65.7 61.8 27.1 67.4 55 94.7 48.5 133.2 83 115 117.5 133.2 111 94.7 138.9 67.4 100.3 61.8 83 26.8 83 26.8"/></svg>');
    background-repeat: no-repeat;
    width: 60px;
    height: 60px;
}
</style>
<div part="rating">
    <slot name="rating-icon">
        <div class="rating-star"></div>
    </slot>
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

        const slot = this.shadowRoot.querySelector('slot[name="rating-icon"]');
        this.slotNode = slot.childNodes[1];
        slot.addEventListener('slotchange', e => {
            const assignedNodes = slot.assignedNodes();
            if (assignedNodes[0]) {
                this.slotNode = assignedNodes[0];
                this.render();
            }
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
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: this.rating }));
        this.render();
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.log('attribute changed', name, oldVal, newVal);
        if (oldVal === newVal) {
            return;
        }

        switch (name) {
            case 'rating':
                this.updateRating();
                break;
            case 'disabled':
                this.setDisabled(this.element, this.disabled);
                break;
            default:
                this.render();
                break;
        }
    }

    render() {
        this.clearRatingElements();
        let index = 1;
        for (let i = this.maxRating; i > 0; i--) {
            i = parseInt(i);
            const filled = this.rating ? this.rating >= i : false;
            this.createRatingStar(filled, i);
            index++;
        }
        this.setDisabled(this.element, this.disabled);
    }

    clearRatingElements() {
        const nodes = this.element.getElementsByClassName('rating-item');
        if (nodes) {
            while (nodes.length > 0) {
                nodes[0].parentNode.removeChild(nodes[0]);
            }
        }
    }

    createRatingStar(filled, itemId) {
        const ratingTemplate = document.createElement('div');
        ratingTemplate.className = filled ? `rating-item item-${itemId} filled` : `rating-item item-${itemId}`;
        ratingTemplate.appendChild(this.slotNode.cloneNode(true));
        this.element.appendChild(ratingTemplate);
        let item = this.element.getElementsByClassName(`item-${itemId}`)[0];
        item.addEventListener('click', value => {
            this.changeRating(itemId);
        });
    }

    updateRating() {
        for (let i = 0; i < this.maxRating; i++) {
            let currentRating = i + 1;
            let item = this.element.getElementsByClassName(`item-${currentRating}`)[0];
            if (item) {
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
}

window.customElements.define('web-component-rating', Rating);
