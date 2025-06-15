# 1단계: 빌드
FROM maven:3.8.6-eclipse-temurin-17 AS builder

WORKDIR /app
COPY . .

# WAR 파일 빌드
RUN mvn clean package -DskipTests

# 2단계: 실행
FROM tomcat:9.0-jdk17

# 기존 webapps 제거
RUN rm -rf /usr/local/tomcat/webapps/*

# 빌드된 WAR 복사
COPY --from=builder /app/target/game-item-marketplace-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
