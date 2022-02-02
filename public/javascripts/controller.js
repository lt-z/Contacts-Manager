class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.onContactsChanged();

    this.model.bindContactsChange(this.onContactsChanged.bind(this));

    this.view.bindDeleteButtons(this.handleDeleteButtons);
    this.view.bindCreateContact(this.handleCreateContact);
    this.view.bindEditButtons(this.handleEditButtons.bind(this));
    this.view.bindEditContact(this.handleEditContact);
    this.view.bindSearchBar(this.handleSearchBar);
    this.view.bindTags(this.handleTags);
    this.view.bindShowAllContactsButton(this.handleShowAllContactsButton);
  }

  async onContactsChanged() {
    let contacts = await this.model.getContacts();
    this.view.displayContacts(contacts);
  }

  handleDeleteButtons = (id) => {
    this.model.deleteContact(id);
  }

  handleCreateContact = (contact) => {
    this.model.createContact(contact);
  }

  async handleEditButtons(id) {
    let contact = await this.model.getContact(id);
    this.view.displayEditForm(contact);
  }

  handleEditContact = (id, contact) => {
    this.model.updateContact(id, contact);
  }

  handleSearchBar = (value) => {
    let contacts = this.model.filterContacts(value);
    this.view.displayContacts(contacts, true);
  }

  handleTags = (tag) => {
    let contacts = this.model.filterContactsByTag(tag);
    this.view.displayContactsTags(contacts);
  }

  handleShowAllContactsButton = () => {
    this.view.displayContacts(this.model.contacts);
  }
}

export default Controller;