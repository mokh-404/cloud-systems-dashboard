// Mock API service with realistic error handling and loading states
class ApiService {
  constructor() {
    this.baseURL = 'https://api.cloudsystems.com'; // Mock URL
    this.isAuthenticated = false;
    this.authToken = localStorage.getItem('authToken');
    
    if (this.authToken) {
      this.isAuthenticated = true;
    }
  }

  // Generic fetch wrapper with error handling
  async fetchData(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      // Simulate network delay for realistic loading states
      await this.simulateDelay();
      
      // Mock response based on endpoint
      const mockResponse = this.getMockResponse(endpoint, options.method || 'GET');
      
      if (!mockResponse.ok) {
        throw new Error(mockResponse.error || 'Request failed');
      }
      
      return mockResponse.data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw new Error(error.message || 'Network error occurred');
    }
  }

  // Simulate network delay (500ms - 2s)
  simulateDelay() {
    const delay = Math.random() * 1500 + 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Mock response generator
  getMockResponse(endpoint, method) {
    // Simulate random failures (10% chance)
    if (Math.random() < 0.1) {
      return {
        ok: false,
        error: 'Service temporarily unavailable'
      };
    }

    switch (endpoint) {
      case '/auth/login':
        return this.mockLogin(method);
      case '/dashboard/metrics':
        return this.mockDashboardMetrics();
      case '/servers':
        return this.mockServersList();
      case '/servers/1':
      case '/servers/2':
      case '/servers/3':
      case '/servers/4':
        return this.mockServerDetails(endpoint);
      default:
        return {
          ok: false,
          error: 'Endpoint not found'
        };
    }
  }

  mockLogin(method) {
    if (method === 'POST') {
      return {
        ok: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            email: 'admin@cloudsystems.com',
            name: 'Cloud Administrator',
            role: 'admin'
          }
        }
      };
    }
    return { ok: false, error: 'Method not allowed' };
  }

  mockDashboardMetrics() {
    return {
      ok: true,
      data: {
        totalServers: 24,
        activeServers: 22,
        totalUptime: '99.8%',
        totalStorage: '2.4 TB',
        usedStorage: '1.8 TB',
        monthlyBandwidth: '847 GB',
        activeAlerts: 3,
        cpuUsage: 68,
        memoryUsage: 74,
        networkTraffic: 156,
        recentActivity: [
          {
            id: 1,
            action: 'Server restart',
            server: 'web-server-01',
            timestamp: '2 minutes ago',
            status: 'success'
          },
          {
            id: 2,
            action: 'Backup completed',
            server: 'db-server-02',
            timestamp: '15 minutes ago',
            status: 'success'
          },
          {
            id: 3,
            action: 'High CPU usage alert',
            server: 'api-server-03',
            timestamp: '1 hour ago',
            status: 'warning'
          }
        ]
      }
    };
  }

  mockServersList() {
    return {
      ok: true,
      data: [
        {
          id: 1,
          name: 'web-server-01',
          status: 'online',
          uptime: '15 days',
          cpu: 45,
          memory: 68,
          storage: 78,
          location: 'US East',
          ip: '192.168.1.10'
        },
        {
          id: 2,
          name: 'db-server-02',
          status: 'online',
          uptime: '32 days',
          cpu: 23,
          memory: 82,
          storage: 65,
          location: 'US West',
          ip: '192.168.1.20'
        },
        {
          id: 3,
          name: 'api-server-03',
          status: 'warning',
          uptime: '8 days',
          cpu: 89,
          memory: 76,
          storage: 45,
          location: 'EU Central',
          ip: '192.168.1.30'
        },
        {
          id: 4,
          name: 'cache-server-04',
          status: 'offline',
          uptime: '0 days',
          cpu: 0,
          memory: 0,
          storage: 34,
          location: 'Asia Pacific',
          ip: '192.168.1.40'
        }
      ]
    };
  }

  mockServerDetails(endpoint) {
    const serverId = endpoint.split('/').pop();
    const servers = {
      '1': {
        id: 1,
        name: 'web-server-01',
        status: 'online',
        uptime: '15 days, 4 hours',
        cpu: 45,
        memory: 68,
        storage: 78,
        location: 'US East (Virginia)',
        ip: '192.168.1.10',
        os: 'Ubuntu 22.04 LTS',
        specs: {
          cores: 4,
          ram: '16 GB',
          disk: '500 GB SSD'
        },
        metrics: {
          networkIn: '125 MB/s',
          networkOut: '89 MB/s',
          diskRead: '45 MB/s',
          diskWrite: '23 MB/s'
        },
        services: [
          { name: 'nginx', status: 'running', port: 80 },
          { name: 'nodejs', status: 'running', port: 3000 },
          { name: 'redis', status: 'running', port: 6379 }
        ]
      },
      '2': {
        id: 2,
        name: 'db-server-02',
        status: 'online',
        uptime: '32 days, 12 hours',
        cpu: 23,
        memory: 82,
        storage: 65,
        location: 'US West (Oregon)',
        ip: '192.168.1.20',
        os: 'CentOS 8',
        specs: {
          cores: 8,
          ram: '32 GB',
          disk: '1 TB SSD'
        },
        metrics: {
          networkIn: '67 MB/s',
          networkOut: '34 MB/s',
          diskRead: '156 MB/s',
          diskWrite: '89 MB/s'
        },
        services: [
          { name: 'postgresql', status: 'running', port: 5432 },
          { name: 'pgbouncer', status: 'running', port: 6432 }
        ]
      }
    };

    return {
      ok: true,
      data: servers[serverId] || servers['1']
    };
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await this.fetchData('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.token) {
        this.authToken = response.token;
        this.isAuthenticated = true;
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error('Invalid credentials or server error');
    }
  }

  logout() {
    this.authToken = null;
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Dashboard methods
  async getDashboardMetrics() {
    return await this.fetchData('/dashboard/metrics');
  }

  // Server methods
  async getServers() {
    return await this.fetchData('/servers');
  }

  async getServerDetails(serverId) {
    return await this.fetchData(`/servers/${serverId}`);
  }

  async restartServer(serverId) {
    // Simulate server restart
    await this.simulateDelay();
    return {
      success: true,
      message: `Server ${serverId} restart initiated`
    };
  }

  async stopServer(serverId) {
    // Simulate server stop
    await this.simulateDelay();
    return {
      success: true,
      message: `Server ${serverId} stopped successfully`
    };
  }

  async startServer(serverId) {
    // Simulate server start
    await this.simulateDelay();
    return {
      success: true,
      message: `Server ${serverId} started successfully`
    };
  }

  // Utility methods
  isLoggedIn() {
    return this.isAuthenticated && this.authToken;
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

// Named exports for specific functions
export const {
  login,
  logout,
  getDashboardMetrics,
  getServers,
  getServerDetails,
  restartServer,
  stopServer,
  startServer,
  isLoggedIn,
  getCurrentUser
} = apiService;
