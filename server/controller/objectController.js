const objectService = require("../service/objectService");

const getObjects = async (req, res) => {
  try {
    const data = await objectService.getObjects({
      userId: req.user._id,
    });

    return res.json({
      status: 200,
      message: "Successfully get objects",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, error });
  }
};

const getObject = async (req, res) => {
  try {
    const { objectId } = req.params;

    const data = await objectService.getObject({
      userId: req.user._id,
      objectId: objectId,
    });

    return res.json({
      status: 200,
      message: "Successfully get object",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, error });
  }
};

const downloadObject = async (req, res) => {
  try {
    const { objectId } = req.params;

    const data = await objectService.getObject({
      userId: req.user._id,
      objectId: objectId,
    });

    //   once get the object
    res.download(data.file.path, data.file.originalname, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          status: 500,
          message: "Error downloading the file",
          error: err.message,
        });
      } else {
        console.log("File downloaded successfully");
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, error });
  }
};

const addObject = async (req, res) => {
  try {
    const data = await objectService.addObject(req, req.query.bucketId);

    return res.json({
      status: 200,
      message: "Successfully added object under bucket for the user",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, error });
  }
};

const deleteObject = async (req, res) => {
  try {
    const { objectId } = req.params;

    const data = await objectService.deleteObject({
      userId: req.user._id,
      objectId: objectId,
    });

    return res.json({
      status: 200,
      message: "Successfully deleted object",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, error });
  }
};

module.exports = {
  getObjects,
  addObject,
  getObject,
  deleteObject,
  downloadObject,
};
