import { Elysia, file, form } from "elysia";

export const essential_handler = new Elysia({ prefix: "essential_handler", tags: ["Essential - Handler"] })
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
