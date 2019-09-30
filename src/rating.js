const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
    filter: grayscale(100%);
}
.rating-container {
    display: flex;
}
.rating-item {
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 166"><polygon fill="greenyellow" points="83 26.8 65.7 61.8 27.1 67.4 55 94.7 48.5 133.2 83 115 117.5 133.2 111 94.7 138.9 67.4 100.3 61.8 83 26.8 83 26.8"/></svg>');
    width: 60px;
    height: 60px;
    filter: grayscale(100%);
    cursor: pointer;
}
.rating-item.filled {
    filter: none;
}
</style>
<div class="rating-container">
</div>
`;

export class Rating extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.element = this.shadowRoot.querySelector('div');
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
        //TODO: do not update all, only the css classes
        this.render();
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: this.rating }));
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this.render();
    }

    render() {
        for (let i = 0; i < this.maxRating; i++) {
            this.addOrUpdateRatingElement(i < this.rating, i + 1);
        }
        this.setDisabled(this.element, this.disabled);
    }

    // refactor this, maybe here is a sweeter way to do this
    addOrUpdateRatingElement(filled, i) {
        let item = this.element.getElementsByClassName(`item-${i}`)[0];
        if (item === undefined) {
            const ratingTemplate = document.createElement('div');
            ratingTemplate.className = `rating-item item-${i}`;

            if (filled) {
                ratingTemplate.innerHTML = ratingTemplate.innerHTML.replace('rating-item', 'rating-item filled');
            }

            this.element.appendChild(ratingTemplate);
            item = this.element.getElementsByClassName(`item-${i}`)[0];
            item.addEventListener('click', value => {
                this.changeRating(i);
            });
        }
        if (!filled) {
            item.className = item.className.replace('filled', '');
        } else if (item.className.indexOf('filled') < 0) {
            item.className = item.className + ' filled';
        }
    }
}

window.customElements.define('web-component-rating', Rating);
