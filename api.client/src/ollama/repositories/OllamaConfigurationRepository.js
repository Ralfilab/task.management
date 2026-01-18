class OllamaConfigurationRepository {
  static storageKey = 'ollamaConfiguration';

  static get() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      const defaultConfig = {
        enabled: false,
        baseUrl: 'http://localhost:11434',
        model: 'gemma3:1b',
        lastRun: null
      };
      this.save(defaultConfig);
      return defaultConfig;
    }
    return JSON.parse(saved);
  }

  static save(config) {
    localStorage.setItem(this.storageKey, JSON.stringify(config));
  }

  static updateLastRun() {
    const config = this.get();
    config.lastRun = new Date().toISOString();
    this.save(config);
  }

  static isEnabled() {
    const config = this.get();
    return config.enabled === true;
  }
}

export default OllamaConfigurationRepository;
