export function handle_error (err)  {
  let errors = [];
  //console.log(err.message);

  if (err.message.includes('Violation of UNIQUE KEY constraint')){
    if (err.message.includes('UQ_78a916df40e02a9deb1c4b75edb')) {
      errors.push('Username must be unique');
    }
    if (err.message.includes('UQ_e12875dfb3b1d92d7d7c5377e22')) {
      errors.push('Email must be unique.');
    }
  }
  //console.log(errors);
  return errors;
}
