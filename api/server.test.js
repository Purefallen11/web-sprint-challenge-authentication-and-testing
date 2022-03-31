// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

const userOne = { username: 'steve', password: '1234' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async () => {
  await db.destroy()
})

describe('server.js', () => {
  describe('auth endpoints', () => {
    describe('[POST] /api/auth/register', () => {
      beforeEach(async () => {
        await db('users').truncate()
      })
      test('adds a new user with bcrypted pass', async () => {
        await request(server).post('/api/auth/register').send(userOne)
        const user = await db('users').first()
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('username')
        expect(user).toHaveProperty('password')
        expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/)
        expect(user.username).toBe(userOne.username)
      })
      test('responds with new user && bcrypted pass', async () => {
        const { body } = await request(server).post('/api/auth/register').send(userOne)
        expect(body).toHaveProperty('id')
        expect(body).toHaveProperty('username')
        expect(body).toHaveProperty('password')
        expect(body.password).toMatch(/^\$2[ayb]\$.{56}$/)
        expect(body.username).toBe(userOne.username)
      })
    })
    describe('[POST] /api/auth/login', () => {
      beforeEach(async () => {
        await db('users').truncate()
        await request(server).post('/api/auth/register').send(userOne)
      })
      test('responds with proper status code on succesful login', async () => {
        const res = await request(server).post('/api/auth/login').send(userOne)
        expect(res.status).toBe(200)
      })
      test('respond with a welcome message and token', async () => {
        const res = await request(server).post('/api/auth/login').send(userOne)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('token')
      })
    
    })
    describe('jokes endpoint', () => {
      describe('[GET]/api/jokes', () => {
        beforeEach(async () => {
          await db('users').truncate()
          await request(server).post('/api/auth/register').send(userOne)
        })
        test('respond with err status on missing token', async () => {
          const res = await request(server).get('/api/jokes')
          expect(res.status + '').toMatch(/4|5/)
        })
        test('respond with "token required" on missing token', async () => {
          const res = await request(server).get('/api/jokes')
          expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
        })
      })
    })
  })
})
  


