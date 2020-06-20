export class ReCAPTCHAHelpers {
  static async getReCAPTCHAToken() {
    const readyPromise = new Promise((resolve, reject) => {
      try {
        grecaptcha.ready(resolve);
      } catch(err) {
        reject(err);
      }
    });
    await readyPromise;
    return await grecaptcha.execute('6LePqfUUAAAAAF2z92sp8NZHefeLlddEAx7102WS', { action: 'social' });
  }
}
