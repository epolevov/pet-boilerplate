export function onError(req, res, err) {
  if (err?.code) {
    res.writeHead(err.code, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        message: err.message,
        errors: err.data,
      })
    );
  } else {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        message: err.message,
        errors: err?.data,
      })
    );
  }
}
