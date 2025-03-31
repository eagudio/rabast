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
      Route('/login', 
        Post()
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
        Route('/login',
          Post()
            .reply(() => 'hello world')
        )
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
        Get()
          .reply(() => 'hi'),
        Route('/login',
          Post()
            .reply(() => 'hello world')
        )
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
          Route('/',
            Get()
              .reply(() => 'cerea'),
          ),
          Route('/login',
            Post()
              .reply(() => 'hello world')
          )
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
          Route('/login',
            Post()
              .reply(() => 'hello world')
          ),
          Route('/logout',
            Post()
              .reply(() => 'bye')
          )
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
        Route('/login',
          Post()
            .reply(() => 'hello world')
        )
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
        Route('/login',
          Post()
            .reply(() => 'hello world')
        )
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
      Route('/user',
        Get()
          .reply(() => 'user')
      ),
    );

  const app = rabast()
    .routing(() =>
      Route('/', 
        Route('/auth',
          Route('/login',
            Post()
              .reply(() => 'hello world')
          ),
          Route('/logout',
            Post()
              .reply(() => 'bye')
          )
        ),
        Route('/users',
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
    url: '/users/user',
    method: 'GET',
  });

  t.same(response, new Ok('user'));
});

t.test('should match route and rabast subroutes with conditions', async t => {
  const user = rabast()
    .routing(() => 
      Route('/user',
        Get()
          .reply(() => 'user')
      ),
    );

  const app = rabast()
    .routing(() =>
      Route('/', 
        Route('/auth',
          Route('/login',
            Post()
              .test((request, user) => request.body.username === user.username && request.body.password === user.password)
              .with({ username: 'tom', password: 'tompassword' }, () => 'hello world'),
          ),
          Route('/unauthorizedlogin',
            Post()
              .test((request, user) => request.body.username === user.username && request.body.password === user.password)
              .with({ username: 'alice', password: 'alicepassword' }, () => 'hello world')
              .otherwise(() => new Unauthorized('Unauthorized')),
          ),
          Route('/logout',
            Post()
              .reply(() => 'bye')
          )
        ),
        Route('/users',
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
    url: '/users/user',
    method: 'GET',
  });

  t.same(response, new Ok('user'));
});

t.test('should match the correct route with parameters', async t => {
  const app = rabast();

  app
    .routing(() =>
      Route('/login/:username/:password', 
        Post()
          .reply((request) => `hello ${request.params.username} ${request.params.password}`)
      ),
    );

  let response = await app.inject({
    url: '/login/tom/tompassword',
    method: 'POST',
  });

  t.same(response, new Ok('hello tom tompassword'));

  response = await app.inject({
    url: '/login/alice/alicepassword',
    method: 'POST',
  });

  t.same(response, new Ok('hello alice alicepassword'));
});

t.test('should match the correct route with query parameters', async t => {
  const app = rabast();

  app
    .routing(() =>
      Route('/login', 
        Post()
          .reply((request) => `hello ${request.query.username} ${request.query.password}`)
      ),
    );

  let response = await app.inject({
    url: '/login?username=tom&password=tompassword',
    method: 'POST',
  });

  t.same(response, new Ok('hello tom tompassword'));

  response = await app.inject({
    url: '/login?username=alice&password=alicepassword',
    method: 'POST',
  });

  t.same(response, new Ok('hello alice alicepassword'));
});

t.test('should match the correct route with url parameters and query parameters', async t => {
  const app = rabast();

  app
    .routing(() =>
      Route('/login/:username/:password', 
        Post()
          .reply((request) => `hello ${request.params.username} ${request.params.password} ${request.query.param1} ${request.query.param2}!`)
      ),
    );

  let response = await app.inject({
    url: '/login/tom/tompassword?param1=hello&param2=cerea',
    method: 'POST',
  });

  t.same(response, new Ok('hello tom tompassword hello cerea!'));

  response = await app.inject({
    url: '/login/alice/alicepassword?param1=hello&param2=cerea',
    method: 'POST',
  });

  t.same(response, new Ok('hello alice alicepassword hello cerea!'));
});

t.test('should match the correct route with url parameters and same query parameters', async t => {
  const app = rabast();

  app
    .routing(() =>
      Route('/:name', 
        Get()
          .reply((request) => `hello ${request.params.name} query: ${request.query.t}`)
      ),
    );

  let response = await app.inject({
    url: '/tom?t=cerea',
    method: 'GET',
  });

  t.same(response, new Ok('hello tom query: cerea'));

  response = await app.inject({
    url: '/alice?t=badola',
    method: 'GET',
  });

  t.same(response, new Ok('hello alice query: badola'));
});
