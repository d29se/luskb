exports.prepend0 = (arg) => {
  /**
   * Prepend zeros to kodSUKL up to 7 chars in total.
   * According to SUKL docs, kodSUKL = 7 digits as string!
   */
  arg = arg.toString();
  if (arg.length < 7) {
    add0 = 7 - arg.length; // required chars - actual = missing
    return "0".repeat(add0) + arg;
  } else {
    return arg;
  }
};
