import { Elysia, file, form, t } from "elysia";
import { fromTypes, openapi } from "@elysiajs/openapi";

const app = new Elysia().use(
  // This was available at getting started - at glance
  // But for not getting same prefix as others routes of the module
  // moved for here
  openapi({
    documentation: {
      tags: [
        { name: "Getting Started - At Glance", description: "Module content available at: https://elysiajs.com/at-glance" },
        { name: "Essential - Route", description: "Module content available at: https://elysiajs.com/essential/route.html" },
        { name: "Essential - Handler", description: "Module content available at: https://elysiajs.com/essential/handler.html" },
        { name: "Essential - Validation", description: "Module content available at: https://elysiajs.com/essential/validation.html" },
      ]
    },
    references: fromTypes(
      process.env.NODE_ENV === 'production'
        ? 'dist/index.d.ts'
        : 'src/index.ts'),
  }),
)

// GETTING STARTED - AT GLANCE
const getting_started_at_glance = new Elysia({ prefix: "getting_started_at_glance", tags: ["Getting Started - At Glance"] })
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
const essential_route = new Elysia({ prefix: "essential_route", tags: ["Essential - Route"] })
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

essential_route.use(user2)


// ESSENTIAL - HANDLER
const essential_handler = new Elysia({ prefix: "essential_handler", tags: ["Essential - Handler"] })
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
  .get('/port', ({ server }) => {
    return server?.port
  })
  .get('/ip', ({ server, request }) => {
    return server?.requestIP(request)
  })

const essential_validation = new Elysia({ prefix: "essential_validation", tags: ["Essential - Validation"] })
  .get('/id/:id', ({ params: { id } }) => id, {
    // This will enforce that id must be a number
    params: t.Object({
      id: t.Number()
    })
  })
  // here query has type = Record<string, string>
  .get('/query-without-guard', ({ query }) => 'hi')
  // This guard will only apply for the handler after it
  .guard({
    query: t.Object({
      name: t.String()
    })
  })
  // here query has type = { name: string }
  .get('/query-with-guard', ({ query }) => query)
  // Guard Override
  .guard({
    query: t.Object({}) // remove query type to be name: string for bellow routes
  })
  .guard({
    // no need to declare
    // schema: "override"
    // cause this value is default
    body: t.Object({
      age: t.Number()
    })
  })
  .post(
    '/query-guard-will-be-overrode',
    ({ body }) => body,
    {
      // This will override the guard schema
      body: t.Object({
        name: t.String()
      })
    }
  )
  // Guard Standalone
  .guard({
    schema: "standalone",
    body: t.Object({
      age: t.Number()
    })
  })
  .post("query-guard-will-not-be-overrode",
    // here body has type = { name: string, age: number }
    ({ body }) => body,
    {
      body: t.Object({
        name: t.String()
      })
    }
  )

const essential_validation_2 = new Elysia()
  // Files can be declared as types for body
  .post("/image-on-body", ({ body }) => body, {
    body: t.Object({
      file: t.File({ format: "image/* " }),
      multipleFiles: t.Files(),
    })
  })
  // this will accept something like: /array?name=john,max,oscar
  .get("/array", ({ query }) => query, {
    query: t.Object({
      name: t.Array(t.String())
    })
  })
  // here params has type = { id: number }
  .get("/id/:id", ({ params }) => params, {
    params: t.Object({
      id: t.Number()
    })
  })
  // here headers has type = { authorization: string }
  .get("/headers", ({ headers }) => headers, {
    headers: t.Object({
      authorization: t.String()
    })
  })
  // here cookie has type =
  // Record<string, Cookie<unknown>> & { cookieName: Cookie<string> }
  .get("/cookie", ({ cookie }) => cookie, {
    cookie: t.Cookie({
      cookieName: t.String()
    })
  })
  .get("/cookie-2", ({ cookie }) => cookie, {
    cookie: t.Cookie({
      name: t.String()
    }, {
      // the t.Cookie is a special type that is equivalent to t.Object
      // but allows to set cookie-specific options
      secure: true,
      httpOnly: true
    })
  })
  .get("/response",
    { name: "John Doe" },
    // this response type declaration will be automatically shown on openapi tab
    {
      response: t.Object({
        name: t.String()
      })
    }
  )
  .get("/response-2", ({ status }) => {
    if (Math.random() > 0.5)
      return status(400, {
        error: 'Something went wrong'
      })

    return {
      name: 'Jane Doe'
    }
  },
    // also response can be declared by status code
    {
      response: {
        200: t.Object({
          name: t.String()
        }),
        400: t.Object({
          error: t.String()
        })
      }
    }
  )
  .get("/error-property", () => "Hello World!", {
    body: t.Object({
      x: t.Number({
        error: "x must be a number"
      })
    })
  })
  .get("/error-property-2", () => "hi", {
    body: t.Object({
      x: t.Number({
        error({ errors, type, value }) {
          return `Errors: ${errors}, Type: ${type}, Value: ${value}`
        }
      })
    })
  })


const essential_validation_3 = new Elysia()
  .post('/', ({ body }) => body, {
    body: t.Object({
      name: t.String(),
      age: t.Number()
    }),
    error({ code, error }) {
      switch (code) {
        case 'VALIDATION':
          console.log(error.all)

          // Find a specific error name (path is OpenAPI Schema compliance)
          const name = error.all.find(
            (x) => x.summary === '/name'
          )

          // If there is a validation error, then log it
          if (name)
            console.log(name)
      }
    }
  })

const SignDTO = t.Object({
  username: t.String(),
  password: t.String(),
})

const essential_validation_4 = new Elysia()
  // This can be done to don't have to repeat same structure every time when
  // common models are used
  .post("/sign-in", ({ body }) => body, {
    body: SignDTO,
    response: SignDTO,
  })
  // something that can alse be done is to register a model
  .model({
    sigin: t.Object({
      username: t.String(),
      password: t.String(),
    })
  })
  .post("/sign-in-2", ({ body }) => body, {
    // and there is autocomplete for this
    body: "sigin",
    response: "sigin"
  })
  // when working with models duplicate model names will cause Elysia to throw an error
  // to prevent this we can use a naming convention to segregate models by context
  // and avoid duplicated names
  .model({
    'admin.auth': t.Object({
      username: t.String(),
      password: t.String()
    }),
    'user.auth': t.Object({
      username: t.String(),
      password: t.String()
    })
  })


essential_validation
  .use(essential_validation_2)
  .use(essential_validation_3)
  .use(essential_validation_4)

// END
app
  .use(getting_started_at_glance)
  .use(essential_route)
  .use(essential_handler)
  .use(essential_validation)
  .listen(3000)

export type App = typeof app;
