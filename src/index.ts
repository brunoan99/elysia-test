import { Elysia, t } from "elysia";
import { fromTypes, openapi } from "@elysiajs/openapi";

const app = new Elysia()
    .use(
        openapi({
            references: fromTypes(),
        }),
    )
    .get("/", () => "Plain route")
    .get("/routeparam/:param", ({ params: { param } }) => param, {
        params: t.Object({
            param: t.Number(),
        }),
    })
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
    .listen(3000);

export type App = typeof app;
