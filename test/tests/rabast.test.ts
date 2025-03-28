import t from 'tap';
import { rabast, Route } from '../../src/main';
import { Get, Post } from '../../src/methods';
import { Ok } from '../../src/responses/http/ok';
import { NotFound } from '../../src/responses/http/notfound';
import { Unauthorized } from '../../src/responses/http/unauthorized';

t.test('should match the correct route', async t => {
  const app = rabast();

  app
    .routing(() =>
      Route('/', 
        Post('/login')
          .reply(() => 'hello world')
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
    .routing(() =>
      Route('/auth', 
        Post('/login')
          .reply(() => 'hello world')
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
    .routing(() =>
      Route('/', 
        Get('/')
          .reply(() => 'hi'),
        Post('/login')
          .reply(() => 'hello world')
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
    .routing(() =>
      Route('/api', 
        Route('/auth',
          Get()
            .reply(() => 'hi'),
          Get('/')
            .reply(() => 'cerea'),
          Post('/login')
            .reply(() => 'hello world')
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
    .routing(() =>
      Route('/', 
        Route('/auth',
          Post('/login')
            .reply(() => 'hello world'),
          Post('/logout')
            .reply(() => 'bye')
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
    .routing(() =>
      Route('/', 
        Post('/login')
          .reply(() => 'hello world')
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
    .routing(() =>
      Route('/', 
        Post('/login')
          .reply(() => 'hello world')
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
    .routing(() => 
      Route('/',
        Get()
          .reply(() => 'user')
      ),
    );

  const app = rabast()
    .routing(() =>
      Route('/', 
        Route('/auth',
          Post('/login')
            .reply(() => 'hello world'),
          Post('/logout')
            .reply(() => 'bye')
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

t.test('should match route and rabast subroutes with conditions', async t => {
  const user = rabast()
    .routing(() => 
      Route('/',
        Get()
          .reply(() => 'user')
      ),
    );

  const app = rabast()
    .routing(() =>
      Route('/', 
        Route('/auth',
          Post('/login')
            .test((request, user) => request.body.username === user.username && request.body.password === user.password)
            .with({ username: 'tom', password: 'tompassword' }, () => 'hello world'),
          Post('/unauthorizedlogin')
            .test((request, user) => request.body.username === user.username && request.body.password === user.password)
            .with({ username: 'alice', password: 'alicepassword' }, () => 'hello world')
            .otherwise(() => new Unauthorized('Unauthorized')),
          Post('/logout')
            .reply(() => 'bye')
        ),
        Route('/user',
          user
        )
      ),
    );

  let response = await app.inject({
    url: '/auth/login',
    method: 'POST',
    body: {
      username: 'tom',
      password: 'tompassword'
    }
  });

  t.same(response, new Ok('hello world'));

  response = await app.inject({
    url: '/auth/unauthorizedlogin',
    method: 'POST',
    body: {
      username: 'tom',
      password: 'tompassword'
    }
  });

  t.same(response, new Unauthorized('Unauthorized'));

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
