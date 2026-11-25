/**
 * Standardized API success response builder.
 * Includes `success: true`, `status: 'success'` (frontend compatibility), `message`, `data`, and `meta`.
 */
const sendSuccess = (req, res, data, message = 'OK', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    status: 'success',
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId || null,
    },
  });
};

module.exports = { sendSuccess };
