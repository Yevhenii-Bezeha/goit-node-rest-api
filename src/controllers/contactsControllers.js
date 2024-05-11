import {
  serviceListContacts,
  serviceGetContactById,
  serviceRemoveContact,
  serviceAddContact,
  serviceUpdateContact,
} from "../services/contactsServices.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await serviceListContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await serviceGetContactById(req.params.id);
    if (!contact) {
      throw HttpError(404);
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await serviceRemoveContact(req.params.id);
    if (!contact) {
      throw HttpError(404);
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = [
  validateBody(createContactSchema),
  async (req, res, next) => {
    try {
      const contact = await serviceAddContact(
        req.body.name,
        req.body.email,
        req.body.phone
      );
      res.status(201).json(contact);
    } catch (error) {
      next(error);
    }
  },
];

export const updateContact = [
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      const contact = await serviceUpdateContact(req.params.id, req.body);
      if (!contact) {
        throw HttpError(404);
      }
      res.json(contact);
    } catch (error) {
      next(error);
    }
  },
];
