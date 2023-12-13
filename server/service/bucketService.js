const { BucketModel } = require("../models");

const getBuckets = async (userId) => {
  return await BucketModel.find({ user: userId })
    .populate("user", "_id name email")
    .select("-objects");
};

const addBucket = async (payload) => {
  console.log(payload, payload.userId, payload.name);
  //   validations
  if (!payload || !payload.userId) throw "User Id is required";
  if (!payload || !payload.name) throw "Bucket name is required";

  const { userId, name } = payload;

  //   id valid bucket name
  if (!(await isBucket(name))) throw "Bucket name is invalid";

  // if bucket already exists for that user
  const bucket = await getBucketByUserIdAndName(userId, name);

  if (bucket) throw "Bucket name already exists for this user";

  //   if new, create bucket
  const bucketObj = new BucketModel({
    user: userId,
    name,
  });

  await bucketObj.save();

  return true;
};

const getBucketByUserIdAndName = async (userId, name) => {
  return await BucketModel.findOne({ user: userId, name });
};

const getBucketById = async (bucketId) => {
  return await BucketModel.findOne({ _id: bucketId });
};

const isBucket = (bucket) => {
  return String(bucket)
    .toLowerCase()
    .match(/^[a-zA-Z0-9_-]+$/);
};

const getBucketHavingObject = async (objectId) => {
  return await BucketModel.findOne({
    objects: objectId,
  }).exec();
};

module.exports = {
  getBuckets,
  addBucket,
  getBucketByUserIdAndName,
  isBucket,
  getBucketById,
  getBucketHavingObject,
};
