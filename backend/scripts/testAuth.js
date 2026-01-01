(async () => {
  try {
    const base = 'http://localhost:5000/api';
    const email = `test+${Date.now()}@example.com`;
    const password = 'TestPass123!';

    console.log('Signing up user:', email);
    const signupRes = await fetch(`${base}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Automated Test', email, phone: '', password })
    });
    const signup = await signupRes.json();
    console.log('signup status', signupRes.status, 'body:', JSON.stringify(signup));

    console.log('Signing in...');
    const signinRes = await fetch(`${base}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const signin = await signinRes.json();
    console.log('signin status', signinRes.status, 'body:', JSON.stringify(signin));

    const token = signin.token || signin.data?.token || signup.token || signup.data?.token || (signin.data && signin.data.token);
    if (!token) {
      console.error('No token returned; aborting test.');
      process.exit(1);
    }

    console.log('Using token to call protected admin route /admin/users');
    const usersRes = await fetch(`${base}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const users = await usersRes.json();
    console.log('/admin/users status', usersRes.status, 'body:', JSON.stringify(users));

    process.exit(0);
  } catch (err) {
    console.error('testAuth error:', err);
    process.exit(2);
  }
})();
