import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const contactsPath = path.join(process.cwd(), "db/contacts.json");

async function serviceListContacts() {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
}

async function serviceGetContactById(id) {
  const contacts = await serviceListContacts();
  const contact = contacts.find((item) => item.id === id);
  return contact;
}

async function serviceRemoveContact(id) {
  const contacts = await serviceListContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index !== -1) {
    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  }
  return null;
}

async function serviceAddContact(name, email, phone) {
  const contacts = await serviceListContacts();
  const newContact = { id: uuidv4(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function serviceUpdateContact(id, updateInfo) {
  const contacts = await serviceListContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index !== -1) {
    const updatedContact = { ...contacts[index], ...updateInfo };
    contacts[index] = updatedContact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact;
  }
  return null;
}

export {
  serviceListContacts,
  serviceGetContactById,
  serviceRemoveContact,
  serviceAddContact,
  serviceUpdateContact,
};
