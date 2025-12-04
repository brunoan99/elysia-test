import { Elysia, file, form, t } from "elysia";
import { fromTypes, openapi } from "@elysiajs/openapi";

const app = new Elysia()

// GETTING STARTED - AT GLANCE
const getting_started_at_glance = new Elysia()
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
const essential_handler = new Elysia()
  // can be alse writen as () => 'Hello Elysia'
  // A handler can be a literal
  .get("/handler", "Hello Elysia")
  // A handler return directly a file
  .get("/package", file("package.json"))
  // A handler has a context
  .get("/context", (context) => context)
  // And this context object can be destructed to get a desired property directly
  .get("/status", ({ status }) => status(418, "I'm a teapot"))

  .get("/set", ({ set, status }) => {
    set.headers = { "X-Teapot": "true" }
    set.headers["x-powered-by"] = "Elysia"

    return status(418, "I'm a teapot")
  })
  .get("/redirect", ({ redirect }) => {
    return redirect("https://example.com")
    // or redirect("https://example.com", custom_status) to redirect with custom status
  })
  .get("/cookie", ({ cookie: { name } }) => {
    let cookie_name = name.value;
    name.value = "New Value"
    return `Before: ${cookie_name}, After: ${name.value}`
  })
  .get("/form", () => form({
    name: "Form Data",
    images: []
  }))
  .get("/stream", function* () {
    yield 1
    yield 2
    yield 3
  })
  .get("/streamok", function* () {
    if (Math.random() > 0.2) return "ok"
    yield 1
    yield 2
    yield 3
  })
  .get('/user-agent', ({ request }) => {
    return request.headers.get('user-agent')
  })

// END
app
  .use(getting_started_at_glance)
  .use(essential_route)
  .use(essential_handler)
  .use(user2)
  .listen(3000)

export type App = typeof app;
