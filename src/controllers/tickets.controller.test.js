const request = require('supertest');
const { app, server } = require('../server');
const { calculateAge } = require('../helpers/person.helper');
const ticketRepository = require('../repositories/tickets.repository');

jest.mock('../repositories/tickets.repository');
jest.mock('../helpers/person.helper');

describe('@Tickets Controller (/tickets)', () => {
  describe('When create a ticket (POST)', () => {

    it('#Should return error 400 with code TCK001 if body do not have all properties', async () => {
      const response = await request(app).post('/tickets');

      expect(response.status).toBe(400)
      expect(response.body.code).toBe('TCK001')
    });

    it('#Should return error 409 with code TCK002 if undeer age', async () => {
      const requestData = { name: 'AAA', price: 12, birthdate: 'aaaaaa'};
      calculateAge.mockImplementationOnce(() => 15)

      const response = await request(app).post('/tickets').send(requestData);

      expect(response.status).toBe(409);
      expect(response.body.code).toBe('TCK002');
      expect(ticketRepository.create).not.toHaveBeenCalled();
    });

    it('#Should calls create method from repository', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2017-01-01')); // today
      const requestData = { name: 'AAA', price: 12, birthdate: '1995-02-02'};

      await request(app).post('/tickets').send(requestData);

      expect(ticketRepository.create).toHaveBeenCalledWith({
        ...requestData, eventDate: '2017-01-01T00:00:00.000Z'
      });
    });

    it('#Should return 201', async () => {
      const requestData = { name: 'BBB', price: 12, birthdate: '1995-02-02'};
      jest.useFakeTimers().setSystemTime(new Date('2017-01-01')); // today

      const response = await request(app).post('/tickets').send(requestData);

      expect(response.status).toBe(201)
    });

    it('#Should return object', async () => {
      const requestData = { name: 'CCCC', price: 12, birthdate: '1995-02-02'};
      jest.useFakeTimers().setSystemTime(new Date('2017-01-01')); // today

      const response = await request(app).post('/tickets').send(requestData);

      expect(response.body).toEqual({
        ...requestData, eventDate: '2017-01-01T00:00:00.000Z'
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  afterAll(() => {
    server.close();
  })
});
