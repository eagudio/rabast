import t from 'tap';
import { rabast, Route } from '../../src/main';
import { Get, Post } from '../../src/methods';

t.test('should match the correct route', async t => {
  const app = rabast();

  app
    .otherwise(() =>
      Route('/', 
        Post('/login')
          .otherwise(() => 'hello world')
      ),
    );

  const response = await app.inject({
    url: '/login',
    method: 'POST',
  });

  t.equal(response, 'hello world');
});

t.test('should match the correct route with root', async t => {
  const app = rabast();

  app
    .otherwise(() =>
      Route('/auth', 
        Post('/login')
          .otherwise(() => 'hello world')
      ),
    );

  const response = await app.inject({
    url: '/auth/login',
    method: 'POST',
  });

  t.equal(response, 'hello world');

  await t.rejects(
    app.inject({
      url: '/login',
      method: 'POST',
    }),
    { message: 'Route not found' }
  );
});

t.test('should match the correct route and subroute with method', async t => {
  const app = rabast();

  app
    .otherwise(() =>
      Route('/', 
        Get('/')
          .otherwise(() => 'hi'),
        Post('/login')
          .otherwise(() => 'hello world')
      ),
    );

  let response = await app.inject({
    url: '/login',
    method: 'POST',
  });

  t.equal(response, 'hello world');

  response = await app.inject({
    url: '/',
    method: 'GET',
  });

  t.equal(response, 'hi');
});

t.test('should match the correct nested route', async t => {
  const app = rabast();

  app
    .otherwise(() =>
      Route('/api', 
        Route('/auth',
          Get()
            .otherwise(() => 'hi'),
          Get('/')
            .otherwise(() => 'cerea'),
          Post('/login')
            .otherwise(() => 'hello world')
        )
      ),
    );

  let response = await app.inject({
    url: '/api/auth/login',
    method: 'POST',
  });

  t.equal(response, 'hello world');

  response = await app.inject({
    url: '/api/auth',
    method: 'GET',
  });

  t.equal(response, 'hi');

  response = await app.inject({
    url: '/api/auth/',
    method: 'GET',
  });

  t.equal(response, 'cerea');
});

t.test('should match route and subroutes', async t => {
  const app = rabast();

  app
    .otherwise(() =>
      Route('/', 
        Route('/auth',
          Post('/login')
            .otherwise(() => 'hello world'),
          Post('/logout')
            .otherwise(() => 'bye')
        )
      ),
    );

  let response = await app.inject({
    url: '/auth/login',
    method: 'POST',
  });

  t.equal(response, 'hello world');

  response = await app.inject({
    url: '/auth/logout',
    method: 'POST',
  });

  t.equal(response, 'bye');
});

t.test('should not match route and throw error', async t => {
  const app = rabast();

  app
    .otherwise(() =>
      Route('/', 
        Post('/login')
          .otherwise(() => 'hello world')
      ),
    );

  await t.rejects(
    app.inject({
      url: '/logout',
      method: 'POST',
    }),
    { message: 'Route not found' }
  );
});

t.test('should not match method and throw error', async t => {
  const app = rabast();

  app
    .otherwise(() =>
      Route('/', 
        Post('/login')
          .otherwise(() => 'hello world')
      ),
    );

  await t.rejects(
    app.inject({
      url: '/login',
      method: 'GET',
    }),
    { message: 'Route not found' }
  );
});
