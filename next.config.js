const MS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86400;

module.exports = {
  reactStrictMode: false,
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: SECONDS_PER_DAY * MS_PER_SECOND,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 100,
  },
};
