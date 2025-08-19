require("dotenv").config();
const { ServiceBroker } = require("moleculer");
const ApiService = require("moleculer-web");
const mongoose = require("mongoose");
const brokerConfig = require("./moleculer.config");

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/library";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error MongoDB:", err));

// Crear broker Moleculer
const broker = new ServiceBroker(brokerConfig);

// Servicio API HTTP
broker.createService(ApiService, {
  settings: {
    port: process.env.PORT || 4000,
    routes: [
      {
        path: "/api",
        autoAliases: true ,
        mappingPolicy: "all",
        whitelist: ["auth.*", "books.*"],
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
         cors: {
          origin: "*", // o especifica ["http://localhost:3000"] para mayor seguridad
          methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
        },
        mergeParams: true,
        onBeforeCall(ctx, route, req, res) {
      
          ctx.meta.headers = req.headers;
        }
      }
    ]
  }
});



// Cargar servicios
broker.loadService("./src/infrastructure/services/auth.service.js");
broker.loadService("./src/infrastructure/services/books.service.js");

// Iniciar broker y listar acciones
broker.start()
  .then(() => {
    console.log("API Books SPA corriendo en /api");

    console.log("Acciones registradas:");

    broker.services.forEach(service => {
      for (const actionName in service.actions) {
        console.log(`- ${service.name}.${actionName}`);
      }
    });
  });
