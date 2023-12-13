const userService = require("../service/userService");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const data = await userService.register({ name, email, password });

    return res.json({
      status: 200,
      message: "Successfully register",
      data,
    });
  } catch (err) {
    console.log(err, "from register controller");
    return res.json({ status: 400, error: err });
  }
};

const login = async (req, res) => {
  try {
    // take value
    const { email, password } = req.body;

    const data = await userService.login({ email, password });

    return res.json({
      status: 200,
      message: "Successfully login",
      data,
    });
  } catch (err) {
    console.log(err, "from login controller");
    return res.json({ status: 400, error: err });
  }
};

const logout = async (req, res) => {
  try {
    const data = await userService.logout({
      userId: req.user._id,
      token: req.token,
    });

    return res.json({
      status: 200,
      message: "Successfully logout",
      data,
    });
  } catch (error) {
    console.log(error, "from logout controller");
    return res.json({ status: 400, error });
  }
};

module.exports = {
  register,
  login,
  logout,
};
