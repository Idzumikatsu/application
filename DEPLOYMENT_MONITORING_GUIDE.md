# Deployment and Monitoring Guide

## System Overview

CRM Synergy uses Docker Compose for deployment with Traefik as reverse proxy. Monitoring includes Prometheus, Grafana, Loki, and Promtail.

## Deployment Process

### Prerequisites
- Docker Compose v2
- Node 18+, Java 17, Maven
- Git repository access

### Quick Deployment
```bash
cd /opt/application
./quick-deploy.sh
```

### Full Deployment
```bash
cd /opt/application
./deploy.sh
```

### Manual Steps
1. Build frontend: `npm i && npm run build`
2. Build backend: `mvn clean package`
3. Run: `docker compose up -d`
4. Check logs: `docker compose logs -f`

## Monitoring Setup

### Components
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and visualization
- **Loki**: Log aggregation
- **Promtail**: Log shipping

### Access
- Grafana: https://grafana.crm-synergy.ru (admin/admin)
- Prometheus: https://prometheus.crm-synergy.ru
- Loki: https://loki.crm-synergy.ru

### Key Metrics
- HTTP response times
- CPU/Memory usage
- Database connections
- Error rates

### Alerts
- Service unavailability
- High error rates
- Resource thresholds

## AOT Compilation and Optimization

### Lazy Initialization
Enabled in prod/test profiles for faster startup.

### Native Image Build
```bash
mvn -Pnative native:compile
```

## Backup and Recovery

### Backup Script
```bash
./scripts/admin-panel-backup.sh
```

### Restore Script
```bash
./scripts/admin-panel-restore.sh backup.tar.gz
```

### Cron Jobs
Daily backups at 02:00, weekly at 01:00 Sundays.

## Troubleshooting

### Deployment Issues
- Check Docker logs
- Verify environment variables
- Ensure port availability

### Monitoring Issues
- Validate Prometheus targets
- Check Grafana data sources
- Review Promtail logs

## CI/CD Integration

GitHub Actions workflow for automated testing, building, and deployment.

## Security

- Change default Grafana password
- Use HTTPS for all services
- Restrict monitoring access