const KEY = "cmx.localProfile.v1";

export const localProfileStore = Object.freeze({
  async getProfile() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  },
  async saveProfile(profile) {
    localStorage.setItem(KEY, JSON.stringify(profile));
  },
  async resetProfile() {
    localStorage.removeItem(KEY);
  }
});
