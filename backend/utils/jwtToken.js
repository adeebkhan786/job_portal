

export const sendToken = (user, statusCode, res, message) => {
  // console.log("USER", user)
  const token = user.getJWTToken();
  const options = {
    expired: new Date(Date.now + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token
  })

}