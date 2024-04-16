const express = require("express")
const router = express.Router()


const story = require("../Controllers/storyContollers")

router.get("/all",story.allpublic)
router.get("/allprivate",story.allprivate)
router.post('/add',story.add)
router.post("/create",story.create)
router.get('/getbyusername',story.getbyusername)
router.get("/:id",story.story)

// router.get("/",story.all)
// router.get("/:id",story.story)
// router.put('/:id',story.add)
// router.post("/",story.create)

module.exports = router