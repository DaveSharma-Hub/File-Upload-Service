import express from "express";
import cors from "cors";
import "dotenv/config";
import multer, { memoryStorage } from "multer";
import { secureMiddleware } from "./middleware/secureMiddleware.js";
import { S3Client } from "@aws-sdk/client-s3";
import { saveFile } from "./utils/saveFile.js";
import { awsConfig, inputValidator } from "./utils/common.js";
import { signedUrl } from "./utils/signedUrl.js";

const PORT = Number.parseInt(process.env.PORT || "3000", 10);

const app = express();
app.use(cors());
app.use(express.json());
app.use(secureMiddleware);

const uploads = multer({ storage: memoryStorage() });

const s3Client = new S3Client(awsConfig());

app.post("/uploadFile", uploads.single("file"), async (req, res) => {
  try {
    const { file, body } = req;
    inputValidator([file, body]);

    const { fileName } = body;
    inputValidator([fileName]);

    const { buffer, mimetype } = file;
    inputValidator([buffer, mimetype]);

    const url = await saveFile(s3Client)({
      fileName,
      fileData: buffer,
      mimeType: mimetype,
    });
    const newUrl = await signedUrl({
      url,
    //   timeToAdd: 1000 * 60,
      timeToAdd: 1000 * 60 * 60 * 24,
    });
    res.send({
      url: newUrl,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.post("/downloadFile", async (req, res) => {});

app.get("/test", async (req, res)=>{
    const { url } = req.query;
    const newUrl = await signedUrl({
      url,
      timeToAdd: 1000 * 60 * 60 * 24,
    });
    res.send({
        url: newUrl
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
