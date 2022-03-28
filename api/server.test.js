// Write your tests here
test('sanity', () => {
  expect(true).toBe(false)
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
        await (await request(server).post('/api/auth/register')).setEncoding(userOne)
        const user = await db('users').first()
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('username')
        expect(user).toHaveProperty('password')
        expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/)
        expect(user.username).toBe(userOne.username)
      })
      test('responds with new user && bcrypted pass', async () => {
        const { body } = await (await request(server).post('/api/auth/register')).send(userOne)
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
        const res = await (await request(server).post('/api/auth/login')).send(userOne)
        expect(res.status).toBe(200)
      })
      test('respond with a welcome message and token', async () => {
        const res = await request(server).post('/api/auth/login').send(userOne)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('token')
      })
    })
  })
})

