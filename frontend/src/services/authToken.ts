public getTokenExpiration(): Date | null {
    try {
      const token = this.getToken();
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }