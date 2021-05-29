import express from 'express'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
import cors from 'cors'

const prisma = new PrismaClient()
const app = express()

app.use(cors({ origin: '*' }));
app.use(bodyParser.json())

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany()

  res.jsonp(games)
})

app.get('/games/:game_id/seeds', async (req, res) => {
  const seeds = await prisma.seed.findMany({ where: { game_id: parseInt(req.params.game_id) } })

  res.jsonp(seeds)
})

app.post('/games/:game_id/seeds', async (req, res) => {
  const seed = await prisma.seed.create({
    data: {
      game_id: parseInt(req.params.game_id),
      seed: req.body?.seed,
      flags: req.body?.flags,
    }
  })

  res.jsonp(seed)
})

app.get('/seeds/:id', async (req, res) => {
  const seed = await prisma.seed.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { playthroughs: { include: { user: true } } }
  })

  res.jsonp(seed)
})

app.post('/seeds/:seed_id/playthrough', async (req, res) => {
  const play = await prisma.playthrough.create({
    data: {
      seed_id: parseInt(req.params.seed_id),
      user_id: 1,
      time_ms: parseInt(req.body.time),
      rating_fun: parseInt(req.body.fun) || null,
      rating_hard: parseInt(req.body.difficulty) || null,
      comment: req.body.comment,
    }
  })

  res.jsonp(play)
})

/*
  console.log(req.body)
  console.log(req.params)
  console.log(req.query)

  res.jsonp({ hello: "world" })
})

app.get('/seeds', async (req, res) => {
  const posts = await prisma.seed.findMany({
    include: { author: true },
  })
  res.json(posts)
})

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body
  const post = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  })
  res.json(post)
})
app.put('/publish/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id },
    data: { published: true },
  })
  res.json(post)
})
*/

app.listen(8888)
