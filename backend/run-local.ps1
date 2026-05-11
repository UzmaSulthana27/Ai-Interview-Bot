# run-local.ps1 - Local Development Backend Startup Script
# This script sets up environment variables for local development

# Set your local database credentials
$env:DB_URL = "jdbc:mysql://localhost:3306/interview_bot"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your_mysql_password"
$env:GROQ_API_KEY = "your_groq_api_key"

# Optional: Set Spring profile to local to use application-local.properties
$env:SPRING_PROFILES_ACTIVE = "local"

Write-Host "Starting Interview Bot Backend..."
Write-Host "Database: $($env:DB_URL)"
Write-Host "Username: $($env:DB_USERNAME)"
Write-Host ""

# Run the backend
.\mvnw.cmd spring-boot:run

# Clean up (optional)
Remove-Item env:DB_URL
Remove-Item env:DB_USERNAME
Remove-Item env:DB_PASSWORD
Remove-Item env:GROQ_API_KEY
Remove-Item env:SPRING_PROFILES_ACTIVE

# Local Development Configuration
spring.datasource.url=jdbc:mysql://your_aiven_host:your_port/interview_bot
spring.datasource.username=your_aiven_username
spring.datasource.password=your_aiven_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
groq.api.key=your_groq_key
server.port=8080
logging.level.root=INFO
logging.level.com.interviewbot.backend=DEBUG
