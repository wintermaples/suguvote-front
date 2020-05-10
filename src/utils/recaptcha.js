export async function getReCAPTCHAToken() {
  const readyPromise = new Promise((resolve, reject) => {
    try {
      grecaptcha.ready(resolve);
    } catch(err) {
      reject(err);
    }
  });
  await readyPromise;
  return await grecaptcha.execute('6LfW6u8UAAAAAEOrBF9FepgePLQXlzjie06TXxJK', { action: 'social' });
}