import { Elysia, t } from "elysia"

export const essential_validation = new Elysia({ prefix: "essential_validation", tags: ["Essential - Validation"] })
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
