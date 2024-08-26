const ticketRepository = require('../repositories/tickets.repository');
const { calculateAge } = require('../helpers/person.helper');

// Crear un nuevo ticket
exports.createTicket = (req, res) => {
  const { name, price, birthdate } = req.body;

  if (!name || !price || !birthdate) {
    return res.status(400).json({ code: 'TCK001', message: 'Todos los campos son obligatorios' });
  }

  const age = calculateAge(birthdate);

  if (age < 18)
    return res.status(409).json({code: 'TCK002', message: `${name} no puede ingresar, es menor de edad.`})

  const newTicket = { name, price, birthdate, eventDate: new Date().toISOString() };

  ticketRepository.create(newTicket);
  res.status(201).json(newTicket);
};

// Obtener todos los tickets
exports.getAllTickets = (req, res) => {
  const tickets = ticketRepository.getAll();
  res.json(tickets);
};

// Obtener un ticket por ID
exports.getTicketById = (req, res) => {
  const ticket = ticketRepository.getById(parseInt(req.params.id));

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  res.json(ticket);
};

// Actualizar un ticket por ID
exports.updateTicket = (req, res) => {
  const ticket = ticketRepository.getById(parseInt(req.params.id));

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const updatedTicket = { ...ticket, name, price };
  ticketRepository.update(ticket.id, updatedTicket);

  res.json(updatedTicket);
};

// Eliminar un ticket por ID
exports.deleteTicket = (req, res) => {
  const ticket = ticketRepository.getById(parseInt(req.params.id));

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  ticketRepository.delete(ticket.id);
  res.status(204).send();
};
