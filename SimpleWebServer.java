import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;

public class SimpleWebServer {
    // Render에서 사용하는 환경 변수 PORT를 확인하고, 없으면 8080을 기본값으로 사용
    private static final int PORT = Integer.parseInt(System.getenv("PORT") != null ? System.getenv("PORT") : "8080");
    private static final String PROJECT_PATH = ".";

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/", new StaticFileHandler(PROJECT_PATH));
        server.setExecutor(Executors.newCachedThreadPool());
        server.start();
        System.out.println("Server started. Access at http://localhost:" + PORT);
    }

    static class StaticFileHandler implements HttpHandler {
        private final String rootPath;
        private final Map<String, String> mimeTypes;

        public StaticFileHandler(String rootPath) {
            this.rootPath = rootPath;
            mimeTypes = new HashMap<>();
            mimeTypes.put("html", "text/html");
            mimeTypes.put("css", "text/css");
            mimeTypes.put("js", "application/javascript");
            mimeTypes.put("jpg", "image/jpeg");
            mimeTypes.put("jpeg", "image/jpeg");
            mimeTypes.put("png", "image/png");
            mimeTypes.put("gif", "image/gif");
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String requestPath = exchange.getRequestURI().getPath();
            
            // Serve index.html as default page
            if (requestPath.equals("/")) {
                requestPath = "/index.html";
            }

            Path filePath = Paths.get(rootPath, requestPath);
            File file = filePath.toFile();

            if (!file.exists() || file.isDirectory()) {
                // Return 404 if file doesn't exist
                String response = "404 (Not Found)";
                exchange.sendResponseHeaders(404, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }

            // Check file extension
            String extension = getFileExtension(file);
            String contentType = mimeTypes.getOrDefault(extension, "application/octet-stream");

            // Set Content-Type header
            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, file.length());

            // Send file content
            try (OutputStream os = exchange.getResponseBody();
                 FileInputStream fs = new FileInputStream(file)) {
                final byte[] buffer = new byte[1024];
                int count;
                while ((count = fs.read(buffer)) >= 0) {
                    os.write(buffer, 0, count);
                }
            }
        }

        private String getFileExtension(File file) {
            String fileName = file.getName();
            int dotIndex = fileName.lastIndexOf('.');
            return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
        }
    }
}
