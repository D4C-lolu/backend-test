import aws from "aws-sdk";
import { Request, Response } from "express";
import multer from "multer";
import multers3 from "multer-s3";
import config from "../config";
import FolderService from "../services/folder.service";
import logger from "./logger";

const bucketName = config().aws.bucketName;
const accessKeyId = config().aws.accessKeyId;
const secretAccessKey = config().aws.secretAccessKey;

const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey,
});

const validFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "text/csv",
  "audio/mpeg",
  "audio/mp4",
  "audio/mp3",
  "audio/ogg",
  "audio/vnd.wav",
  "audio/wave",
  "video/mp4",
  "video/3gpp",
  "video/quicktime",
  "video/x-ms-wmv",
  "video/x-msvideo",
  "video/x-flv",
];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (validFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, JPG files are allowed"));
  }
};

export const uploadToS3 = multer({
  fileFilter,
  limits: {
    parts: Infinity,
    fileSize: 1024 * 1024 * 200, //Maximum of 200Mb file size
  },
  storage: multers3({
    acl: "public-read",
    s3,
    bucket: bucketName,
    contentType: multers3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: Request, file, cb) {
      try {
        let key = `${Date.now()}-${file.originalname.toLowerCase()}`;

        //Create sub folders in S3 bucket
        const filePrefix = FolderService.buildPathString(req.body.folderId);
        key = filePrefix ? `${filePrefix}/${key}` : key;

        logger.info(`Saving file ${file.originalname} as ${key} in AWS bucket`);
        cb(null, key);
      } catch (err) {
        cb(new Error("An Error occured while uploading files"));
      }
    },
  }),
});



export const deleteFileFromS3 = async (
  req: Request,
  filepath: string
): Promise<void> => {
  logger.info(`Deleting file with key "${filepath}"`);

  const params = { Bucket: bucketName, Key: filepath };

  await s3.deleteObject(params, (err) => {
    if (err) throw new Error(err.message);
    else logger.info(`Deleted file with key "${filepath}"`);
  });
};

export const downloadFileFromS3 = async (
  req: Request,
  res: Response,
  filepath: string
): Promise<void> => {
  logger.info(`Downloading file with key ${filepath}`);

  const options = {
    Bucket: bucketName,
    Key: filepath,
  };

  res.attachment(filepath);
  const fileStream = s3.getObject(options).createReadStream();
  fileStream.pipe(res);
  logger.info(`Successfully downloaded the file with key ${filepath} `);
};

export const deleteMultipleFilesFromS3 = async (
  req: Request,
  filepaths: { Key: string }[]
): Promise<void> => {
  logger.info(`Deleting files with filepaths "${JSON.stringify(filepaths)}"`);

  const params = { Bucket: bucketName, Delete: { Objects: filepaths } };

  await s3.deleteObjects(params, (err) => {
    if (err) throw new Error(err.message);
    else
      logger.info(`Deleted files with filepaths "${JSON.stringify(filepaths)}`);
  });
};
