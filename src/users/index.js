import express from "express"
import usersSchema from "./model.js"
import favoritesSchema from "../favorites/model.js"

const usersRouter = express.Router()

//Post a User  ----TESTED ----
usersRouter.post("/", async (req, res, next) => {
  try {
    const user = new usersSchema(req.body)

    const { _id } = await user.save()

    res.status(201).send({ _id })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

////////////users/:username/favorites------TESTED----- yatusabepapi
// POST	Creates favorite thing for user
usersRouter.post("/:username/favorites", async (req, res, next) => {
  try {
    const user = usersSchema.find({ username: req.params.username })

    if (user) {
      const favoriteToAdd = await favoritesSchema({
        ...req.body,
        username: user,
      }).save()

      const modifiedUser = await usersSchema.findOneAndUpdate(
        { username: req.params.username },
        { $push: { favorites: favoriteToAdd } },
        { new: true, runValidators: true }
      )
      if (modifiedUser) {
        res.status(201).send(modifiedUser)
      }
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

///users/:username/favorites
//Lists favorite things of user
usersRouter.get("/:username/favorites", async (req, res, next) => {
  try {
    const user = await usersSchema.findOne({ username: req.params.username }).populate("favorites")

    res.status(200).send(user)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

////users/:username/favorites/search?type=music
//Searchs favorite things of user by type,name,description.
// usersRouter.get("/", async (req, res, next) => {
//   try {
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// })

/////users/:username/favorites/:favoriteId
// Gets single favorite thing of user
usersRouter.get("/:username/favorites/:favoriteId", async (req, res, next) => {
  const user = await usersSchema.findOne({ username: req.params.username }).populate("favorites")

  const favThing = await user.favorites.find((one) => req.params.favoriteId === one._id.toString())

  res.status(200).send(favThing)
  try {
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//////users/:username/favorites/csv/
// Gets favorite things of user as csv stream.
// usersRouter.get("/", async (req, res, next) => {
//   try {
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// })

///users/:username/favorites/:favoriteId
//Deletes favorite thing for user
usersRouter.delete("/:username/favorites/:favoriteId", async (req, res, next) => {
  try {
    await usersSchema.findOneAndDelete(
      { username: req.params.username },
      {
        $pull: { favorites: { _id: req.params.favoriteId } },
      },
      { new: true }
    )

    res.status(200).send("this stuff is deleted")
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default usersRouter
