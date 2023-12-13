const { ObjectModel, BucketModel } = require("../models");
const mongoose = require("mongoose");
const bucketService = require("./bucketService");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),

  allowedFile: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("audio/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only image, video, or audio files are allowed."
        ),
        false
      );
    }
  },
}).single("file");

const uploadFile = async (req) => {
  return new Promise((resolve, reject) => {
    upload(req, null, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("MulterError", err);
        reject(err);
      } else if (err) {
        console.error("Error", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const getObjects = async (payload) => {
  let { userId } = payload;

  if (!userId) throw "User id is required";

  const bucket = await BucketModel.find({ user: userId })
    .populate("objects", "file link")
    .exec();

  console.log(bucket, "bucket");

  return bucket;
};

const getObject = async (payload) => {
  // validation userId & objectId
  if (!payload || !payload.userId) throw "User id is required";
  if (!payload || !payload.objectId) throw "Object id is required";

  let { userId, objectId } = payload;

  objectId = await toMongooseId(objectId);

  //   get object by object id
  const object = await getObjectById(objectId);

  //   check if object belongs to the user
  if (!object.user.equals(userId))
    throw "You are not allowed to access others object";

  return object;
};

const toMongooseId = async (id) => {
  return await new mongoose.Types.ObjectId(id);
};

const addObject = async (req, bucketId) => {
  const payload = {
    userId: req.user._id,
    bucketId,
  };

  if (!payload || !payload.userId) throw "User id is required";
  if (!payload || !payload.bucketId) throw "Bucket id is required";

  let { userId } = payload;
  bucketId = await toMongooseId(bucketId);

  //   check if bucket exists for that user
  const bucket = await bucketService.getBucketById(bucketId);

  if (!bucket) throw "Bucket not exists for the user";

  //   upload file
  await uploadFile(req);

  //   creating download link
  const link = `http://localhost:3000/uploads/${req.file.filename}`;

  //   add data in the db
  const objectObj = new ObjectModel({
    user: userId,
    bucket: bucketId,
    file: req.file,
    link,
  });

  const obj = await objectObj.save();

  //   updating buckets objects
  bucket.objects.push(obj._id);
  await bucket.save();

  //   return true status
  return {
    id: obj._id,
    link,
    status: true,
  };
};

const getObjectById = async (id) => {
  return await ObjectModel.findOne({ _id: id });
};

const deleteObject = async (payload) => {
  // validation userId & objectId
  if (!payload || !payload.userId) throw "User id is required";
  if (!payload || !payload.objectId) throw "Object id is required";

  let { userId, objectId } = payload;

  objectId = await toMongooseId(objectId);

  //   get object by object id
  const object = await getObjectById(objectId);

  //   check if object belongs to the user
  if (!object.user.equals(userId))
    throw "You are not allowed to access others object";

  // delete object from objects
  await ObjectModel.deleteOne({ _id: objectId });

  // get bucket having objects -> objectId
  const bucket = await bucketService.getBucketHavingObject(objectId);

  if (!bucket) throw "Bucket not found for the object";

  // delete objectId from the bucket -> objects column
  bucket.objects = bucket.objects.filter((id) => !id.equals(objectId));
  await bucket.save();

  // delete file from uploads folder
  await fs.unlinkSync(object.file.path);

  //   return
  return {
    id: objectId,
    file: object.file.filename,
    status: true,
  };
};

module.exports = {
  getObjects,
  toMongooseId,
  addObject,
  getObject,
  getObjectById,
  deleteObject,
};
