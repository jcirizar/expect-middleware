var expect = require('../index').regular;
var body = {
  username: 'juan',
  password: 'secret'
};


try{
  expect(body).toHave('userame');
} catch (e) {
  console.error(e);
}
