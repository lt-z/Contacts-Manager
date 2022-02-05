class View {
  constructor() {
    this.main = this.getElement('main');
    this.addSearchBar = this.getElement('#add-search-bar');
    this.addContactBtn = this.getElement('.add');
    this.searchBar = this.getElement('#search');
    this.contactsWrapper = this.getElement('#contacts-wrapper');
    this.contactsList = this.getElement('#contacts-list-wrapper');
    this.createContactForm = this.getElement('#create-contacts-wrapper');
    this.editContactForm = this.getElement('#edit-form-wrapper');
    this.noContacts = this.getElement('#no-contacts');
    this.createTags = this.getElement('#tags');

    this._initLocalListeners();
    this._createTemplates();
  }

  _createTemplates() {
    this.templates = {};

    let temps = [...document.querySelectorAll('script[type="text/x-handlebars"]')];
    temps.forEach(temp => {
      this.templates[temp.id] = Handlebars.compile(temp.innerHTML);
    });
  }

  _initLocalListeners() {
    this.main.addEventListener('click', event => {
      let classes = event.target.classList;
      if (classes.contains('cancel') || classes.contains('add')) {
        let form = event.target.closest('form');
        if (!form || !form.getAttribute('data-id')) {
          this._toggleHidden(this.createContactForm);
        } else {
          this._toggleHidden(this.editContactForm);
        }
      }
    });

    this.createTags.addEventListener('input', this._validateTags);
  }

  _validateTags(event) {
    let tags = event.target;
    let vals = tags.value.split(',').map(tag => tag.trim());
    let valid = vals.every(val => vals.indexOf(val) === vals.lastIndexOf(val));
    if (!valid) {
      tags.setCustomValidity('Duplicate tags not allowed!');
    } else {
      tags.setCustomValidity('');
    }
    tags.reportValidity();
  }

  _toggleHidden(node) {
    [this.addSearchBar, this.contactsWrapper, node].forEach(node => node.classList.toggle('hidden'));
  }

  createElement(selector, className) {
    let element = document.createElement(selector);
    if (className) element.classList.add(className);
    return element;
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  displayContacts(contacts, filtered = false) {
    if (Object.keys(contacts).length === 0) {
      this.noContacts.classList.remove('hidden');
      this.noContacts.innerHTML = '';
      let p = this.createElement('p');

      if (filtered) {
        p.textContent = `There are no contacts that start with "${this.searchBar.value}".`;
        this.noContacts.append(p);
      } else {
        p.textContent = 'There are no contacts.';
        let addContactClone = this.addContactBtn.cloneNode(true);
        this.noContacts.append(p, addContactClone);
      }
    } else {
      this.noContacts.classList.add('hidden');
    }
    this.contactsList.firstElementChild.innerHTML = this.templates['contact-template']({contacts: contacts});
  }

  displayContactsTags(contacts) {
    this.noContacts.innerHTML = '';
    this.noContacts.classList.remove('hidden');
    let button = this.createElement('button', 'btn');
    button.textContent = 'Show All Contacts';
    this.noContacts.append(button);
    this.contactsList.firstElementChild.innerHTML = this.templates['contact-template']({contacts: contacts});
  }

  bindShowAllContactsButton(handler) {
    this.noContacts.addEventListener('click', event => {
      if (event.target.classList.contains('btn')) {
        this.noContacts.classList.add('hidden');
        handler();
      }
    });
  }

  bindDeleteButtons(handler) {
    this.contactsList.addEventListener('click', event => {
      if (event.target.classList.contains('delete')) {
        const confirm = window.confirm('Do you want to delete the contact ?');
        const id = event.target.dataset.id;
        if (confirm) handler(id);
      }
    });
  }

  bindCreateContact(handler) {
    let form = this.createContactForm.querySelector('form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      let contact = {};
      for (let idx = 0; idx < form.elements.length; idx += 1) {
        let elem = form.elements[idx];
        if (elem.type === 'submit') break;
        if (elem.name === 'tags') {
          elem.value = this._formatTags(elem.value);
        }
        contact[elem.name] = elem.value;
      }

      handler(contact);
      form.reset();
      this._toggleHidden(this.createContactForm);
    });
  }

  bindEditButtons(handler) {
    this.contactsList.addEventListener('click', event => {
      if (event.target.classList.contains('edit')) {
        const id = event.target.dataset.id;
        handler(id);
        this._toggleHidden(this.editContactForm);
      }
    });
  }

  displayEditForm(contact) {
    this.editContactForm.innerHTML = this.templates['edit-template'](contact);

    let editTags = this.editContactForm.querySelector('#edit-tags');
    editTags.addEventListener('input', this._validateTags);
  }

  bindEditContact(handler) {
    this.editContactForm.addEventListener('submit', event => {
      let form = this.editContactForm.querySelector('form');

      event.preventDefault();
      const id = form.dataset.id;

      let contact = {};
      for (let idx = 0; idx < form.elements.length; idx += 1) {
        let elem = form.elements[idx];
        if (elem.type === 'submit') break;
        if (elem.name === 'tags') {
          elem.value = this._formatTags(elem.value);
        }
        contact[elem.name] = elem.value;
      }

      handler(id, contact);
      form.reset();
      this._toggleHidden(this.editContactForm);
    });
  }

  _formatTags(tags) {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(',');
  }

  bindSearchBar(handler) {
    this.searchBar.addEventListener('keyup', event => {
      let value = event.target.value.toLowerCase();
      handler(value);
    });
  }

  bindTags(handler) {
    this.contactsList.addEventListener('click', event => {
      if (event.target.tagName === 'A') {
        event.preventDefault();
        let tag = event.target.dataset.tag;
        handler(tag);
      }
    });
  }
}

export default View;