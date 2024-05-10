const corsOptions = {
  origin: (origin, callback) => {
    // Allow all origins by passing null
    callback(null, true);
  },
  optionsSuccessStatus: 200,
};
