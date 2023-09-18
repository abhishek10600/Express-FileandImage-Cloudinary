const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const app = express();

cloudinary.config({
    // cloud_name:process.env.CLOUD_NAME,
    cloud_name: "--LOL--",
    api_key: "--LOL--",
    api_secret: "--LOL--"

})

//setting view engine
app.set("view engine", "ejs");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

app.get("/myGet", (req, res) => {
    console.log(req.query);
    res.send(req.query);
})

app.post("/myPost", async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);

        //## Case for uploading multiple images
        let result;
        let imageArray = [];
        if (req.files) {
            for (let index = 0; index < req.files.samplefile.length; index++) {
                result = await cloudinary.uploader.upload(req.files.samplefile[index].tempFilePath, {
                    folder: "users"
                })
                imageArray.push({
                    public_id: result.public_id,
                    secure_url: result.secure_url
                })
            }
        }


        //## Case for uploading a single image
        // const file = req.files.samplefile;

        // const result = await cloudinary.uploader.upload(file.tempFilePath, {
        //     folder: "users"
        // });

        console.log(result);

        const details = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            result,
            imageArray
        }
        console.log(details);
        res.send(details);
    } catch (error) {
        console.log(error);
    }
})

app.get("/myGetForm", (req, res) => {
    res.render("getform");
})

app.get("/myPostForm", (req, res) => {
    res.render("postform");
})

app.listen(4000, () => {
    console.log("App running on PORT 4000...");
})