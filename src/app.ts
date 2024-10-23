import fastify from 'fastify';

export default function createApp(options = {}) {
  const app = fastify(options)

  app.get('/api/hello', (request, reply) => {
    reply.send({ hello: "World!" })
  })


  app.get('/api/good-bye', (request, reply) => {
    reply.status(200).send({ message: "Good Bye Visitor!" })
  })


  type PostBeverageRouteWithStaffRoute = {
    Headers: {
      "CodeCool-Beverages-Dietary"?: "vegan" | "lactose-intolerance";
    }
    Querystring: {
      milk?: "yes" | "no";
      sugar?: "yes" | "no";
    }
    Params: {
      beverage: "coffee" | "tea" | "chai";
    }

    Body?: {
      kind: string;
    }

  }

  app.post<PostBeverageRouteWithStaffRoute>('/api/beverages/:beverage', (request, reply) => {
    const { beverage } = request.params;

    const milk = request.query.milk;
    const sugar = request.query.sugar;
    const kind = request.body?.kind;
    const dietary = request.headers['codecool-beverages-dietary'];

    const condiments: string[] = [];
    if (milk === "yes") {
      if (dietary === "lactose-intolerance") {
        condiments.push("lf-milk")
      } else if (dietary === "vegan") {
        condiments.push("oat-milk")
      } else {
        condiments.push("milk")
      }
    }
    if (sugar === "yes") {
      condiments.push("sugar")
    }


    if (kind) {
      reply.send({ drink: `${kind} ${beverage}`, with: condiments });
    }

    reply.send({ drink: beverage, with: condiments });
  })




  return app;
}
