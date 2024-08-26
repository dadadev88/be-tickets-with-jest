const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tickets.json');

// Leer los tickets desde el archivo JSON
const readTickets = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Escribir los tickets en el archivo JSON
const writeTickets = (tickets) => {
  fs.writeFileSync(filePath, JSON.stringify(tickets, null, 2), 'utf-8');
};

// Métodos del repository
exports.getAll = () => {
  return readTickets();
};

exports.getById = (id) => {
  const tickets = readTickets();
  return tickets.find(ticket => ticket.id === id);
};

exports.create = (ticket) => {
  const tickets = readTickets();
  ticket.id = tickets.length + 1;

  tickets.push(ticket);
  writeTickets(tickets);
  return ticket;
};

exports.update = (id, updatedTicket) => {
  let tickets = readTickets();
  tickets = tickets.map(ticket => (ticket.id === id ? updatedTicket : ticket));
  writeTickets(tickets);
  return updatedTicket;
};

exports.delete = (id) => {
  let tickets = readTickets();
  tickets = tickets.filter(ticket => ticket.id !== id);
  writeTickets(tickets);
};
