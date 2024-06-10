const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
const docxToPdf = require("docx-pdf");
const path = require("path");

// to upload file setting up the file storage step -1
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/convertFile", upload.single("file"), (req, res, next) => {
  try {
    // step-2
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    //defining output file path
    let outputPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname}.pdf`
    );

    docxToPdf(req.file.path, outputPath, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          msg: "Error converting docx to pdf",
        });
      }
      res.download(outputPath, () => {
        console.log("file downloaded");
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
