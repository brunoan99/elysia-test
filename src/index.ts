import { Elysia } from "elysia";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { getting_started_at_glance } from "./getting-started/at-glance";
import { essential_route } from "./essential/route";
import { essential_handler } from "./essential/handler";
import { essential_validation } from "./essential/validation";

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

app
  .use(getting_started_at_glance)
  .use(essential_route)
  .use(essential_handler)
  .use(essential_validation)
  .listen(3000)

export type App = typeof app;
