# Telegram Bot Setup Guide

## Configuration

### Environment Variables
The Telegram bot token can be configured using:
1. **Environment variable**: `TELEGRAM_BOT_TOKEN` (recommended for production)
2. **Properties file**: `telegram.bot.token` in `application.properties`

### Configuration Files

#### Default Configuration (`application.properties`)
```properties
telegram.bot.token=${TELEGRAM_BOT_TOKEN:YOUR_BOT_TOKEN_HERE}
telegram.bot.username=crm_english_school_bot
telegram.bot.enabled=false
```

#### Development Configuration (`application-dev.properties`)
```properties
telegram.bot.token=${TELEGRAM_BOT_TOKEN:dev_bot_token_placeholder}
telegram.bot.username=crm_english_school_dev_bot
telegram.bot.enabled=true
```

#### Production Configuration (`application-prod.properties`)
```properties
telegram.bot.token=${TELEGRAM_BOT_TOKEN}
telegram.bot.username=crm_english_school_bot
telegram.bot.enabled=true
```

## Setup Instructions

### 1. Create a Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create a new bot
4. Copy the bot token provided by BotFather

### 2. Configure the Bot Token

#### Option A: Environment Variable (Recommended)
```bash
export TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
```

#### Option B: Properties File
Edit `application.properties`:
```properties
telegram.bot.token=your_actual_bot_token_here
telegram.bot.enabled=true
```

### 3. Enable the Bot
Set `telegram.bot.enabled=true` in your active profile configuration.

### 4. Run with Specific Profile

#### Development
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Production
```bash
export TELEGRAM_BOT_TOKEN=your_production_token
export SPRING_PROFILES_ACTIVE=prod
./mvnw spring-boot:run
```

## Security Best Practices

1. **Never commit real tokens** to version control
2. Use environment variables for production deployments
3. Use different bots for development and production
4. Regularly rotate bot tokens
5. Keep token secure and never share publicly

## Validation

The application will validate the bot token on startup:
- Development: Shows warning if token is not configured
- Production: Throws exception if token is not configured properly

## Troubleshooting

### Common Issues

1. **Token not working**: Ensure the token is copied correctly from BotFather
2. **Bot not responding**: Check if `telegram.bot.enabled=true`
3. **403 Forbidden**: Verify bot token is correct
4. **Connection issues**: Check internet connectivity and Telegram API status

### Logs
Check application logs for configuration validation messages:
- Successful configuration: "Telegram bot configuration loaded successfully"
- Configuration issues: Warning messages with instructions

## API Documentation

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)