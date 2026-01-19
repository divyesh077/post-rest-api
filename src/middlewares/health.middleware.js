export const health = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
  });
};
