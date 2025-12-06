import { Elysia, t } from "elysia";

export const getting_started_at_glance = new Elysia({ prefix: "getting_started_at_glance", tags: ["Getting Started - At Glance"] })
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
