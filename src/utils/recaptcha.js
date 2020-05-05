export async function getReCAPTCHAToken() {
  const readyPromise = new Promise((resolve, reject) => grecaptcha.ready(resolve));
  await readyPromise;
  return await grecaptcha.execute('6LfW6u8UAAAAAEOrBF9FepgePLQXlzjie06TXxJK', { action: 'social' });
}