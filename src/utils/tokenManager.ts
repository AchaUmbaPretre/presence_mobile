import AsyncStorage from "@react-native-async-storage/async-storage";

class TokenManager {
  private static instance: TokenManager;
  private token: string | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;

    try {
      this.token = await AsyncStorage.getItem("token");
      return this.token;
    } catch {
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    this.token = token;
    try {
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du token:", error);
    }
  }

  async clearToken(): Promise<void> {
    this.token = null;
    try {
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Erreur lors de la suppression du token:", error);
    }
  }

  // Méthode synchrone pour les intercepteurs
  getTokenSync(): string | null {
    return this.token;
  }
}

export const tokenManager = TokenManager.getInstance();
