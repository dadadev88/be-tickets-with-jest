const express = require('express');
const ticketController = require('./controllers/tickets.controller');

const app = express();
app.use(express.json());

// Rutas CRUD
app.post('/tickets', ticketController.createTicket);
app.get('/tickets', ticketController.getAllTickets);
app.get('/tickets/:id', ticketController.getTicketById);
app.put('/tickets/:id', ticketController.updateTicket);
app.delete('/tickets/:id', ticketController.deleteTicket);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = {
  app,
  server
}
