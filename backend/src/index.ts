import express from 'express'
import session from 'express-session'
import cookieSession from 'cookie-session'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import passport from 'passport'
import OAuth2Strategy from 'passport-oauth2'
import fetch from 'node-fetch'

const prisma = new PrismaClient()
const app = express()

app.use(express.static('public'));
app.use(express.json());
app.use(cors({ origin: '*' }));
//app.use(session({ secret: process.env.session_key || 'foo bar baz' }));

app.use(cookieSession({
  name: 'session',
  secret: process.env.cookie_secret || '4bfd6fcf479a28c94c88277da81e4a80',
  maxAge: 30 * 24 * 60 * 60 * 1000,
}))

type done_callback = (err: any, result: any) => void

type TwitchUser = {
  id: string,
  login: string,
  display_name: string,
  profile_image_url: string
}

async function find_or_import_user(tu: TwitchUser) {
  let user = await prisma.user.findUnique({
    where: { twitch_id: tu.id }
  })

  if ( ! user ) {
    user = await prisma.user.create({
      data: {
        name: tu.display_name || tu.login,
        twitch_id: tu.id,
        profile_image: tu.profile_image_url,
      }
    })
  }

  console.log(user)

  return user
}

function require_login(req: express.Request, res: express.Response, next: express.NextFunction) {
  if ( ! req.user ) {
    res.json(false)
  } else {
    next()
  }
}

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
  tokenURL: 'https://id.twitch.tv/oauth2/token',
  clientID: process.env.client_id!,
  clientSecret: process.env.secret!,
  callbackURL: "http://localhost:8888/login/authorize",
}, (accessToken: string, refreshToken: string, profile: any, done: done_callback) => {

  fetch("https://api.twitch.tv/helix/users", {
    headers: {
      "client-id": process.env.client_id!,
      "Authorization": `Bearer ${accessToken}`,
    }
  }).then(
    (result) => result.json(),
    () => false
  ).then(
    (result) => result && find_or_import_user(result.data[0] as TwitchUser)
  ).then(
    (result) => {
      console.log("login result: ", result)
      if ( result ) {
        done(null, result)
      } else {
        done(null, false)
      }
    }
  )

  console.log(accessToken)
  console.log(refreshToken)
  console.log(profile)
}))

passport.serializeUser(function(user: any, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  let u = await prisma.user.findUnique({ where: { id: id as number }})
  done(null, u)
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', passport.authenticate('oauth2'));

app.get('/login/authorize',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    res.json(req.user)
  }
);

app.get('/api/games', async (_req, res) => {
  const games = await prisma.game.findMany()

  res.jsonp(games)
})

app.get('/api/games/:game_id/flags', async (req, res) => {
  const flags = await prisma.flags.findMany({ where: { game_id: parseInt(req.params.game_id) } })

  res.jsonp(flags)
})

app.post('/api/games/:game_id/flags',
  require_login,
  async (req, res) => {
    const flags = await prisma.flags.create({
      data: {
        game_id: parseInt(req.params.game_id),
        name: req.body?.name,
        value: req.body?.value,
      }
    })

    res.jsonp(flags)
  }
)

app.get('/api/flags/:flag_id/seeds', async (req, res) => {
  const seeds = await prisma.seed.findMany({ where: { flags_id: parseInt(req.params.flag_id) } })

  res.jsonp(seeds)
})

app.post('/api/flags/:flag_id/seeds',
  require_login,
  async (req, res) => {
    const seed = await prisma.seed.create({
      data: {
        flags_id: parseInt(req.params.flag_id),
        seed: req.body?.seed,
      }
    })

    res.jsonp(seed)
  }
)

app.get('/api/seeds/:id', async (req, res) => {
  const seed = await prisma.seed.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { playthroughs: { include: { user: true } } }
  })

  res.jsonp(seed)
})

app.post('/api/seeds/:seed_id/playthrough',
  require_login,
  async (req, res) => {
    const play = await prisma.playthrough.create({
      data: {
        seed_id: parseInt(req.params.seed_id),
        user_id: (req.user as any).id,
        time_ms: parseInt(req.body.time),
        rating_fun: parseInt(req.body.fun) || null,
        rating_hard: parseInt(req.body.difficulty) || null,
        comment: req.body.comment,
      }
    })

    res.jsonp(play)
  }
)

app.listen(8888)
