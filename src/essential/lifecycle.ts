import { isHtml } from "@elysiajs/html"
import { Elysia } from "elysia"
import { rateLimit } from "elysia-rate-limit"

/*
--Request-> `onRequest` --Routing-> `transform` --Validation-> `beforeHandle`
                  \            |            |          /             ||
                  \/           \/           \/        \/             ||
                   -------------------------------------             \/
                   |              onError              |    <---  Handler
                   -------------------------------------             ||
                             |                       /\              ||
                             \/                       \              \/
   <-Response-- `afterResponse (defered) <-- `mapResponse` <-- `afterHandle`
*/
export const essential_lifecycle = new Elysia({ prefix: "essential_lifecycle", tags: ["Essential - Lifecycle"] })
  // Hook are Each function that intercepts the lifecycle event
  .get("/html-without-hook", () => "<h1>Hello World</h1>")
  .get("/html-with-local-hook", () => "<h1>Hello World</h1>", {
    // local hook, will only be applied to this route cause
    // is assign inside the scope of this route
    afterHandle({ responseValue, set }) {
      if (isHtml(responseValue))
        set.headers["content-type"] = "text/html; charset=utf8"
    }
  })
  // onAfterHandle will work as like a guard
  // but with only the purpose of onAfterHandle
  .onAfterHandle(({ responseValue, set }) => {
    if (isHtml(responseValue))
      set.headers["content-type"] = "text/html; charset=utf8"
  })
  .get("/html-with-interceptor-hook", () => "<h1>Hello World</h1>")
  // Order of assignment
  // Hooks will only apply to routes after it is registered
  .onBeforeHandle(() => console.log(1))
  .get("/test-order-1", () => "hi") // will log 1
  .onBeforeHandle(() => console.log(2))
  .get("/test-order-2", () => "hi") // will log 1 and 2

export const essential_lifecycle_2 = new Elysia()
  .use(rateLimit())

essential_lifecycle
  .use(essential_lifecycle_2)
