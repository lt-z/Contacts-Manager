class Model {
  constructor() {
    this.contacts;
  }

  async getContacts() {
    const response = await fetch('/api/contacts', {
      method: 'GET',
    }).then(response => response.json())
      .then(data => data);

    this.contacts = response.map(contact => {
      return {...contact,
        tags: contact.tags ? contact.tags.split(',').map(tag => tag.trim()) : contact.tags};
    });
    return this.contacts;
  }

  async getContact(id) {
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'GET',
    }).then(response => response.json())
      .then(data => data);
    return response;
  }

  async createContact(contact) {
    await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    }).then(() => {
      this.onContactsChanged();
    });
  }

  async updateContact(id, contact) {
    await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    }).then(response => response.json())
      .then(data => {
        this.onContactsChanged();
      });
  }

  async deleteContact(id) {
    await fetch(`/api/contacts/${id}`, {
      method: 'DELETE',
    }).then(() => {
      this.onContactsChanged();
    });
  }

  filterContacts(value) {
    return this.contacts.filter(({full_name}) =>
      full_name.toLowerCase().startsWith(value));
  }

  filterContactsByTag(tag) {
    return this.contacts.filter(({tags}) => tags.includes(tag));
  }

  bindContactsChange(callback) {
    this.onContactsChanged = callback;
  }
}

export default Model;