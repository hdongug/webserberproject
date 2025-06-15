# 1단계: 빌드
FROM maven:3.8.6-eclipse-temurin-11 AS builder

WORKDIR /app
COPY . .

# 컴파일 및 JAR 생성
RUN mkdir -p target/classes \
    && javac -d target/classes SimpleWebServer.java \
    && cd target/classes \
    && jar cvf ../simple-web-server.jar *.class

# 2단계: 실행
FROM eclipse-temurin:11-jre

WORKDIR /app

# 컴파일된 JAR과 정적 파일 복사
COPY --from=builder /app/target/simple-web-server.jar /app/
COPY *.html /app/
COPY style.css /app/
COPY css/ /app/css/
COPY js/ /app/js/
COPY PNG/ /app/PNG/

EXPOSE 8080

CMD ["java", "-cp", "simple-web-server.jar", "SimpleWebServer"]
