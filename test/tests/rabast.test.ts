import t from 'tap';
import { rabast, Route } from '../../src/main';
import { Get, Post } from '../../src/methods';
import { Ok } from '../../src/responses/http/ok';
import { NotFound } from '../../src/responses/http/notfound';

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

  t.same(response, new Ok('hello world'));
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

  let response = await app.inject({
    url: '/auth/login',
    method: 'POST',
  });

  t.same(response, new Ok('hello world'));

  response = await app.inject({
    url: '/login',
    method: 'POST',
  });

  t.same(response, new NotFound('Route POST:/login not found'));
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

  t.same(response, new Ok('hello world'));

  response = await app.inject({
    url: '/',
    method: 'GET',
  });

  t.same(response, new Ok('hi'));
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

  t.same(response, new Ok('hello world'));

  response = await app.inject({
    url: '/api/auth',
    method: 'GET',
  });

  t.same(response, new Ok('hi'));

  response = await app.inject({
    url: '/api/auth/',
    method: 'GET',
  });

  t.same(response, new Ok('cerea'));
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

  t.same(response, new Ok('hello world'));

  response = await app.inject({
    url: '/auth/logout',
    method: 'POST',
  });

  t.same(response, new Ok('bye'));
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

  const response = await app.inject({
    url: '/logout',
    method: 'POST',
  });

  t.same(response, new NotFound('Route POST:/logout not found'));
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

  const response = await app.inject({
    url: '/login',
    method: 'GET',
  });

  t.same(response, new NotFound('Route GET:/login not found'));
});

t.test('should match route and rabast subroutes', async t => {
  const user = rabast()
    .otherwise(() => 
      Route('/',
        Get()
          .otherwise(() => 'user')
      ),
    );

  const app = rabast()
    .otherwise(() =>
      Route('/', 
        Route('/auth',
          Post('/login')
            .otherwise(() => 'hello world'),
          Post('/logout')
            .otherwise(() => 'bye')
        ),
        Route('/user',
          user
        )
      ),
    );

  let response = await app.inject({
    url: '/auth/login',
    method: 'POST',
  });

  t.same(response, new Ok('hello world'));

  response = await app.inject({
    url: '/auth/logout',
    method: 'POST',
  });

  t.same(response, new Ok('bye'));

  response = await app.inject({
    url: '/user',
    method: 'GET',
  });

  t.same(response, new Ok('user'));
});
