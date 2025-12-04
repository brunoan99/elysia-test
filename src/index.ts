import { Elysia, t } from "elysia";
import { fromTypes, openapi } from "@elysiajs/openapi";

// GETTING STARTED - AT GLANCE
const app = new Elysia()
  .use(
    openapi({
      references: fromTypes(),
    }),
  )
  .get("/", () => "Plain route")
  // Route with type type schema to define Params
  .get("/routeparam/:param", ({ params: { param } }) => param, {
    // 'query/abobrinha' will return an error
    params: t.Object({
      param: t.Number(),
    }),
  })
  // Route with type type schema to define Params and Query Params
  .get(
    "/query/:routeparam",
    ({ params: { routeparam }, query: { name } }) =>
      `Query Param Name: ${name}, Route Param Value: ${routeparam}`,
    {
      params: t.Object({
        routeparam: t.Number(),
      }),
      query: t.Object({
        name: t.String(),
      }),
    },
  )

// ESSENTIAL - Route
const essential_route = new Elysia()
  // Static Path
  .get('/id/1', 'static path')
  // Dynamic path with Route Param
  .get('/id/:id', ({ params: { id } }) => id)
  // Dynamic path with Optional Route Param
  .get('/id/:id?', ({ params: { id } }) => `id ${id}`)
  // Dynamic path with Multiple Route Param
  .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)
  // Wildcard Path
  .get('/id/*', 'wildcard path')
  /*
  Path priority will be
  - Static Paths
  - Dynamic Paths
  - Wildcards
  even if the order of route declarations don't follow this sequence
  */
  // HTTP Verbs
  .get("verbget", () => "verbget")
  .post("verbpost", () => "verbpost")
  .put("verbput", () => "verbput")
  .patch("verbpatch", () => "verbpatch")
  .delete("verbdelete", () => "verbdelete")
  // Custom Method
  .route('M-SEARCH', '/m-search', 'connect')
  // This will match all methods
  .all("all", "all")
  .group('/user',
    { body: t.Literal("Optional Guard Parameter") },
    (app) => app
      .post('/sign-in', 'Sign in')
      .post('/sign-up', 'Sign up')
      .post('/profile', 'Profile')
  )

const user2 = new Elysia({ prefix: "user2 " })
  .post('/sign-in', 'Sign in')
  .post('/sign-up', 'Sign up')
  .post('/profile', 'Profile')


// ESSENTIAL - HANDLER

// END
app.use(essential_route).use(user2)
  .listen(3000)

export type App = typeof app;
