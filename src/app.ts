import fastify from 'fastify';

export default function createApp(options = {}) {
  const app = fastify(options)

  app.get('/api/hello', (request, reply) => {
    reply.send({ hello: "World!" })
  })


  app.get('/api/good-bye', (request, reply) => {
    reply.status(200).send({ message: "Good Bye Visitor!" })
  })


  type PostBeverageRoute = {
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

  app.post<PostBeverageRoute>('/api/beverages/:beverage', (request, reply) => {
    const { beverage } = request.params;

    const milk = request.query.milk;
    const sugar = request.query.sugar;
    const kind = request.body?.kind;
    const dietary = request.headers['codecool-beverages-dietary'];

    const condiments: string[] = chooseCondiments(milk, sugar, dietary);

    let statusCode: 201 | 418;
    if(beverage !== "chai" && beverage !== "tea"){
      statusCode = 418;
    } else {
      statusCode = 201;
    }
    
    const beverageDescription: string = kind ? `${kind} ${beverage}` : beverage;

    reply.status(statusCode).send({ drink: beverageDescription, with: condiments });
  })

  function chooseCondiments(milk?: "yes" | "no", sugar?: "yes" | "no", dietary?: "vegan" | "lactose-intolerance"){
    const condiments: string[] = [];
    if (milk === "yes") {
      condiments.push(chooseMilk(dietary))
    }
    if (sugar === "yes") {
      condiments.push("sugar")
    }
    return condiments;
  }
  function chooseMilk(dietary?: string) {
    switch (dietary) {
      case "vegan":
        return "oat-milk";
      case "lactose-intolerance":
        return "lf-milk";
      default:
        return "milk";
    }
  }



  return app;
}
