import express from "express"
import usersSchema from "./model.js"
import favoritesSchema from "../favorites/model.js"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"

const usersRouter = express.Router()

//-----TESTED----
const cloudinaryfavImagesUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "favImages",
    },
  }),
}).single("image")

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
//Lists favorite things of user-----TESTED----
usersRouter.get("/:username/favorites", async (req, res, next) => {
  try {
    const user = await usersSchema.findOne({ username: req.params.username }).populate("favorites")

    res.status(200).send(user.favorites)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

////users/:username/favorites/search?type=music
//Searchs favorite things of user by type,name,description. ---NOT TESTED----
/* usersRouter.get("/:username/favorites/search?type=music", async (req, res, next) => {
  try {
    const user = await usersSchema.findOne({ username: req.params.username })
    // take a look on query to mongo ,
  } catch (error) {
    console.log(error)
    next(error)
  }
}) */

/////users/:username/favorites/:favoriteId
// Gets single favorite thing of user------TESTED----
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

///users/:username/favorites/:favoriteId ----TESTED-----
//Deletes favorite thing for user
usersRouter.delete("/:username/favorites/:favoriteId", async (req, res, next) => {
  try {
    const favToKill = await usersSchema.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: { favorites: req.params.favoriteId },
      },
      { new: true }
    )
    console.log(favToKill)
    if (favToKill) {
      res.status(200).send("this stuff is deleted")
    } else {
      console.log(error)
      next(error)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// /users/:username/favorites/:favoriteId
// Updates favorite thing for user .PUT------TESTED----
usersRouter.put("/favorites/:favoriteId", async (req, res, next) => {
  try {
    const favToUpdate = await favoritesSchema.findByIdAndUpdate(
      req.params.favoriteId,
      {
        ...req.body,
      },
      { new: true }
    )

    if (favToUpdate) {
      res.status(200).send(favToUpdate)
    } else {
      console.log(error)
      next(error)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// /users/:username/favorites/:favoriteId/image ---TESTED-----
// 	PUT.	Uploads image to cloudinary for favorite thing and updates image field of favorite thing.
usersRouter.put("/favorites/:favoriteId/image", cloudinaryfavImagesUploader, async (req, res, next) => {
  try {
    const imagePathUpdater = await favoritesSchema.findByIdAndUpdate(req.params.favoriteId, { image: req.file.path }, { new: true })
    console.log(imagePathUpdater)
    if (imagePathUpdater) {
      res.status(200).send("hi")
    } else {
      console.log(error)
      next(error)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default usersRouter
