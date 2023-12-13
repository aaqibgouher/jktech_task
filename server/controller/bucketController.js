const bucketService = require("../service/bucketService");

const getBuckets = async (req, res) => {
  try {
    const data = await bucketService.getBuckets(req.user._id);

    return res.json({
      status: 200,
      message: "Successfully get buckets",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, error });
  }
};

const addBucket = async (req, res) => {
  try {
    const { name } = req.body;

    const data = await bucketService.addBucket({
      userId: req.user._id,
      name: name.trim(),
    });

    return res.json({
      status: 200,
      message: "Successfully added bucket for user",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, error });
  }
};

module.exports = {
  getBuckets,
  addBucket,
};
