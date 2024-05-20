// const contactsFunctions = require("../models/contacts");

const { httpError } = require("../helpers");
const { ctrlWrapper } = require("../decorators");
const Contact = require("../models/contact");

const listContacts = async (req, res, next) => {
  const data = await Contact.find();
  // if not needed - find({}, '-name -email etc')
  res.json(data);
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  // if search by title - await Contact.findOne({title: title})
  if (!contact) {
    throw httpError(404, `Contact with ID ${id} not found`);
  }
  res.json(contact);
};

const addContact = async (req, res, next) => {
  const body = req.body;
  const createdContact = await Contact.create(body);
  res.status(201).json(createdContact);
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;
  const deletedContact = await Contact.findByIdAndDelete(id);
  if (!deletedContact) {
    throw httpError(404, `Book with ID ${id} not found`);
  }
  res.json(deletedContact);
  // res.status(204).send();
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  const updatedContact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  if (!updatedContact) {
    throw httpError(404, `Book with ID ${id} not found`);
  }
  res.json(updatedContact);
};

const updateFavorite = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  const updatedContact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  if (!updatedContact) {
    throw httpError(404, `Book with ID ${id} not found`);
  }
  res.json(updatedContact);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
