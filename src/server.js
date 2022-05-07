import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import usersRouter from "./users/index.js"
// import favoritesRouter from "./favorites/index.js"
// import cors from "cors"
///

const server = express()
const port = process.env.PORT || 3001

///

server.use(express.json())
// server.use(cors())

//
server.use("/users", usersRouter)
// server.use("/favorites", favoritesRouter)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongooo!")

  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server on port ${port}`)
  })
})
