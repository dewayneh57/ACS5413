// Model for Settings
class Settings {
  constructor({ viewStyle = "grid" } = {}) {
    this.viewStyle = viewStyle; // "grid" or "list"
  }
}

export default Settings;
