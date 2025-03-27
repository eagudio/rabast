import t from 'tap';
import { rabast } from '../../src/main';

// t.test('should match the correct route', async t => {
//   const root = rabast('/');

//   root
//     .route('/login')
//     .post()
//     .otherwise(() => 'hello world');

//   let response = await root.inject({
//     url: '/login',
//     method: 'POST',
//   });

//   t.equal(response, 'hello world');

//   response = await root.inject({
//     url: '/login/',
//     method: 'POST',
//   });

//   t.equal(response, 'hello world');
// });

t.test('should match the correct route with root', async t => {
  const root = rabast('/auth');

  root
    .route('/login')
    .post()
    .otherwise(() => 'hello world');

  let response = await root.inject({
    url: '/auth/login',
    method: 'POST',
  });

  t.equal(response, 'hello world');

  response = await root.inject({
    url: '/auth/login/',
    method: 'POST',
  });

  t.equal(response, 'hello world');
});

// t.test('should match the correct route and subroute', async t => {
//   const root = rabast('/');

//   root
//     .route('/auth')
//     .route('/login')
//     .post()
//     .otherwise(() => 'hello world');

//   const response = await root.inject({
//     url: '/auth/login',
//     method: 'POST',
//   });

//   t.equal(response, 'hello world');
// });

// t.test('should match the correct route and subroute with method', async t => {
//   const root = rabast('/');

//   root
//     .route('/auth')
//     .post()
//     .otherwise(() => 'hi!')
//     .route('/login')
//     .post()
//     .otherwise(() => 'hello world');

//   const response = await root.inject({
//     url: '/auth/login',
//     method: 'POST',
//   });

//   t.equal(response, 'hello world');
// });

// t.test('should match first route with the correct route and subroute with method', async t => {
//   const root = rabast('/');

//   root
//     .route('/auth')
//     .post()
//     .otherwise(() => 'hi!')
//     .route('/login')
//     .post()
//     .otherwise(() => 'hello world');

//   const response = await root.inject({
//     url: '/auth',
//     method: 'POST',
//   });

//   t.equal(response, 'hi!');
// });

// t.test('should not match route and throw error', async t => {
//   const root = rabast('/');

//   root
//     .route('/login')
//     .post()
//     .otherwise(() => 'hello world');

//   await t.rejects(
//     root.inject({
//       url: '/logout',
//       method: 'POST',
//     }),
//     { message: 'Route not found' }
//   );
// });

// t.test('should not match method and throw error', async t => {
//   const root = rabast('/');

//   root
//     .route('/login')
//     .post()
//     .otherwise(() => 'hello world');

//   await t.rejects(
//     root.inject({
//       url: '/login',
//       method: 'GET',
//     }),
//     { message: 'Route not found' }
//   );
// });

// t.test('should match route and subroutes', async t => {
//   const auth = rabast('/auth');

//   auth
//     .route('/login')
//     .post()
//     .otherwise(() => 'hello world');

//   auth
//     .route('/logout')
//     .post()
//     .otherwise(() => 'bye');

//   const response = await auth.inject({
//     url: '/auth/login',
//     method: 'POST',
//   });

//   t.equal(response, 'hello world');
// });
